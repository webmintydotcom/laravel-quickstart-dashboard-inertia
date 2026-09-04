<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

/**
 * Intentionally unrouted while the demo dashboard is installed. This is the
 * fallback that removing the demo dashboard's code restores: point the
 * /dashboard route back at this class and it renders again unmodified.
 */
final class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Dashboard');
    }
}
