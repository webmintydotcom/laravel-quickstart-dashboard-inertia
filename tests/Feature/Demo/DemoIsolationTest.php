<?php

declare(strict_types=1);

/**
 * The removal contract is this cycle's whole point: deleting app/Demo and
 * resources/js/Pages/Demo, then pointing the dashboard route back at
 * DashboardController, must be sufficient. This test is what keeps that true as
 * the starter grows.
 */
test('nothing outside the demo namespace references it', function (): void {
    $allowed = ['routes/web.php'];
    $offenders = [];

    foreach (['app', 'resources/js', 'config', 'database', 'bootstrap', 'routes'] as $directory) {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator(base_path($directory), FilesystemIterator::SKIP_DOTS),
        );

        foreach ($files as $file) {
            if (! $file->isFile()) {
                continue;
            }

            $relative = str_replace(base_path() . '/', '', $file->getPathname());

            if (str_starts_with($relative, 'app/Demo') || str_starts_with($relative, 'resources/js/Pages/Demo')) {
                continue;
            }

            $contents = (string) file_get_contents($file->getPathname());

            if (preg_match('#App\\\\Demo|Pages/Demo|@/Pages/Demo#', $contents) === 1) {
                $offenders[] = $relative;
            }
        }
    }

    expect(array_diff($offenders, $allowed))->toBe([]);
});

test('routes/web.php is the only permitted reference', function (): void {
    // Named explicitly so that if the route binding moves, this test says where to look.
    expect(file_get_contents(base_path('routes/web.php')))->toContain('App\Demo\DemoDashboardController');
});
