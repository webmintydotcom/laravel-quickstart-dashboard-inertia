<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('a user can delete their account with the correct password', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete(route('profile.destroy'), ['password' => 'password'])
        ->assertRedirect('/');

    expect(User::find($user->id))->toBeNull();
    $this->assertGuest();
});

test('a wrong password leaves the account intact', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete(route('profile.destroy'), ['password' => 'not-the-password'])
        ->assertSessionHasErrors('password', errorBag: 'deleteAccount');

    expect(User::find($user->id))->not->toBeNull();
    $this->assertAuthenticated();
});

test('deleting the account removes the avatar file', function (): void {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)->post(route('profile.avatar.store'), [
        'avatar' => UploadedFile::fake()->image('portrait.jpg', 400, 400),
    ]);

    $path = $user->refresh()->avatar_path;

    $this->actingAs($user)->delete(route('profile.destroy'), ['password' => 'password']);

    Storage::disk('public')->assertMissing($path);
});

test('guests cannot delete an account', function (): void {
    $this->delete(route('profile.destroy'), ['password' => 'password'])
        ->assertRedirect(route('login'));
});
