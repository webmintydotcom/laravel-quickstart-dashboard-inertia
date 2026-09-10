<?php

declare(strict_types=1);

namespace App\Demo;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * stock_number and vin are deliberately absent from the fillable list. They are
 * the two fields the edit form renders read-only - a VIN doesn't change in the
 * world, and the stock number is the URL key, so editing it would churn the
 * route on save. Leaving them unfillable means a crafted request throws under
 * Model::preventSilentlyDiscardingAttributes() rather than quietly succeeding.
 */
#[Fillable([
    'license_plate',
    'make',
    'model',
    'year',
    'color',
    'body_type',
    'fuel_type',
    'odometer',
    'status',
    'assigned_driver',
    'bookable',
    'purchased_on',
    'last_serviced_on',
    'purchase_price',
    'notes',
])]
final class Vehicle extends Model
{
    protected $table = 'demo_vehicles';

    /** Vehicles are addressed by stock number: /vehicles/FL-1042. */
    public function getRouteKeyName(): string
    {
        return 'stock_number';
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'year'             => 'integer',
            'odometer'         => 'integer',
            'purchase_price'   => 'integer',
            'bookable'         => 'boolean',
            'purchased_on'     => 'date',
            'last_serviced_on' => 'date',
            'status'           => VehicleStatus::class,
            'body_type'        => BodyType::class,
            'fuel_type'        => FuelType::class,
        ];
    }
}
