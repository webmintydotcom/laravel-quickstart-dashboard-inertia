<?php

declare(strict_types=1);

namespace App\Actions\Profile;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

final class DeleteAccount
{
    /**
     * The starter has no other models, so nothing cascades today. An application
     * built on it adds its own cleanup here - files, subscriptions, owned records -
     * before the user row goes.
     */
    public function __invoke(User $user): void
    {
        $path = $user->avatar_path;

        if ($path !== null) {
            Storage::disk('public')->delete($path);
        }

        // The user's own session rows outlive the invalidate() call the controller
        // makes on the current session alone - that only destroys the session the
        // request arrived on. Without this, a deleted account's IP, user agent and
        // serialized payload sit in the sessions table indefinitely. This only
        // deletes anything under SESSION_DRIVER=database; see the README.
        DB::table('sessions')->where('user_id', $user->id)->delete();

        $user->delete();
    }
}
