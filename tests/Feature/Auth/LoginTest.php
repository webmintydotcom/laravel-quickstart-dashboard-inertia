<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('the login screen can be rendered', function (): void {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('Auth/Login'));
});

test('users can authenticate with valid credentials', function (): void {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email'    => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

test('users cannot authenticate with an invalid password', function (): void {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email'    => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('login is throttled after five failed attempts', function (): void {
    $user = User::factory()->create();

    foreach (range(1, 5) as $ignored) {
        $this->post(route('login.store'), [
            'email'    => $user->email,
            'password' => 'wrong-password',
        ]);
    }

    $this->post(route('login.store'), [
        'email'    => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    expect(session('errors')->first('email'))->toContain('Too many login attempts');
});

test('authenticated users are redirected away from the login screen', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('login'))
        ->assertRedirect(route('dashboard'));
});
