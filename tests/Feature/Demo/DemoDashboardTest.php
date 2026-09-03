<?php

declare(strict_types=1);

use App\Demo\DemoDashboard;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

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

test('the state switch drives panel statuses', function (
    string $state,
    string $chartStatus,
    string $queueStatus,
    string $metricsStatus,
    string $accountsStatus,
): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard', ['state' => $state]))
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('state', $state)
                ->where('chart.status', $chartStatus)
                ->where('queue.status', $queueStatus)
                ->where('metrics.status', $metricsStatus)
                ->where('accounts.status', $accountsStatus)
        );
})->with([
    // 'partial' leaves the chart 'unavailable' while metrics, the queue, and
    // the accounts table stay 'ready' - this is the row that proves the rest
    // of the page isn't blocked by one stalled panel.
    'empty'   => ['empty', 'empty', 'empty', 'empty', 'empty'],
    'loading' => ['loading', 'loading', 'loading', 'loading', 'loading'],
    'partial' => ['partial', 'unavailable', 'ready', 'ready', 'ready'],
    'error'   => ['error', 'error', 'ready', 'ready', 'ready'],
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

    $rows = collect($data['accounts']['rows']);

    $inProgress = $rows->where('status', 'In progress')->count();
    expect($data['metrics']['cells'][0]['value'])->toBe((string) $inProgress);

    // The accounts table only ever shows a recent snapshot, not the full
    // month, so "Completed in August" can't equal the table's completed
    // count - but it must never be *less* than what the table already shows,
    // or the headline figure would contradict the very table underneath it.
    $completedInTable = $rows->where('status', 'Completed')->count();
    expect((int) $data['metrics']['cells'][2]['value'])->toBeGreaterThanOrEqual($completedInTable);
});
