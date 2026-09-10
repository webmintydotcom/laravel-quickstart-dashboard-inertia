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

            // bootstrap/cache holds Laravel's generated provider and package manifests.
            // Registering the demo's provider bakes its FQCN into services.php on the
            // next boot, in CI and in a fresh clone alike. That file is build output,
            // never hand-authored and never committed, so a reference there is not a
            // widening of the removal surface - it disappears with `optimize:clear`.
            if (str_starts_with($relative, 'bootstrap/cache/')) {
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

/**
 * scanForDemoReferences() catches App\Demo, Pages/Demo and 'Demo/ - none of
 * which appear in route('vehicles.show', ...) or its siblings. A route name is
 * just a string, so a new reference to one - a Welcome page CTA, a breadcrumb
 * helper, a command palette entry - could land in any file outside the demo
 * and pass the scan above silently. This is that same style of scan, aimed at
 * the vehicle demo's route-name surface instead of its class/component names,
 * so the sabotage test below exercises the real guard rather than a
 * reimplementation that could drift from it.
 *
 * @return list<string>
 */
function scanForVehicleRouteReferences(): array
{
    $offenders = [];

    // routes/web.php declares the route names; navigation.ts links to
    // 'vehicles.index' by name. Both are named explicitly, the same way
    // scanForDemoReferences() names its own two exceptions.
    $allowed = ['routes/web.php', 'resources/js/components/app-shell/navigation.ts'];

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
                || str_starts_with($relative, 'bootstrap/cache/')
                || in_array($relative, $allowed, true)
            ) {
                continue;
            }

            $contents = (string) file_get_contents($file->getPathname());

            if (preg_match('#vehicles\.(index|show|edit|update)#', $contents) === 1) {
                $offenders[] = $relative;
            }
        }
    }

    return $offenders;
}

test('nothing outside the demo namespace references its route names', function (): void {
    expect(scanForVehicleRouteReferences())->toBe([]);
});

test('a vehicles route-name reference outside the allow-list is caught', function (): void {
    // Guards against the exact failure scenario this scan exists for: a CTA or
    // helper elsewhere using route('vehicles.show', ...) directly, which the
    // App\Demo / Pages/Demo / 'Demo/ scan above cannot see.
    $path = base_path('resources/js/_demo_isolation_sabotage.ts');
    file_put_contents($path, "route('vehicles.show', { vehicle: id })\n");

    try {
        expect(scanForVehicleRouteReferences())->toContain('resources/js/_demo_isolation_sabotage.ts');
    } finally {
        unlink($path);
    }
});

test('nothing outside the demo namespace references it', function (): void {
    // Both files are permitted because they are the two steps of the demo's
    // documented removal contract: routes/web.php wires up the dashboard route,
    // and bootstrap/providers.php registers DemoServiceProvider.
    $allowed = ['routes/web.php', 'bootstrap/providers.php'];

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

test('bootstrap/providers.php is the only other permitted reference', function (): void {
    // Named explicitly so that if the registration moves, this test says where to look.
    expect(file_get_contents(base_path('bootstrap/providers.php')))
        ->toContain('App\Demo\DemoServiceProvider');
});

test('a demo reference under bootstrap outside the provider list is caught', function (): void {
    // bootstrap/ is scanned, but the allow-list names one file in it. A second
    // file quietly reaching for the demo would widen the removal surface.
    $path = base_path('bootstrap/_demo_isolation_sabotage.php');
    file_put_contents($path, "<?php\n\nreturn [App\\Demo\\DemoServiceProvider::class];\n");

    try {
        expect(scanForDemoReferences())->toContain('bootstrap/_demo_isolation_sabotage.php');
    } finally {
        unlink($path);
    }
});

test('the navigation entry the demo adds is accounted for', function (): void {
    // navigation.ts links by route name, so it never trips the scan above - the
    // string 'vehicles.index' contains nothing that looks like the demo. That
    // makes it the one piece of the removal contract no scan can enforce, which
    // is exactly why it gets a test of its own: this file disappears with the
    // demo, and until it does it fails loudly if the entry is renamed or moved.
    expect(file_get_contents(base_path('resources/js/components/app-shell/navigation.ts')))
        ->toContain("route: 'vehicles.index'");
});
