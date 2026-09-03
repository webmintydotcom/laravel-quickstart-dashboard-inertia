<?php

declare(strict_types=1);

namespace App\Actions\Profile;

use App\Models\User;
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
        // getRawOriginal(), not the avatar_path accessor: see the same idiom in
        // StoreAvatar and AvatarController. A User instance that never had this
        // column selected or defaulted has no 'avatar_path' key in its attributes
        // at all, and Model::shouldBeStrict() turns direct access into a
        // MissingAttributeException. getRawOriginal() tolerates the key being
        // absent, returning null either way.
        $path = $user->getRawOriginal('avatar_path');

        if ($path !== null) {
            Storage::disk('public')->delete($path);
        }

        $user->delete();
    }
}
