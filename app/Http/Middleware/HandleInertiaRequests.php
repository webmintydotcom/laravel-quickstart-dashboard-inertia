<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Data\UserData;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /** @return array<string, mixed> */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth'  => [
                'user' => $user === null ? null : UserData::from($user),
            ],
            'flash' => [
                'status' => $request->session()->get('status'),
            ],
            'appearance'       => HandleAppearance::resolve($request),
            'sidebarCollapsed' => $request->cookie('sidebar_collapsed') === '1',
            // Ziggy builds its route list in the browser, from the @routes Blade
            // directive - a global that Node never sees. Without this prop, every
            // component calling route() during render throws under SSR, which is
            // every auth screen and, through the sidebar, every signed-in page.
            // Inertia catches it and falls back to client rendering, so the
            // failure is silent: SSR simply stops happening. resources/js/ssr.tsx
            // reads this and hands it to Ziggy before rendering anything.
            'ziggy'            => fn (): array => [
                ...(new Ziggy)->toArray(),
                // route().current() needs somewhere to read the path from. In the
                // browser that's window.location; in Node there is no window.
                'location' => $request->url(),
            ],
        ];
    }
}
