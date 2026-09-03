<?php

declare(strict_types=1);

namespace App\Demo;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DemoDashboardController
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('Demo/Dashboard', DemoDashboard::for(
            (string) $request->query('state', 'populated'),
        ));
    }
}
