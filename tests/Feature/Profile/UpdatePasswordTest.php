<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('a user can change their password', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('user-password.update'), [
            'current_password'      => 'password',
            'password'              => 'new-secret-password',
            'password_confirmation' => 'new-secret-password',
        ])
        ->assertRedirect();

    expect(Hash::check('new-secret-password', $user->refresh()->password))->toBeTrue();
});

test('a wrong current password is rejected', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('user-password.update'), [
            'current_password'      => 'not-the-password',
            'password'              => 'new-secret-password',
            'password_confirmation' => 'new-secret-password',
        ])
        ->assertSessionHasErrors('current_password', errorBag: 'updatePassword');

    expect(Hash::check('password', $user->refresh()->password))->toBeTrue();
});

test('the new password must be confirmed', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('user-password.update'), [
            'current_password'      => 'password',
            'password'              => 'new-secret-password',
            'password_confirmation' => 'different-password',
        ])
        ->assertSessionHasErrors('password', errorBag: 'updatePassword');
});

test('the shared password rules apply', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('user-password.update'), [
            'current_password'      => 'password',
            'password'              => 'short',
            'password_confirmation' => 'short',
        ])
        ->assertSessionHasErrors('password', errorBag: 'updatePassword');
});
