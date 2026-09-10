<?php

declare(strict_types=1);

namespace App\Demo;

use Illuminate\Support\ServiceProvider;

/**
 * The demo's one hook into the application. It exists so the demo's migration
 * can live beside the rest of the demo instead of in database/migrations, which
 * keeps the removal contract to three directories plus a handful of one-line
 * edits. Deleting this provider's registration from bootstrap/providers.php is
 * step 2 of that contract - see the README.
 */
final class DemoServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/database/migrations');
    }
}
