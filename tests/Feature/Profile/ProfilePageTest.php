<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

// The suite runs with SESSION_DRIVER=array so unrelated tests never touch the
// database, but the session list this page renders only exists when sessions
// are actually persisted. Scoping the database driver to this file, rather
// than flipping it globally in phpunit.xml, keeps that persistence real for
// these tests without making every other test's request hit the sessions
// table (one plain-PHPUnit test in this suite has no migrated schema at all
// and would break the moment session start needs a real table).
beforeEach(function (): void {
    config(['session.driver' => 'database']);
});

test('guests are redirected to the login page', function (): void {
    $this->get(route('profile'))->assertRedirect(route('login'));
});

test('the profile page renders with the current details', function (): void {
    $user = User::factory()->create(['first_name' => 'Ada', 'last_name' => 'Lovelace']);

    $this->actingAs($user)
        ->get(route('profile'))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Profile')
                ->where('profile.first_name', 'Ada')
                ->where('profile.email', $user->email)
                ->where('profile.avatar_url', null)
        );
});

test('the session list marks exactly one session as current', function (): void {
    $user = User::factory()->create();

    // A test request never carries a session cookie into the next call (unlike
    // a real browser), so without this the "current" request always mints a
    // brand-new session id that matches no row yet. Capturing the id this first
    // request persisted and replaying it as the cookie on the second request is
    // what makes that second request's session the one already sitting in the
    // sessions table, so it can be recognised as current.
    $this->actingAs($user)->get(route('profile'));
    $currentSessionId = DB::table('sessions')->where('user_id', $user->id)->value('id');

    DB::table('sessions')->insert([
        'id'            => 'another-session-id',
        'user_id'       => $user->id,
        'ip_address'    => '203.0.113.9',
        'user_agent'    => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
        'payload'       => '',
        'last_activity' => now()->subHour()->getTimestamp(),
    ]);

    $this->actingAs($user)
        ->withCookie(config('session.cookie'), $currentSessionId)
        ->get(route('profile'))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('sessions', 2)
                ->where('sessions.0.is_current', true)
                ->where('sessions.1.is_current', false)
                ->where('sessions.1.ip_address', '203.0.113.9')
                ->where('sessions.1.device', 'Firefox on Windows')
        );
});

test('session ids never reach the client', function (): void {
    // A session id is a credential. SessionData has no id field by construction;
    // this asserts the property rather than trusting that.
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('profile'));

    $response = $this->actingAs($user)->get(route('profile'));

    $sessions = $response->viewData('page')['props']['sessions'];

    foreach ($sessions as $session) {
        expect(array_keys($session))->toBe(['device', 'ip_address', 'last_active', 'is_current']);
    }
});

test('another user\'s sessions are not listed', function (): void {
    $user = User::factory()->create();
    $other = User::factory()->create();

    DB::table('sessions')->insert([
        'id'            => 'someone-elses-session',
        'user_id'       => $other->id,
        'ip_address'    => '198.51.100.4',
        'user_agent'    => 'Mozilla/5.0',
        'payload'       => '',
        'last_activity' => now()->getTimestamp(),
    ]);

    $this->actingAs($user)
        ->get(route('profile'))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('sessions', fn ($sessions) => $sessions->pluck('ip_address')->doesntContain('198.51.100.4'))
        );
});
