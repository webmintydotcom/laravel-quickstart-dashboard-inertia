<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

// Session rows only persist under the database driver; see the same beforeEach
// in LogoutOtherSessionsTest.php - phpunit.xml sets SESSION_DRIVER=array suite-wide.
beforeEach(function (): void {
    config(['session.driver' => 'database']);
});

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

test('deleting the account removes the user\'s session rows', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('profile'));

    DB::table('sessions')->insert([
        'id'            => 'another-session-id',
        'user_id'       => $user->id,
        'ip_address'    => '203.0.113.9',
        'user_agent'    => 'Mozilla/5.0',
        'payload'       => '',
        'last_activity' => now()->subHour()->getTimestamp(),
    ]);

    expect(DB::table('sessions')->where('user_id', $user->id)->count())->toBe(2);

    $this->actingAs($user)->delete(route('profile.destroy'), ['password' => 'password']);

    expect(DB::table('sessions')->where('user_id', $user->id)->count())->toBe(0);
});
