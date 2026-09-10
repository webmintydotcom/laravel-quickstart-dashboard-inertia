<?php

declare(strict_types=1);

namespace App\Demo;

enum BodyType: string
{
    case Sedan = 'sedan';
    case Suv = 'suv';
    case Van = 'van';
    case Pickup = 'pickup';
    case Hatchback = 'hatchback';

    public function label(): string
    {
        return match ($this) {
            self::Sedan     => 'Sedan',
            self::Suv       => 'SUV',
            self::Van       => 'Van',
            self::Pickup    => 'Pickup',
            self::Hatchback => 'Hatchback',
        };
    }

    /** @return list<array{value: string, label: string}> */
    public static function options(): array
    {
        return array_map(
            fn (self $case): array => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }
}
