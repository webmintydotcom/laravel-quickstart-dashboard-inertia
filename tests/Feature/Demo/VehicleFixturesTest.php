<?php

declare(strict_types=1);

use App\Demo\BodyType;
use App\Demo\FuelType;
use App\Demo\Vehicle;
use App\Demo\VehicleStatus;
use Illuminate\Support\Carbon;

test('the migration leaves a full fleet in the database', function (): void {
    expect(Vehicle::count())->toBe(45);
});

test('stock numbers and VINs are unique and well formed', function (): void {
    $vehicles = Vehicle::query()->get(['stock_number', 'vin']);

    expect($vehicles->pluck('stock_number')->unique())->toHaveCount(45)
        ->and($vehicles->pluck('vin')->unique())->toHaveCount(45)
        ->and($vehicles->pluck('stock_number')->first())->toBe('FL-1000');

    // The VIN column is 17 characters wide because a real VIN is. A fixture that
    // quietly truncates would make the detail page look wrong for no visible reason.
    $vehicles->each(fn (Vehicle $vehicle) => expect(mb_strlen($vehicle->vin))->toBe(17));
});

test('every enum value has at least one vehicle behind it', function (): void {
    // Each filter option in the toolbar must select something, or the demo teaches
    // that filtering is broken.
    foreach (VehicleStatus::cases() as $case) {
        expect(Vehicle::query()->where('status', $case->value)->exists())->toBeTrue();
    }

    foreach (BodyType::cases() as $case) {
        expect(Vehicle::query()->where('body_type', $case->value)->exists())->toBeTrue();
    }

    foreach (FuelType::cases() as $case) {
        expect(Vehicle::query()->where('fuel_type', $case->value)->exists())->toBeTrue();
    }
});

test('the nullable columns each have a real case', function (): void {
    // The detail page renders an em dash for these. Without a fixture that is
    // actually null, nothing ever exercises that branch.
    expect(Vehicle::query()->whereNull('assigned_driver')->exists())->toBeTrue()
        ->and(Vehicle::query()->whereNull('license_plate')->exists())->toBeTrue()
        ->and(Vehicle::query()->whereNull('last_serviced_on')->exists())->toBeTrue()
        ->and(Vehicle::query()->whereNull('notes')->exists())->toBeTrue();
});

test('the model casts its enums and dates', function (): void {
    $vehicle = Vehicle::query()->where('stock_number', 'FL-1000')->firstOrFail();

    expect($vehicle->status)->toBeInstanceOf(VehicleStatus::class)
        ->and($vehicle->body_type)->toBeInstanceOf(BodyType::class)
        ->and($vehicle->fuel_type)->toBeInstanceOf(FuelType::class)
        ->and($vehicle->purchased_on)->toBeInstanceOf(Carbon::class)
        ->and($vehicle->bookable)->toBeBool();
});

test('the route key is the stock number', function (): void {
    expect((new Vehicle)->getRouteKeyName())->toBe('stock_number');
});

test('the fixtures are deterministic', function (): void {
    expect(App\Demo\VehicleFixtures::rows())->toBe(App\Demo\VehicleFixtures::rows());
});

test('no fixture is dated in the future or serviced before it was bought', function (): void {
    Vehicle::query()->get()->each(function (Vehicle $vehicle): void {
        expect($vehicle->purchased_on->isFuture())->toBeFalse();

        if ($vehicle->last_serviced_on !== null) {
            expect($vehicle->last_serviced_on->lessThan($vehicle->purchased_on))->toBeFalse()
                ->and($vehicle->last_serviced_on->isFuture())->toBeFalse();
        }
    });
});
