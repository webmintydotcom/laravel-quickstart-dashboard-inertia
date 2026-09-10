<?php

declare(strict_types=1);

namespace App\Demo;

enum FuelType: string
{
    case Petrol = 'petrol';
    case Diesel = 'diesel';
    case Hybrid = 'hybrid';
    case Electric = 'electric';

    public function label(): string
    {
        return match ($this) {
            self::Petrol   => 'Petrol',
            self::Diesel   => 'Diesel',
            self::Hybrid   => 'Hybrid',
            self::Electric => 'Electric',
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
