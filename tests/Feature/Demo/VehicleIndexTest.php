<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

beforeEach(function (): void {
    $this->actingAs(User::factory()->create());
});

test('guests are sent to login', function (): void {
    auth()->logout();

    $this->get(route('vehicles.index'))->assertRedirect(route('login'));
});

test('the list renders the first page of the fleet', function (): void {
    $this->get(route('vehicles.index'))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Demo/Vehicles/Index')
                ->where('vehicles.status', 'ready')
                ->has('vehicles.rows', 10)
                ->where('vehicles.meta.total', 45)
                ->where('vehicles.meta.last_page', 5)
                ->where('vehicles.meta.from', 1)
                ->where('vehicles.meta.to', 10)
                ->where('vehicles.links.prev', null)
                ->where('filters.q', '')
                ->where('filters.status', '')
                ->where('filters.sort', 'stock_number')
                ->where('filters.direction', 'asc')
                ->has('statusOptions', 4)
        );
});

test('the last page holds the remainder', function (): void {
    $this->get(route('vehicles.index', ['page' => 5]))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('vehicles.rows', 5)
                ->where('vehicles.meta.current_page', 5)
                ->where('vehicles.links.next', null)
        );
});

test('a row carries what the table renders and nothing more', function (): void {
    $this->get(route('vehicles.index'))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('vehicles.rows.0.stock_number', 'FL-1000')
                ->where('vehicles.rows.0.make', 'Ford')
                ->where('vehicles.rows.0.model', 'Transit 350')
                ->where('vehicles.rows.0.year', 2022)
                ->where('vehicles.rows.0.status', 'available')
                ->where('vehicles.rows.0.status_label', 'Available')
                ->where('vehicles.rows.0.odometer_label', '48,210 mi')
                ->where('vehicles.rows.0.purchased_on_label', '14 Mar 2022')
                ->where('vehicles.rows.0.assigned_driver', 'Priya Raman')
        );
});

test('search matches across the columns a person would type into it', function (
    string $term,
    int $expected,
): void {
    $this->get(route('vehicles.index', ['q' => $term]))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('vehicles.meta.total', $expected));
})->with([
    'make'         => ['Tesla', 3],
    'model'        => ['Sprinter', 1],
    'stock number' => ['FL-1042', 1],
    'driver'       => ['Priya', 6],
    'plate'        => ['FLT-4021', 1],
    'no matches'   => ['nothing here', 0],
]);

test('the status filter narrows to one status', function (string $status, int $expected): void {
    $this->get(route('vehicles.index', ['status' => $status]))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('vehicles.meta.total', $expected));
})->with([
    'available'      => ['available', 27],
    'in service'     => ['in_service', 8],
    'in maintenance' => ['in_maintenance', 5],
    'retired'        => ['retired', 5],
]);

test('an unrecognised status filter is ignored rather than erroring', function (): void {
    $this->get(route('vehicles.index', ['status' => 'on_fire']))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('filters.status', '')
                ->where('vehicles.meta.total', 45)
        );
});

test('each sortable column orders the fleet', function (
    string $sort,
    string $direction,
    string $firstStockNumber,
): void {
    $this->get(route('vehicles.index', ['sort' => $sort, 'direction' => $direction]))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('vehicles.rows.0.stock_number', $firstStockNumber));
})->with([
    'stock number ascending'  => ['stock_number', 'asc', 'FL-1000'],
    'stock number descending' => ['stock_number', 'desc', 'FL-1044'],
    // Ties break on stock number, so this is stable rather than incidental:
    // five vehicles share the year 2019 and FL-1006 is the lowest of them.
    'year ascending'         => ['year', 'asc', 'FL-1006'],
    'year descending'        => ['year', 'desc', 'FL-1044'],
    'odometer descending'    => ['odometer', 'desc', 'FL-1025'],
    // Ordered by make then model. Chevrolet is the first make, and its first
    // model alphabetically is the Bolt EUV - not the Silverado that appears
    // earlier in the fixtures, and not the Equinox.
    'make ascending'         => ['make', 'asc', 'FL-1007'],
]);

test('an unknown sort or direction falls back instead of reaching the query', function (): void {
    // The whitelist is the defence against an injected orderBy. If this test
    // ever fails, do not "fix" it by widening the whitelist.
    $this->get(route('vehicles.index', ['sort' => 'stock_number); drop table demo_vehicles;--', 'direction' => 'sideways']))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('filters.sort', 'stock_number')
                ->where('filters.direction', 'asc')
                ->where('vehicles.meta.total', 45)
        );
});

test('sorting inside a search keeps the search', function (): void {
    $this->get(route('vehicles.index', ['q' => 'Ford', 'sort' => 'year', 'direction' => 'desc']))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('filters.q', 'Ford')
                ->where('filters.sort', 'year')
                ->where('vehicles.meta.total', 6)
                ->where('vehicles.rows.0.stock_number', 'FL-1020')
        );
});

test('a pagination link keeps the filters it was built under', function (): void {
    // The pager renders these URLs verbatim. If withQueryString() is ever
    // dropped from the controller, turning the page silently drops the search.
    $this->get(route('vehicles.index', ['q' => 'o', 'sort' => 'year', 'direction' => 'desc']))
        ->assertInertia(function (AssertableInertia $page): void {
            $next = $page->toArray()['props']['vehicles']['links']['next'];

            expect($next)->toContain('q=o')
                ->and($next)->toContain('sort=year')
                ->and($next)->toContain('direction=desc')
                ->and($next)->toContain('page=2');
        });
});

test('the last page has no next link and the first has no previous', function (): void {
    $this->get(route('vehicles.index'))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('vehicles.links.prev', null));

    $this->get(route('vehicles.index', ['page' => 5]))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('vehicles.links.next', null));
});
