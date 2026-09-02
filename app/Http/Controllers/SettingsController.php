<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Data\SettingsData;
use App\Http\Requests\SettingsUpdateRequest;
use DateTimeImmutable;
use DateTimeZone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class SettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Settings', [
            'settings'  => SettingsData::from($request->user()),
            'timezones' => $this->groupedTimezones(),
        ]);
    }

    public function update(SettingsUpdateRequest $request): RedirectResponse
    {
        $request->user()->update($request->validated());

        return to_route('settings')
            ->with('status', 'settings-updated')
            // Mirrors the record into the cookie so the very next request paints
            // the right theme even before Inertia props are read.
            ->withCookie(cookie()->forever('appearance', $request->string('appearance')->value()));
    }

    /**
     * @return array<string, list<array{value: string, label: string, offset: string}>>
     */
    private function groupedTimezones(): array
    {
        $grouped = [];
        $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));

        foreach (timezone_identifiers_list() as $identifier) {
            $parts = explode('/', $identifier, 2);

            $offset = (new DateTimeZone($identifier))->getOffset($now);
            $hours = intdiv($offset, 3600);
            $minutes = abs($offset % 3600) / 60;

            // An identifier with no '/' (e.g. UTC, which is also the timezone
            // column's own migration default) doesn't belong to a region.
            // Group those under "Other" instead of dropping them, or every
            // new user would open settings to a blank timezone field.
            [$region, $label] = isset($parts[1])
                ? [$parts[0], str_replace('_', ' ', $parts[1])]
                : ['Other', $identifier];

            $grouped[$region][] = [
                'value'  => $identifier,
                'label'  => $label,
                'offset' => sprintf('UTC%s%02d:%02d', $offset >= 0 ? '+' : '-', abs($hours), $minutes),
            ];
        }

        ksort($grouped);

        return $grouped;
    }
}
