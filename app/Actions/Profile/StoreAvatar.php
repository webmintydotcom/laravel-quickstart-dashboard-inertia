<?php

declare(strict_types=1);

namespace App\Actions\Profile;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
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
        $encoded = (new ImageManager(new Driver()))
            ->decode($file->getRealPath())
            ->cover(256, 256)
            ->encode(new WebpEncoder(quality: 82));

        $path = 'avatars/' . Str::uuid()->toString() . '.webp';

        Storage::disk('public')->put($path, (string) $encoded);

        // getRawOriginal(), not the avatar_path accessor: a User resolved via
        // actingAs() in tests (or any instance that never had this column selected
        // or defaulted) has no 'avatar_path' key in its attributes at all, and
        // Model::shouldBeStrict() turns that direct access into a
        // MissingAttributeException. getRawOriginal() reads the raw attribute array
        // and tolerates the key being absent, returning null either way.
        $previous = $user->getRawOriginal('avatar_path');

        $user->forceFill(['avatar_path' => $path])->save();

        // Only after the new path is committed, so a failed write never leaves the
        // user with a path pointing at a file that no longer exists.
        if ($previous !== null) {
            Storage::disk('public')->delete($previous);
        }
    }
}
