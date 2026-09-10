<?php

declare(strict_types=1);

namespace App\Demo;

enum VehicleStatus: string
{
    case Available = 'available';
    case InService = 'in_service';
    case InMaintenance = 'in_maintenance';
    case Retired = 'retired';

    public function label(): string
    {
        return match ($this) {
            self::Available     => 'Available',
            self::InService     => 'In service',
            self::InMaintenance => 'In maintenance',
            self::Retired       => 'Retired',
        };
    }

    /**
     * The shape the front end's <Select> options expect. Built here rather than
     * in the controller so the label lives next to the case it belongs to.
     *
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case): array => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }
}
