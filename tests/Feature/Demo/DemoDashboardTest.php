<?php

declare(strict_types=1);

use App\Demo\DemoDashboard;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function (): void {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('the dashboard renders the demo page with every panel ready', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Demo/Dashboard')
                ->where('state', 'populated')
                ->where('metrics.status', 'ready')
                ->where('chart.status', 'ready')
                ->where('queue.status', 'ready')
                ->where('accounts.status', 'ready')
                ->has('metrics.cells', 4)
        );
});

test('the state switch drives panel statuses', function (string $state, string $chartStatus, string $queueStatus): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard', ['state' => $state]))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('state', $state)
                ->where('chart.status', $chartStatus)
                ->where('queue.status', $queueStatus)
        );
})->with([
    'empty'   => ['empty', 'empty', 'empty'],
    'loading' => ['loading', 'loading', 'loading'],
    'partial' => ['partial', 'empty', 'ready'],
    'error'   => ['error', 'error', 'ready'],
]);

test('an unknown state falls back to populated rather than erroring', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard', ['state' => 'nonsense']))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->where('state', 'populated'));
});

test('the provider is deterministic', function (): void {
    // A demo whose numbers move between loads is impossible to compare your own
    // work against, and impossible to assert on.
    expect(DemoDashboard::for('populated'))->toBe(DemoDashboard::for('populated'));
});

test('the metric ledger agrees with the data it summarises', function (): void {
    // A demo whose headline figures contradict its own table teaches carelessness.
    $data = DemoDashboard::for('populated');

    $inProgress = collect($data['accounts']['rows'])->where('status', 'In progress')->count();

    expect($data['metrics']['cells'][0]['value'])->toBe((string) $inProgress);
});
