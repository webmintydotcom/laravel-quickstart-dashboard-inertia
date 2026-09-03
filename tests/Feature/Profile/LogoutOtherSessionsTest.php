<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\DB;

// The suite runs with SESSION_DRIVER=array so unrelated tests never touch the
// database, but "other sessions" only exist when sessions are actually
// persisted. Scoping the database driver to this file, rather than flipping it
// globally in phpunit.xml, keeps that persistence real for these tests without
// making every other test's request hit the sessions table (one plain-PHPUnit
// test in this suite has no migrated schema at all and would break the moment
// session start needs a real table).
beforeEach(function (): void {
    config(['session.driver' => 'database']);
});

test('other sessions are removed and the current one survives', function (): void {
    $user = User::factory()->create();

    // A test request never carries a session cookie into the next call (unlike
    // a real browser), so without this the "current" request always mints a
    // brand-new session id that matches no row yet. Capturing the id this first
    // request persisted and replaying it as the cookie on the second request is
    // what makes that second request's session the one already sitting in the
    // sessions table, so it survives as "current".
    $this->actingAs($user)->get(route('profile'));
    $currentSessionId = DB::table('sessions')->where('user_id', $user->id)->value('id');

    DB::table('sessions')->insert([
        'id'            => 'another-session-id',
        'user_id'       => $user->id,
        'ip_address'    => '203.0.113.9',
        'user_agent'    => 'Mozilla/5.0',
        'payload'       => '',
        'last_activity' => now()->subHour()->getTimestamp(),
    ]);

    expect(DB::table('sessions')->where('user_id', $user->id)->count())->toBe(2);

    $this->actingAs($user)
        ->withCookie(config('session.cookie'), $currentSessionId)
        ->delete(route('profile.sessions.destroy'), ['password' => 'password'])
        ->assertRedirect();

    expect(DB::table('sessions')->where('user_id', $user->id)->count())->toBe(1);
    expect(DB::table('sessions')->where('user_id', $user->id)->value('id'))->toBe($currentSessionId);
    $this->assertAuthenticated();
});

test('a wrong password leaves other sessions alone', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('profile'));
    $currentSessionId = DB::table('sessions')->where('user_id', $user->id)->value('id');

    DB::table('sessions')->insert([
        'id'            => 'another-session-id',
        'user_id'       => $user->id,
        'ip_address'    => '203.0.113.9',
        'user_agent'    => 'Mozilla/5.0',
        'payload'       => '',
        'last_activity' => now()->subHour()->getTimestamp(),
    ]);

    $this->actingAs($user)
        ->withCookie(config('session.cookie'), $currentSessionId)
        ->delete(route('profile.sessions.destroy'), ['password' => 'nope'])
        ->assertSessionHasErrors('password', errorBag: 'logoutOtherSessions');

    expect(DB::table('sessions')->where('user_id', $user->id)->count())->toBe(2);
});

test('logging out other devices does not touch another user\'s sessions', function (): void {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $this->actingAs($user)->get(route('profile'));
    $currentSessionId = DB::table('sessions')->where('user_id', $user->id)->value('id');

    DB::table('sessions')->insert([
        'id'            => 'other-users-session-id',
        'user_id'       => $otherUser->id,
        'ip_address'    => '203.0.113.9',
        'user_agent'    => 'Mozilla/5.0',
        'payload'       => '',
        'last_activity' => now()->subHour()->getTimestamp(),
    ]);

    $this->actingAs($user)
        ->withCookie(config('session.cookie'), $currentSessionId)
        ->delete(route('profile.sessions.destroy'), ['password' => 'password'])
        ->assertRedirect();

    expect(DB::table('sessions')->where('id', 'other-users-session-id')->exists())->toBeTrue();
});
