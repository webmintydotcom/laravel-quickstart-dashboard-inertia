<?php

declare(strict_types=1);

use App\Enums\Appearance;
use App\Models\User;

test('a new user defaults to the system appearance and UTC', function (): void {
    $user = User::factory()->create();

    expect($user->refresh()->appearance)->toBe(Appearance::System)
        ->and($user->timezone)->toBe('UTC');
});

test('appearance is cast to the enum', function (): void {
    $user = User::factory()->create(['appearance' => Appearance::Dark]);

    expect($user->refresh()->appearance)->toBe(Appearance::Dark);
});

test('the factory can override both preferences', function (): void {
    $user = User::factory()->create([
        'appearance' => Appearance::Light,
        'timezone'   => 'America/Los_Angeles',
    ]);

    expect($user->refresh()->appearance)->toBe(Appearance::Light)
        ->and($user->timezone)->toBe('America/Los_Angeles');
});
