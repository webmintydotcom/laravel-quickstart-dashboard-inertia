<?php

declare(strict_types=1);

namespace App\Demo;

use Spatie\LaravelData\Data;

/**
 * The whole record, for the detail and edit screens.
 *
 * Formatted fields appear twice - once raw, once as a *_label - because the two
 * screens need different things from the same value: <input type="date"> wants
 * 2022-03-14 and a reader wants 14 Mar 2022. Sending both is cheaper than
 * shipping a date library to the browser, and keeps every display string
 * formatted in one place, on the server.
 */
final class VehicleData extends Data
{
    public function __construct(
        public string $stock_number,
        public string $vin,
        public ?string $license_plate,
        public string $make,
        public string $model,
        public int $year,
        public string $color,
        public string $body_type,
        public string $body_type_label,
        public string $fuel_type,
        public string $fuel_type_label,
        public int $odometer,
        public string $odometer_label,
        public string $status,
        public string $status_label,
        public ?string $assigned_driver,
        public bool $bookable,
        public string $purchased_on,
        public string $purchased_on_label,
        public ?string $last_serviced_on,
        public ?string $last_serviced_on_label,
        /** Dollars, as a fixed-point string, because that is what the form edits. */
        public string $purchase_price,
        public string $purchase_price_label,
        public ?string $notes,
    ) {}

    public static function fromModel(Vehicle $vehicle): self
    {
        return new self(
            stock_number:           $vehicle->stock_number,
            vin:                    $vehicle->vin,
            license_plate:          $vehicle->license_plate,
            make:                   $vehicle->make,
            model:                  $vehicle->model,
            year:                   $vehicle->year,
            color:                  $vehicle->color,
            body_type:              $vehicle->body_type->value,
            body_type_label:        $vehicle->body_type->label(),
            fuel_type:              $vehicle->fuel_type->value,
            fuel_type_label:        $vehicle->fuel_type->label(),
            odometer:               $vehicle->odometer,
            odometer_label:         number_format($vehicle->odometer) . ' mi',
            status:                 $vehicle->status->value,
            status_label:           $vehicle->status->label(),
            assigned_driver:        $vehicle->assigned_driver,
            bookable:               $vehicle->bookable,
            purchased_on:           $vehicle->purchased_on->format('Y-m-d'),
            purchased_on_label:     $vehicle->purchased_on->format('j M Y'),
            last_serviced_on:       $vehicle->last_serviced_on?->format('Y-m-d'),
            last_serviced_on_label: $vehicle->last_serviced_on?->format('j M Y'),
            // The column is cents. Both of these are dollars.
            purchase_price:         number_format($vehicle->purchase_price / 100, 2, '.', ''),
            purchase_price_label:   '$' . number_format($vehicle->purchase_price / 100, 2),
            notes:                  $vehicle->notes,
        );
    }
}
