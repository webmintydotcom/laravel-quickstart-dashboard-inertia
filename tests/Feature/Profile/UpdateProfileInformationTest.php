<?php

declare(strict_types=1);

use App\Models\User;

test('a user can update their name and email', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('user-profile-information.update'), [
            'first_name' => 'Ada',
            'last_name'  => 'Lovelace',
            'email'      => 'ada@example.com',
        ])
        ->assertRedirect();

    expect($user->refresh()->first_name)->toBe('Ada')
        ->and($user->last_name)->toBe('Lovelace')
        ->and($user->email)->toBe('ada@example.com');
});

test('changing the email clears the verification timestamp', function (): void {
    // Verification is not enabled until cycle 2b. Clearing it now means enabling
    // that cycle does not silently leave every changed address trusted.
    $user = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($user)
        ->put(route('user-profile-information.update'), [
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'email'      => 'moved@example.com',
        ]);

    expect($user->refresh()->email_verified_at)->toBeNull();
});

test('keeping the same email leaves the verification timestamp alone', function (): void {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($user)
        ->put(route('user-profile-information.update'), [
            'first_name' => 'Ada',
            'last_name'  => $user->last_name,
            'email'      => $user->email,
        ]);

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('an email belonging to another user is rejected', function (): void {
    $taken = User::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('user-profile-information.update'), [
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'email'      => $taken->email,
        ])
        ->assertSessionHasErrors('email', errorBag: 'updateProfileInformation');
});

test('a name failing the person-name rule is rejected', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('user-profile-information.update'), [
            'first_name' => '<script>',
            'last_name'  => $user->last_name,
            'email'      => $user->email,
        ])
        ->assertSessionHasErrors('first_name', errorBag: 'updateProfileInformation');
});

test('guests cannot update profile information', function (): void {
    $this->put(route('user-profile-information.update'), [])->assertRedirect(route('login'));
});
