<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

test('fortify registers routes for the enabled features', function (): void {
    expect(Route::has('login'))->toBeTrue()
        ->and(Route::has('login.store'))->toBeTrue()
        ->and(Route::has('logout'))->toBeTrue()
        ->and(Route::has('register'))->toBeTrue()
        ->and(Route::has('register.store'))->toBeTrue()
        ->and(Route::has('password.request'))->toBeTrue()
        ->and(Route::has('password.email'))->toBeTrue()
        ->and(Route::has('password.reset'))->toBeTrue()
        ->and(Route::has('password.update'))->toBeTrue();
});

test('fortify does not register routes for the disabled features', function (): void {
    expect(Route::has('verification.notice'))->toBeFalse()
        ->and(Route::has('user-password.update'))->toBeFalse()
        ->and(Route::has('user-profile-information.update'))->toBeFalse()
        ->and(Route::has('two-factor.login'))->toBeFalse()
        ->and(Route::has('passkey.login'))->toBeFalse();
});

test('fortify sends authenticated users to the dashboard', function (): void {
    expect(config('fortify.home'))->toBe('/dashboard');
});

test('login throttling stays inside fortify pipeline', function (): void {
    // A named limiter would remove EnsureLoginIsNotThrottled from Fortify's login
    // pipeline, turning a throttled login into a raw 429 instead of a form error.
    expect(config('fortify.limiters.login'))->toBeNull();
});
