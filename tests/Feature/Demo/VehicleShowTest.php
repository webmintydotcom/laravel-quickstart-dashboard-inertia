<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

beforeEach(function (): void {
    $this->actingAs(User::factory()->create());
});

test('guests are sent to login', function (): void {
    auth()->logout();

    $this->get(route('vehicles.show', 'FL-1000'))->assertRedirect(route('login'));
});

test('a vehicle is addressed by its stock number', function (): void {
    $this->get(route('vehicles.show', 'FL-1000'))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Demo/Vehicles/Show')
                ->where('vehicle.stock_number', 'FL-1000')
                ->where('vehicle.vin', '1HGBH41JXMN109186')
                ->where('vehicle.make', 'Ford')
                ->where('vehicle.model', 'Transit 350')
                ->where('vehicle.body_type', 'van')
                ->where('vehicle.body_type_label', 'Van')
                ->where('vehicle.fuel_type_label', 'Diesel')
                ->where('vehicle.status_label', 'Available')
                ->where('vehicle.bookable', true)
                ->where('vehicle.license_plate', 'FLT-4021')
        );
});

test('the record carries both a raw value and a label for every formatted field', function (): void {
    // The edit form needs the raw value for its inputs; the detail page needs the
    // formatted one. Sending both beats formatting dates in the browser.
    $this->get(route('vehicles.show', 'FL-1000'))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('vehicle.purchased_on', '2022-03-14')
                ->where('vehicle.purchased_on_label', '14 Mar 2022')
                ->where('vehicle.odometer', 48210)
                ->where('vehicle.odometer_label', '48,210 mi')
                ->where('vehicle.purchase_price', '42899.00')
                ->where('vehicle.purchase_price_label', '$42,899.00')
        );
});

test('the nullable fields come through as null rather than empty strings', function (): void {
    // FL-1020 is the fixture with no service history yet; FL-1006 is retired with
    // no plate and no driver. The detail page renders an em dash for each.
    $this->get(route('vehicles.show', 'FL-1020'))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('vehicle.last_serviced_on', null)
                ->where('vehicle.last_serviced_on_label', null)
        );

    $this->get(route('vehicles.show', 'FL-1006'))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('vehicle.license_plate', null)
                ->where('vehicle.assigned_driver', null)
        );
});

test('an unknown stock number is a 404', function (): void {
    $this->get(route('vehicles.show', 'FL-9999'))->assertNotFound();
});

test('the back link carries the filters the visitor arrived with', function (): void {
    $this->get(route('vehicles.show', ['vehicle' => 'FL-1000', 'q' => 'Ford', 'page' => 2]))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('backUrl', route('vehicles.index', ['q' => 'Ford', 'page' => 2]))
        );
});

test('the back link drops filters that are already the default', function (): void {
    $this->get(route('vehicles.show', ['vehicle' => 'FL-1000', 'sort' => 'stock_number', 'direction' => 'asc', 'page' => 1]))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('backUrl', route('vehicles.index')));
});

test('a junk filter on the way in does not reach the back link', function (): void {
    $this->get(route('vehicles.show', ['vehicle' => 'FL-1000', 'status' => 'on_fire', 'sort' => 'drop table']))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('backUrl', route('vehicles.index')));
});

test('the index links each row to its record', function (): void {
    $this->get(route('vehicles.index', ['q' => 'Ford', 'page' => 1]))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('listQuery', ['q' => 'Ford'])
        );
});
