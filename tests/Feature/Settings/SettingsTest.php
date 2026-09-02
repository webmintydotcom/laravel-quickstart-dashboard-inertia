<?php

declare(strict_types=1);

use App\Enums\Appearance;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function (): void {
    $this->get(route('settings'))->assertRedirect(route('login'));
});

test('the settings page renders with the current preferences', function (): void {
    $user = User::factory()->create([
        'appearance' => Appearance::Dark,
        'timezone'   => 'America/Los_Angeles',
    ]);

    $this->actingAs($user)
        ->get(route('settings'))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Settings')
                ->where('settings.appearance', 'dark')
                ->where('settings.timezone', 'America/Los_Angeles')
                ->has('timezones.America')
        );
});

test('the default timezone appears in the grouped options', function (): void {
    // 'UTC' is the column default from the migration. It has no '/', so an
    // identifier filter that requires one silently drops it and every new
    // user opens settings to a blank timezone.
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('settings'))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('settings.timezone', 'UTC')
                ->has('timezones.Other')
        );
});

test('both preferences can be updated', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('settings.update'), [
            'appearance' => 'dark',
            'timezone'   => 'Europe/Berlin',
        ])
        ->assertRedirect(route('settings'))
        ->assertSessionHas('status', 'settings-updated');

    expect($user->refresh()->appearance)->toBe(Appearance::Dark)
        ->and($user->timezone)->toBe('Europe/Berlin');
});

test('updating appearance also sets the cookie so the next first paint is correct', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('settings.update'), ['appearance' => 'dark', 'timezone' => 'UTC'])
        // Third argument is false because this cookie is deliberately exempt from
        // encryption in bootstrap/app.php - the front end reads it from document.cookie
        // to avoid a flash of the wrong theme. assertCookie() decrypts by default.
        ->assertCookie('appearance', 'dark', false);
});

test('an unknown appearance is rejected', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('settings.update'), ['appearance' => 'neon', 'timezone' => 'UTC'])
        ->assertSessionHasErrors('appearance');

    expect($user->refresh()->appearance)->toBe(Appearance::System);
});

test('an unknown timezone is rejected', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('settings.update'), ['appearance' => 'system', 'timezone' => 'Mars/Olympus'])
        ->assertSessionHasErrors('timezone');
});

test('guests cannot update settings', function (): void {
    $this->patch(route('settings.update'), ['appearance' => 'dark', 'timezone' => 'UTC'])
        ->assertRedirect(route('login'));
});
