<?php

declare(strict_types=1);

/**
 * The removal contract is this cycle's whole point: deleting app/Demo,
 * resources/js/Pages/Demo and tests/Feature/Demo, then pointing the dashboard
 * route back at DashboardController, must be sufficient. This test is what
 * keeps that true as the starter grows.
 *
 * The scan and its skip list are factored into scanForDemoReferences() so the
 * sabotage tests below exercise the exact same code path as the real guard,
 * rather than a reimplementation that could quietly drift from it.
 *
 * @return list<string>
 */
function scanForDemoReferences(): array
{
    $offenders = [];

    foreach (['app', 'resources/js', 'resources/views', 'config', 'database', 'bootstrap', 'routes', 'tests'] as $directory) {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator(base_path($directory), FilesystemIterator::SKIP_DOTS),
        );

        foreach ($files as $file) {
            if (! $file->isFile()) {
                continue;
            }

            $relative = str_replace(base_path() . '/', '', $file->getPathname());

            if (
                str_starts_with($relative, 'app/Demo')
                || str_starts_with($relative, 'resources/js/Pages/Demo')
                || str_starts_with($relative, 'tests/Feature/Demo')
            ) {
                continue;
            }

            $contents = (string) file_get_contents($file->getPathname());

            // The quote-anchored alternative catches the bare Inertia component name
            // ('Demo/Dashboard') as a string literal, without flagging incidental
            // prose that happens to contain the characters "Demo/". The FQCN
            // alternative matches one-or-more backslashes so it also catches the
            // escaped form a double-quoted PHP string or JSON blob would carry
            // (e.g. "App\\Demo\\DemoDashboardController"), not just a bare "App\Demo".
            if (preg_match('#App\\\\+Demo|Pages/Demo|@/Pages/Demo|[\'"]Demo/#', $contents) === 1) {
                $offenders[] = $relative;
            }
        }
    }

    return $offenders;
}

test('nothing outside the demo namespace references it', function (): void {
    $allowed = ['routes/web.php'];

    expect(array_diff(scanForDemoReferences(), $allowed))->toBe([]);
});

test('routes/web.php is the only permitted reference', function (): void {
    // Named explicitly so that if the route binding moves, this test says where to look.
    expect(file_get_contents(base_path('routes/web.php')))->toContain('App\Demo\DemoDashboardController');
});

test('a demo reference under tests/ outside tests/Feature/Demo is caught', function (): void {
    // tests/ used to be excluded from the scan entirely, so a leak here - exactly
    // where the demo's own tests live - would pass silently.
    $path = base_path('tests/Feature/_demo_isolation_sabotage.php');
    file_put_contents($path, "<?php\n\n// Sabotage: references App\\Demo\\DemoDashboardController directly.\n");

    try {
        expect(scanForDemoReferences())->toContain('tests/Feature/_demo_isolation_sabotage.php');
    } finally {
        unlink($path);
    }
});

test('a demo reference under resources/views is caught', function (): void {
    // resources/views used to be excluded from the scan, so a Blade file wiring
    // up the demo's component directly would pass silently.
    $path = base_path('resources/views/_demo_isolation_sabotage.blade.php');
    file_put_contents($path, "@vite(['resources/js/Pages/Demo/Dashboard.tsx'])\n");

    try {
        expect(scanForDemoReferences())->toContain('resources/views/_demo_isolation_sabotage.blade.php');
    } finally {
        unlink($path);
    }
});

test('an escaped FQCN with doubled backslashes is caught', function (): void {
    // A PHP double-quoted string or a JSON blob referencing the controller escapes
    // its backslashes, so the bytes on disk are "App\\Demo\\..." (two backslashes),
    // which the previous single-backslash-only alternative did not match.
    $path = base_path('config/_demo_isolation_sabotage.json');
    file_put_contents($path, '{"controller": "App\\\\Demo\\\\DemoDashboardController"}');

    try {
        expect(scanForDemoReferences())->toContain('config/_demo_isolation_sabotage.json');
    } finally {
        unlink($path);
    }
});
