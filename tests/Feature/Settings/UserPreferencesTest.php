<?php

declare(strict_types=1);

use App\Enums\Appearance;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

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

test('the model defaults match the migration defaults', function (): void {
    // $attributes wins over the column default on insert, so these two
    // declarations must agree or the migration's default becomes dead code.
    // Compare against the actual schema defaults (read from the database)
    // rather than hardcoded literals, so a drift in the migration is caught
    // even if this test is never updated.
    $columns = collect(Schema::getColumns('users'))->keyBy('name');

    $modelAttributes = (new User)->getAttributes();

    foreach (['appearance', 'timezone'] as $column) {
        // Drivers can return the default decorated with quotes (SQLite
        // commonly reports the string default as 'system', including the
        // single quotes), so strip any wrapping quotes before comparing.
        $schemaDefault = mb_trim((string) $columns[$column]['default'], "'\"");

        expect($modelAttributes[$column])->toBe($schemaDefault);
    }
});
