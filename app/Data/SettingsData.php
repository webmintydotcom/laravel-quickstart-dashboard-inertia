<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\User;
use Spatie\LaravelData\Data;

final class SettingsData extends Data
{
    public function __construct(
        public string $appearance,
        public string $timezone,
    ) {}

    /**
     * Built from the model explicitly, for the same reason UserData is: letting
     * laravel-data infer the shape normalises through toArray(), which would
     * hand the front end an enum instance rather than its string value.
     */
    public static function fromModel(User $user): self
    {
        return new self(
            appearance: $user->appearance->value,
            timezone: $user->timezone,
        );
    }
}
