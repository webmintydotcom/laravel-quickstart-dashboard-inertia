<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //https://planetscale.com/blog/laravels-safety-mechanisms

        // Prevent lazy loading of relationships in development to avoid N+1 query issues.
        Model::preventLazyLoading();

        // But in production, log the violation instead of throwing an exception.
        if ($this->app->isProduction()) {
            Model::handleLazyLoadingViolationUsing(function ($model, $relation): void {
                $class = $model::class;

                info("Attempted to lazy load [{$relation}] on model [{$class}].");
            });
            DB::prohibitDestructiveCommands();
        } else {
            Model::preventAccessingMissingAttributes();
            Model::preventSilentlyDiscardingAttributes();
            Model::shouldBeStrict();
        }

        Vite::usePrefetchStrategy('aggressive');
    }
}
