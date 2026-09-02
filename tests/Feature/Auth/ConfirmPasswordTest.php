<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('the confirm password screen can be rendered', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('password.confirm'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('Auth/ConfirmPassword'));
});

test('guests cannot reach the confirm password screen', function (): void {
    $this->get(route('password.confirm'))->assertRedirect(route('login'));
});

test('the password can be confirmed', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('password.confirm.store'), ['password' => 'password'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('dashboard'));

    expect(session('auth.password_confirmed_at'))->not->toBeNull();
});

test('the password is not confirmed with an invalid password', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('password.confirm.store'), ['password' => 'wrong-password'])
        ->assertSessionHasErrors('password');

    expect(session('auth.password_confirmed_at'))->toBeNull();
});
