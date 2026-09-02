<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelData\Data;

final class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $first_name,
        public string $last_name,
        public string $name,
        public string $email,
        public ?string $avatar_url,
    ) {}

    /**
     * Build from a model explicitly rather than letting laravel-data infer it.
     *
     * Inference normalises the model through toArray(), which omits `name` - it is
     * an accessor and is not in the model's $appends.
     */
    public static function fromModel(User $user): self
    {
        // getRawOriginal(), not the avatar_path accessor: a User resolved via
        // actingAs() in tests has no 'avatar_path' key in its attributes at
        // all when the factory doesn't set one, and Model::shouldBeStrict()
        // turns that into a MissingAttributeException. See the same pattern
        // in StoreAvatar and AvatarController.
        $avatarPath = $user->getRawOriginal('avatar_path');

        return new self(
            id: $user->id,
            first_name: $user->first_name,
            last_name: $user->last_name,
            name: $user->name,
            email: $user->email,
            avatar_url: $avatarPath === null
                ? null
                : Storage::disk('public')->url($avatarPath),
        );
    }
}
