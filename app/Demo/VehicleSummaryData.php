<?php

declare(strict_types=1);

namespace App\Demo;

use Spatie\LaravelData\Data;

/**
 * One row of the index table - and only what that table renders. The full
 * record is VehicleData, used by the detail and edit screens.
 */
final class VehicleSummaryData extends Data
{
    public function __construct(
        public string $stock_number,
        public string $make,
        public string $model,
        public int $year,
        public string $color,
        public string $status,
        public string $status_label,
        public int $odometer,
        public string $odometer_label,
        public ?string $assigned_driver,
        public string $purchased_on_label,
    ) {}

    public static function fromModel(Vehicle $vehicle): self
    {
        return new self(
            stock_number: $vehicle->stock_number,
            make: $vehicle->make,
            model: $vehicle->model,
            year: $vehicle->year,
            color: $vehicle->color,
            status: $vehicle->status->value,
            status_label: $vehicle->status->label(),
            odometer: $vehicle->odometer,
            // Formatted server-side, like every other display string in this
            // starter, so the front end needs no date or number library.
            odometer_label: number_format($vehicle->odometer) . ' mi',
            assigned_driver: $vehicle->assigned_driver,
            purchased_on_label: $vehicle->purchased_on->format('j M Y'),
        );
    }
}
