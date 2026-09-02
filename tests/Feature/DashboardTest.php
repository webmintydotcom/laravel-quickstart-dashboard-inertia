<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function (): void {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can view the dashboard', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('Dashboard'));
});

test('the authenticated user is shared with every page', function (): void {
    $user = User::factory()->create(['first_name' => 'Ada', 'last_name' => 'Lovelace']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has(
                    'auth.user',
                    fn (AssertableInertia $prop) => $prop
                        ->where('name', 'Ada Lovelace')
                        ->where('email', $user->email)
                        ->etc()
                )
        );
});

test('guests are shared a null user', function (): void {
    $this->get('/')
        ->assertInertia(fn (AssertableInertia $page) => $page->where('auth.user', null));
});

test('the flash prop is shared with every page', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (AssertableInertia $page) => $page->has('flash')->where('flash.status', null));
});

test('a flashed status reaches the page props', function (): void {
    Notification::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email])
        ->assertSessionHas('status', trans(Password::RESET_LINK_SENT));

    $this->get(route('password.request'))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Auth/ForgotPassword')
                ->where('flash.status', trans(Password::RESET_LINK_SENT))
        );
});
