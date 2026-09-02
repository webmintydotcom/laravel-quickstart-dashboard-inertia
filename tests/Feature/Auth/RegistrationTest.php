<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('the registration screen can be rendered', function (): void {
    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('Auth/Register'));
});

test('new users can register', function (): void {
    $this->post(route('register.store'), [
        'first_name'            => 'Ada',
        'last_name'             => 'Lovelace',
        'email'                 => 'ada@example.com',
        'password'              => 'analytical-engine',
        'password_confirmation' => 'analytical-engine',
    ])->assertRedirect(route('dashboard'));

    $user = User::where('email', 'ada@example.com')->firstOrFail();

    expect($user->first_name)->toBe('Ada')
        ->and($user->last_name)->toBe('Lovelace')
        ->and($user->name)->toBe('Ada Lovelace');

    $this->assertAuthenticatedAs($user);
});

test('registration requires every field', function (): void {
    $this->post(route('register.store'), [])
        ->assertSessionHasErrors(['first_name', 'last_name', 'email', 'password']);

    $this->assertGuest();
});

test('registration rejects a duplicate email', function (): void {
    $existing = User::factory()->create();

    $this->post(route('register.store'), [
        'first_name'            => 'Ada',
        'last_name'             => 'Lovelace',
        'email'                 => $existing->email,
        'password'              => 'analytical-engine',
        'password_confirmation' => 'analytical-engine',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('registration rejects a mismatched password confirmation', function (): void {
    $this->post(route('register.store'), [
        'first_name'            => 'Ada',
        'last_name'             => 'Lovelace',
        'email'                 => 'ada@example.com',
        'password'              => 'analytical-engine',
        'password_confirmation' => 'difference-engine',
    ])->assertSessionHasErrors('password');

    $this->assertGuest();
});
