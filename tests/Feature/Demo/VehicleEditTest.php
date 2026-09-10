<?php

declare(strict_types=1);

use App\Demo\Vehicle;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

beforeEach(function (): void {
    $this->actingAs(User::factory()->create());
});

/**
 * A complete, valid payload. Every test that expects a rejection starts here and
 * breaks exactly one field, so a failure names the rule that fired rather than
 * the four unrelated ones that also would have.
 *
 * @return array<string, mixed>
 */
function vehiclePayload(array $overrides = []): array
{
    return array_merge([
        'license_plate'    => 'FLT-9001',
        'make'             => 'Ford',
        'model'            => 'Transit 350',
        'year'             => 2022,
        'color'            => 'Oxford White',
        'body_type'        => 'van',
        'fuel_type'        => 'diesel',
        'odometer'         => 52000,
        'status'           => 'in_service',
        'assigned_driver'  => 'Dana Whitfield',
        'bookable'         => false,
        'purchased_on'     => '2022-03-14',
        'last_serviced_on' => '2026-09-01',
        'purchase_price'   => '42899.00',
        'notes'            => 'Brake service completed.',
    ], $overrides);
}

test('guests are sent to login', function (): void {
    auth()->logout();

    $this->get(route('vehicles.edit', 'FL-1000'))->assertRedirect(route('login'));
    $this->patch(route('vehicles.update', 'FL-1000'), vehiclePayload())->assertRedirect(route('login'));
});

test('the form is handed the record and every set of options', function (): void {
    $this->get(route('vehicles.edit', 'FL-1000'))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Demo/Vehicles/Edit')
                ->where('vehicle.stock_number', 'FL-1000')
                ->where('vehicle.purchase_price', '42899.00')
                ->has('statusOptions', 4)
                ->has('bodyTypeOptions', 5)
                ->has('fuelTypeOptions', 4)
        );
});

test('an unknown stock number is a 404', function (): void {
    $this->get(route('vehicles.edit', 'FL-9999'))->assertNotFound();
});

// Both tests below exist because, before the Show -> Edit fix, nothing in this
// file ever put a query string on `edit` or `update`. Every request here used a
// bare /vehicles/FL-1000 URL, so listQuery, backUrl and the update() redirect
// were always exercised with an empty list of filters - the exact shape that
// hid the dead-code bug. Without a query string, [] === [] and the chain looks
// fine whether or not the filters were actually threaded through.

test('the edit backUrl carries the filters the visitor arrived with', function (): void {
    $this->get(route('vehicles.edit', ['vehicle' => 'FL-1000', 'q' => 'Ford', 'page' => 2]))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('backUrl', route('vehicles.show', ['vehicle' => 'FL-1000', 'q' => 'Ford', 'page' => 2]))
        );
});

test('saving carries the filters the visitor arrived with back to the detail page', function (): void {
    $this->patch(
        route('vehicles.update', ['vehicle' => 'FL-1000', 'q' => 'Ford', 'sort' => 'year', 'direction' => 'desc']),
        vehiclePayload(),
    )->assertRedirect(
        route('vehicles.show', ['vehicle' => 'FL-1000', 'q' => 'Ford', 'sort' => 'year', 'direction' => 'desc']),
    );
});

test('a valid change is saved and confirmed', function (): void {
    $this->patch(route('vehicles.update', 'FL-1000'), vehiclePayload())
        ->assertRedirect(route('vehicles.show', 'FL-1000'))
        ->assertSessionHas('status', 'Vehicle saved.');

    $vehicle = Vehicle::query()->where('stock_number', 'FL-1000')->firstOrFail();

    expect($vehicle->status->value)->toBe('in_service')
        ->and($vehicle->odometer)->toBe(52000)
        ->and($vehicle->assigned_driver)->toBe('Dana Whitfield')
        ->and($vehicle->bookable)->toBeFalse()
        ->and($vehicle->license_plate)->toBe('FLT-9001')
        ->and($vehicle->notes)->toBe('Brake service completed.');
});

test('the price is stored in cents', function (): void {
    // The form works in dollars and the column holds cents. If this ever starts
    // failing, check the conversion in VehicleUpdateRequest rather than widening
    // the column.
    $this->patch(route('vehicles.update', 'FL-1000'), vehiclePayload(['purchase_price' => '1234.56']));

    expect(Vehicle::query()->where('stock_number', 'FL-1000')->value('purchase_price'))->toBe(123456);
});

