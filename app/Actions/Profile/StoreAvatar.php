<?php

declare(strict_types=1);

namespace App\Actions\Profile;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Exceptions\DecoderException;
use Intervention\Image\ImageManager;

final class StoreAvatar
{
    /**
     * Resizes to a 256px square WebP. A starter that stored the upload as-is would
     * hand every cloned application a default that serves a multi-megabyte phone
     * photo as a 32px avatar.
     */
    public function __invoke(User $user, UploadedFile $file): void
    {
        try {
            $encoded = (new ImageManager(new Driver()))
                ->decode($file->getRealPath())
                ->cover(256, 256)
                ->encode(new WebpEncoder(quality: 82));
        } catch (DecoderException) {
            // A mime-valid but structurally corrupt file (a truncated PNG, an
            // animated WebP) passes the `image`/`mimes` request rules and only
            // fails here, when Intervention actually decodes it. Without this,
            // that throws past the controller as an uncaught 500 instead of the
            // field error the avatar form expects.
            throw ValidationException::withMessages([
                'avatar' => 'The avatar could not be processed. Please choose a different image.',
            ])->errorBag('updateAvatar');
        }

        $path = 'avatars/' . Str::uuid()->toString() . '.webp';

        Storage::disk('public')->put($path, (string) $encoded);

        $previous = $user->avatar_path;

        $user->forceFill(['avatar_path' => $path])->save();

        // Only after the new path is committed, so a failed write never leaves the
        // user with a path pointing at a file that no longer exists.
        if ($previous !== null) {
            Storage::disk('public')->delete($previous);
        }
    }
}
