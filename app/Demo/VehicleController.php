<?php

declare(strict_types=1);

namespace App\Demo;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

final class VehicleController
{
    private const PER_PAGE = 10;

    /**
     * The columns a visitor may sort by, mapped to the columns actually ordered.
     * A sort parameter interpolated into orderBy is a real vulnerability, and a
     * starter is exactly where someone copies the pattern from - so this is a
     * whitelist rather than a comment asking the reader to be careful.
     *
     * @var array<string, list<string>>
     */
    private const SORTS = [
        'stock_number' => ['stock_number'],
        'make'         => ['make', 'model'],
        'year'         => ['year'],
        'odometer'     => ['odometer'],
        'status'       => ['status'],
        'purchased_on' => ['purchased_on'],
    ];

    /** The columns the index table reads. Selecting less would throw under
     *  Model::preventAccessingMissingAttributes(); selecting more is dead weight. */
    private const ROW_COLUMNS = [
        'stock_number', 'make', 'model', 'year', 'color',
        'status', 'odometer', 'assigned_driver', 'purchased_on',
    ];

    /** Columns a search term is matched against. */
    private const SEARCHABLE = ['stock_number', 'vin', 'license_plate', 'make', 'model', 'assigned_driver'];

    public function index(Request $request): Response
    {
        $filters = $this->filters($request);

        $query = Vehicle::query()
            ->select(self::ROW_COLUMNS)
            ->when(
                $filters['q'] !== '',
                fn (Builder $query) => $query->where(function (Builder $inner) use ($filters): void {
                    foreach (self::SEARCHABLE as $column) {
                        $inner->orWhere($column, 'like', '%' . $filters['q'] . '%');
                    }
                }),
            )
            ->when(
                $filters['status'] !== '',
                fn (Builder $query) => $query->where('status', $filters['status']),
            );

        foreach (self::SORTS[$filters['sort']] as $column) {
            $query->orderBy($column, $filters['direction']);
        }

        // A stable tiebreak. Without it, two vehicles bought on the same day can
        // swap places between page one and page two of the same sort.
        $query->orderBy('stock_number');

        $state = $this->state($request);

        // withQueryString() is what keeps the search alive when you turn the page.
        $vehicles = $state === 'empty'
            ? new LengthAwarePaginator([], 0, self::PER_PAGE)
            : $query->paginate(self::PER_PAGE)->withQueryString();

        return Inertia::render('Demo/Vehicles/Index', [
            'vehicles' => [
                'status' => $state,
                'rows'   => VehicleSummaryData::collect($vehicles->getCollection()),
                // A hand-built meta rather than the paginator's own payload,
                // which carries fifteen keys and a links array this table
                // doesn't use.
                'meta'   => [
                    'current_page' => $vehicles->currentPage(),
                    'last_page'    => max($vehicles->lastPage(), 1),
                    'from'         => $vehicles->firstItem(),
                    'to'           => $vehicles->lastItem(),
                    'total'        => $vehicles->total(),
                ],
                'links'  => [
                    'prev' => $vehicles->previousPageUrl(),
                    'next' => $vehicles->nextPageUrl(),
                ],
            ],
            'filters'       => $filters,
            'statusOptions' => VehicleStatus::options(),
            'listQuery'     => $this->listQuery($request),
        ]);
    }

    public function show(Request $request, Vehicle $vehicle): Response
    {
        return Inertia::render('Demo/Vehicles/Show', [
            'vehicle' => VehicleData::from($vehicle),
            'backUrl' => route('vehicles.index', $this->listQuery($request)),
        ]);
    }

    public function edit(Request $request, Vehicle $vehicle): Response
    {
        return Inertia::render('Demo/Vehicles/Edit', [
            'vehicle'         => VehicleData::from($vehicle),
            'backUrl'         => route('vehicles.show', ['vehicle' => $vehicle->stock_number, ...$this->listQuery($request)]),
            'listQuery'       => $this->listQuery($request),
            'statusOptions'   => VehicleStatus::options(),
            'bodyTypeOptions' => BodyType::options(),
            'fuelTypeOptions' => FuelType::options(),
        ]);
    }

    public function update(VehicleUpdateRequest $request, Vehicle $vehicle): RedirectResponse
    {
        $vehicle->update($request->vehicleAttributes());

        // A plain sentence rather than a key, because flash-toaster.tsx falls
        // back to the raw status string when a key is unmapped. That is what
        // keeps the demo from having to add an entry to a shared component.
        return to_route('vehicles.show', ['vehicle' => $vehicle->stock_number, ...$this->listQuery($request)])
            ->with('status', 'Vehicle saved.');
    }

    /**
     * Every filter is echoed back so the toolbar renders controlled inputs and
     * every link can rebuild the current query string. Unrecognised values fall
     * back rather than erroring - the same contract the demo dashboard's
     * ?state= switch documents.
     *
     * @return array{q: string, status: string, sort: string, direction: string}
     */
    private function filters(Request $request): array
    {
        $sort = $this->queryParameter($request, 'sort', 'stock_number');
        $direction = $this->queryParameter($request, 'direction', 'asc');
        $status = $this->queryParameter($request, 'status');

        return [
            'q'         => trim($this->queryParameter($request, 'q')),
            'status'    => VehicleStatus::tryFrom($status) !== null ? $status : '',
            'sort'      => array_key_exists($sort, self::SORTS) ? $sort : 'stock_number',
            'direction' => in_array($direction, ['asc', 'desc'], true) ? $direction : 'asc',
        ];
    }

    /**
     * The index carries the same ?state= switch the demo dashboard documents, so
     * the states a data-driven list needs can be reviewed without wiring up real
     * data first. Only these two: the detail and edit screens always have a
     * record, so an empty state there would be invented rather than demonstrated.
     */
    private function state(Request $request): string
    {
        $state = $this->queryParameter($request, 'state');

        return in_array($state, ['empty', 'loading'], true) ? $state : 'ready';
    }

    /**
     * These four are list filters: they live in the URL's query string and
     * nowhere else. Request::string() would read the merged input bag, so on a
     * PATCH the edit form's own `status` field would be mistaken for the list's
     * status filter and follow the visitor back to the record they just saved.
     */
    private function queryParameter(Request $request, string $key, string $default = ''): string
    {
        $value = $request->query($key, $default);

        return is_string($value) ? $value : $default;
    }

    /**
     * The active filters and page, with every default stripped out, so a link
     * built from them stays short: /vehicles?q=Ford rather than
     * /vehicles?q=Ford&status=&sort=stock_number&direction=asc&page=1.
     *
     * Every value here has already been through filters(), so it is safe to put
     * straight into a URL - an unrecognised sort or status never survives that
     * far.
     *
     * @return array<string, string|int>
     */
    private function listQuery(Request $request): array
    {
        $filters = $this->filters($request);
        $page = max((int) $request->query('page', 1), 1);

        return array_filter([
            'q'         => $filters['q'],
            'status'    => $filters['status'],
            'sort'      => $filters['sort'] === 'stock_number' ? '' : $filters['sort'],
            'direction' => $filters['direction'] === 'asc' ? '' : $filters['direction'],
            'page'      => $page > 1 ? $page : '',
        ], fn (string|int $value): bool => $value !== '');
    }
}
