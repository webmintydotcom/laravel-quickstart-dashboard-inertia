<?php

declare(strict_types=1);

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;
use Webminty\PersonName\Rules\ValidPersonName;

final class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
    /**
     * Fortify's own action assumes a single `name` column and a Jetstream-style
     * photo. This application has first_name/last_name and handles avatars
     * separately, so the action is ours.
     *
     * @param  array<string, mixed>  $input
     */
    public function update(User $user, array $input): void
    {
        Validator::make($input, [
            'first_name' => ['required', 'string', 'max:255', new ValidPersonName],
            'last_name'  => ['required', 'string', 'max:255', new ValidPersonName],
            'email'      => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
        ])->validateWithBag('updateProfileInformation');

        $user->forceFill([
            'first_name' => $input['first_name'],
            'last_name'  => $input['last_name'],
            'email'      => $input['email'],
        ]);

        // Cycle 2b enables email verification. Clearing this on change means that
        // when it lands, a changed address is not already trusted.
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
    }
}
