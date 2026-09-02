<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Inertia\Testing\AssertableInertia;

test('the forgot password screen can be rendered', function (): void {
    $this->get(route('password.request'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('Auth/ForgotPassword'));
});

test('a reset link can be requested', function (): void {
    Notification::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class);
});

test('a reset link request for an unknown email is indistinguishable from a known one', function (): void {
    Notification::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    $knownStatus = session('status');

    expect($knownStatus)->toBe(trans(Password::RESET_LINK_SENT));

    Notification::fake();

    $this->post(route('password.email'), ['email' => 'nobody@example.com'])
        ->assertSessionHasNoErrors()
        ->assertSessionHas('status', $knownStatus);

    Notification::assertNothingSent();
});

test('a throttled reset link request still surfaces an error', function (): void {
    Notification::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email])->assertSessionHasNoErrors();

    $this->post(route('password.email'), ['email' => $user->email])->assertSessionHasErrors('email');
});

test('the reset password screen can be rendered with its token', function (): void {
    $this->get(route('password.reset', ['token' => 'a-token']))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Auth/ResetPassword')
                ->where('token', 'a-token')
        );
});

test('the password can be reset with a valid token', function (): void {
    Notification::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use ($user): bool {
        $this->post(route('password.update'), [
            'token'                 => $notification->token,
            'email'                 => $user->email,
            'password'              => 'a-brand-new-password',
            'password_confirmation' => 'a-brand-new-password',
        ])->assertRedirect(route('login'));

        expect(Hash::check('a-brand-new-password', $user->fresh()->password))->toBeTrue();

        return true;
    });
});

test('the password cannot be reset with an invalid token', function (): void {
    $user = User::factory()->create();

    $this->post(route('password.update'), [
        'token'                 => 'not-a-real-token',
        'email'                 => $user->email,
        'password'              => 'a-brand-new-password',
        'password_confirmation' => 'a-brand-new-password',
    ])->assertSessionHasErrors('email');

    expect(Hash::check('password', $user->fresh()->password))->toBeTrue();
});
