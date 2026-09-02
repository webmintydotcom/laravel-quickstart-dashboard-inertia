<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('the registration screen can be rendered', function (): void {
    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('Auth/Register'));
});

test('new users can register', function (): void {
    $this->post(route('register.store'), [
        'first_name'            => 'Ada',
        'last_name'             => 'Lovelace',
        'email'                 => 'ada@example.com',
        'password'              => 'analytical-engine',
        'password_confirmation' => 'analytical-engine',
    ])->assertRedirect(route('dashboard'));

    $user = User::where('email', 'ada@example.com')->firstOrFail();

    expect($user->first_name)->toBe('Ada')
        ->and($user->last_name)->toBe('Lovelace')
        ->and($user->name)->toBe('Ada Lovelace');

    $this->assertAuthenticatedAs($user);
});

test('registration requires every field', function (): void {
    $this->post(route('register.store'), [])
        ->assertSessionHasErrors(['first_name', 'last_name', 'email', 'password']);

    $this->assertGuest();
});

test('registration rejects a duplicate email', function (): void {
    $existing = User::factory()->create();

    $this->post(route('register.store'), [
        'first_name'            => 'Ada',
        'last_name'             => 'Lovelace',
        'email'                 => $existing->email,
        'password'              => 'analytical-engine',
        'password_confirmation' => 'analytical-engine',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('registration rejects a mismatched password confirmation', function (): void {
    $this->post(route('register.store'), [
        'first_name'            => 'Ada',
        'last_name'             => 'Lovelace',
        'email'                 => 'ada@example.com',
        'password'              => 'analytical-engine',
        'password_confirmation' => 'difference-engine',
    ])->assertSessionHasErrors('password');

    $this->assertGuest();
});

test('registration rejects names that are not person names', function (string $name): void {
    $this->post(route('register.store'), [
        'first_name'            => $name,
        'last_name'             => 'Lovelace',
        'email'                 => 'ada@example.com',
        'password'              => 'analytical-engine',
        'password_confirmation' => 'analytical-engine',
    ])->assertSessionHasErrors('first_name');

    $this->assertGuest();
})->with([
    'digits'              => 'Ada3',
    'symbols'             => 'Ada@Lovelace',
    'trailing hyphen'     => 'Ada-',
    'trailing apostrophe' => "Ada'",
    'whitespace only'     => ' ',
]);

test('registration accepts names from any language or culture', function (string $first, string $last): void {
    $this->post(route('register.store'), [
        'first_name'            => $first,
        'last_name'             => $last,
        'email'                 => 'person@example.com',
        'password'              => 'analytical-engine',
        'password_confirmation' => 'analytical-engine',
    ])->assertSessionHasNoErrors();

    expect(User::where('email', 'person@example.com')->exists())->toBeTrue();
})->with([
    'hyphenated'  => ['Mary', 'Smith-Jones'],
    'apostrophe'  => ['Sean', "O'Brien"],
    'spaces'      => ['Maria', 'De La Cruz'],
    'period'      => ['Henry', 'St. John'],
    'accented'    => ['José', 'Muñoz'],
    'cyrillic'    => ['Дмитрий', 'Иванов'],
    'arabic'      => ['محمد', 'علي'],
    'cjk'         => ['太郎', '山田'],
]);
