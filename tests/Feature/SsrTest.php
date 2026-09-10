<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

/**
 * Server-side rendering needs Ziggy's route list, and Ziggy only builds that
 * list in the browser - the @routes Blade directive defines a global that Node
 * never sees. Every component calling route() during render therefore threw
 * under SSR, which is every auth screen and, via the sidebar, every signed-in
 * page. Inertia caught it and fell back to client rendering, so the failure was
 * silent: the app looked fine and SSR did nothing.
 *
 * Sharing the config as a prop is what closes that gap. These tests guard the
 * server half of it; resources/js/ssr.tsx consumes what they assert.
 */
test('the ziggy config is shared with every page', function (): void {
    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('ziggy.routes')
                ->has('ziggy.url')
                ->has('ziggy.location')
        );
});

test('guests get it too, because the auth screens need it most', function (): void {
    // Login, Register and the password screens all call route() while rendering.
    // They are also the pages most worth server-rendering, being the first thing
    // a signed-out visitor loads.
    $this->get(route('login'))
        ->assertInertia(fn (AssertableInertia $page) => $page->has('ziggy.routes'));
});

test('the shared routes include the ones the pages actually call', function (): void {
    // A route list that omits what the components ask for fails exactly the way
    // the missing global did, one route at a time and only under SSR.
    //
    // Only routes that outlive the removable demo are named here. Asserting on
    // the demo's own route names would tie this file to it, and deleting the
    // demo would then break a test outside its three directories - the exact
    // coupling DemoIsolationTest exists to prevent. It caught that when this
    // test first listed them.
    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(function (AssertableInertia $page): void {
            $routes = $page->toArray()['props']['ziggy']['routes'];

            expect($routes)->toHaveKeys([
                'dashboard',
                'login',
                'settings',
                'profile',
                'password.request',
            ]);
        });
});

test('location is the current url, so route().current() resolves server side', function (): void {
    // The sidebar highlights the active entry with route().current(). Without a
    // location there is no window to fall back to in Node, so every link would
    // render inactive - or throw.
    // A permanent route, for the same reason as the test above: this file must
    // not reference the removable demo.
    $this->actingAs(User::factory()->create())
        ->get(route('settings', ['tab' => 'general']))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                // The query string is deliberately absent - Ziggy matches on the
                // path, and $request->url() is the path without the query.
                ->where('ziggy.location', route('settings'))
        );
});