test('the nullable fields can be cleared', function (): void {
    $this->patch(route('vehicles.update', 'FL-1000'), vehiclePayload([
        'license_plate'    => null,
        'assigned_driver'  => null,
        'last_serviced_on' => null,
        'notes'            => null,
    ]))->assertSessionHasNoErrors();

    $vehicle = Vehicle::query()->where('stock_number', 'FL-1000')->firstOrFail();

    expect($vehicle->license_plate)->toBeNull()
        ->and($vehicle->assigned_driver)->toBeNull()
        ->and($vehicle->last_serviced_on)->toBeNull()
        ->and($vehicle->notes)->toBeNull();
});

test('the stock number and VIN cannot be changed, however the request is crafted', function (): void {
    $before = Vehicle::query()->where('stock_number', 'FL-1000')->firstOrFail();

    $this->patch(route('vehicles.update', 'FL-1000'), vehiclePayload([
        'stock_number' => 'FL-0001',
        'vin'          => '00000000000000000',
    ]))->assertRedirect(route('vehicles.show', 'FL-1000'));

    $after = Vehicle::query()->where('stock_number', 'FL-1000')->firstOrFail();

    expect($after->vin)->toBe($before->vin)
        ->and(Vehicle::query()->where('stock_number', 'FL-0001')->exists())->toBeFalse();
});

test('each rule rejects what it is there to reject', function (array $overrides, string $field): void {
    $this->patch(route('vehicles.update', 'FL-1000'), vehiclePayload($overrides))
        ->assertSessionHasErrors($field);
})->with([
    'make is required'              => [['make' => ''], 'make'],
    'model is required'             => [['model' => ''], 'model'],
    'color is required'             => [['color' => ''], 'color'],
    'year must be a number'         => [['year' => 'nineteen'], 'year'],
    'year has a floor'              => [['year' => 1899], 'year'],
    'year has a ceiling'            => [['year' => 2100], 'year'],
    'body type must be a real one'  => [['body_type' => 'hovercraft'], 'body_type'],
    'fuel type must be a real one'  => [['fuel_type' => 'coal'], 'fuel_type'],
    'status must be a real one'     => [['status' => 'on_fire'], 'status'],
    'odometer must be a number'     => [['odometer' => 'lots'], 'odometer'],
    'odometer cannot be negative'   => [['odometer' => -1], 'odometer'],
    'plate has a length limit'      => [['license_plate' => 'ABCDEFGHIJKLM'], 'license_plate'],
    'driver has a length limit'     => [['assigned_driver' => str_repeat('a', 81)], 'assigned_driver'],
    'bookable must be a boolean'    => [['bookable' => 'maybe'], 'bookable'],
    'purchase date is required'     => [['purchased_on' => ''], 'purchased_on'],
    'purchase date is not future'   => [['purchased_on' => '2099-01-01'], 'purchased_on'],
    'service date is not future'    => [['last_serviced_on' => '2099-01-01'], 'last_serviced_on'],
    'service predates purchase'     => [['last_serviced_on' => '2021-01-01'], 'last_serviced_on'],
    'price must be a number'        => [['purchase_price' => 'cheap'], 'purchase_price'],
    'price cannot be negative'      => [['purchase_price' => '-1'], 'purchase_price'],
    'price has a ceiling'           => [['purchase_price' => '500001'], 'purchase_price'],
    'notes have a length limit'     => [['notes' => str_repeat('a', 2001)], 'notes'],
]);

test('a form field is never mistaken for a list filter', function (): void {
    // The edit form posts a `status` field, and the list has a `status` filter.
    // If the controller read filters from the merged input bag rather than the
    // query string, saving would redirect to /vehicles/FL-1000?status=... and
    // the vehicle's own status would follow the visitor back to the list.
    $this->patch(route('vehicles.update', 'FL-1000'), vehiclePayload(['status' => 'retired']))
        ->assertRedirect(route('vehicles.show', 'FL-1000'));
});

test('a rejected save changes nothing', function (): void {
    $this->patch(route('vehicles.update', 'FL-1000'), vehiclePayload(['year' => 1899]));

    expect(Vehicle::query()->where('stock_number', 'FL-1000')->value('year'))->toBe(2022);
});
