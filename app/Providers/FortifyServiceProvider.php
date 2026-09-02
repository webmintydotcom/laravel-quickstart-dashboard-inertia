<?php

declare(strict_types=1);

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\FailedPasswordResetLinkRequestResponse as FailedPasswordResetLinkRequestResponseContract;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Http\Responses\FailedPasswordResetLinkRequestResponse;
use Laravel\Fortify\Http\Responses\SuccessfulPasswordResetLinkRequestResponse;

final class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Fortify's own FailedPasswordResetLinkRequestResponse flashes "We can't find a
        // user with that email address" onto the email field, while a known address gets
        // a success status. That turns POST /forgot-password into an unauthenticated
        // account-existence oracle. Answering INVALID_USER with the success response makes
        // both cases indistinguishable. Every other failure - RESET_THROTTLED in
        // particular - still reaches the user as a real error, so do not collapse this
        // into a plain success response.
        $this->app->singleton(
            FailedPasswordResetLinkRequestResponseContract::class,
            function ($app, array $args): Responsable {
                $status = (string) $args['status'];

                return $status === Password::INVALID_USER
                    ? new SuccessfulPasswordResetLinkRequestResponse(Password::RESET_LINK_SENT)
                    : new FailedPasswordResetLinkRequestResponse($status);
            },
        );
    }

    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);

        // Inert on purpose. config('fortify.limiters.login') is null here, so Fortify keeps
        // its in-pipeline EnsureLoginIsNotThrottled step and never resolves this limiter.
        // It exists as a guard: Fortify's published config stub ships 'login' => 'login', so
        // a clone that re-publishes config/fortify.php would name a limiter that nothing had
        // registered, and Laravel's ThrottleRequests would fall through to integer parsing -
        // (int) 'login' === 0 - and reject every login attempt with a 429. Not dead code.
        RateLimiter::for('login', function (Request $request): Limit {
            $throttleKey = Str::transliterate(Str::lower((string) $request->input(Fortify::username())) . '|' . $request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        Fortify::loginView(fn () => Inertia::render('Auth/Login'));

        Fortify::registerView(fn () => Inertia::render('Auth/Register'));

        Fortify::requestPasswordResetLinkView(fn () => Inertia::render('Auth/ForgotPassword'));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('Auth/ResetPassword', [
            'token' => $request->route('token'),
            'email' => $request->query('email'),
        ]));

        // Fortify registers password.confirm, password.confirm.store and
        // password.confirmation unconditionally whenever fortify.views is true - they sit
        // behind no feature flag. ConfirmPasswordViewResponse has no default container
        // binding, so without this callback GET /user/confirm-password 500s for any
        // authenticated user the moment something reaches for the password.confirm
        // middleware.
        Fortify::confirmPasswordView(fn () => Inertia::render('Auth/ConfirmPassword'));
    }
}
