<?php

declare(strict_types=1);

use App\Enums\Appearance;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests fall back to the system appearance', function (): void {
    $this->get('/')
        ->assertOk()
        ->assertSee('class="system"', escape: false);
});

test('a guest cookie drives the root element class', function (): void {
    $this->withUnencryptedCookie('appearance', 'dark')
        ->get('/')
        ->assertSee('class="dark"', escape: false);
});

test('a guest cookie also drives the shared appearance prop', function (): void {
    $this->withUnencryptedCookie('appearance', 'dark')
        ->get('/')
        ->assertInertia(fn (AssertableInertia $page) => $page->where('appearance', 'dark'));
});

test('the user record wins over the cookie', function (): void {
    $user = User::factory()->create(['appearance' => Appearance::Light]);

    $this->actingAs($user)
        ->withUnencryptedCookie('appearance', 'dark')
        ->get(route('dashboard'))
        ->assertSee('class="light"', escape: false);
});

test('appearance is shared with every page', function (): void {
    $user = User::factory()->create(['appearance' => Appearance::Dark]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('appearance', 'dark'));
});

test('the sidebar defaults to expanded', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('sidebarCollapsed', false));
});

test('the sidebar cookie is read on the server so the first paint is correct', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->withUnencryptedCookie('sidebar_collapsed', '1')
        ->get(route('dashboard'))
        ->assertInertia(fn (AssertableInertia $page) => $page->where('sidebarCollapsed', true));
});
