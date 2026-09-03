<?php

declare(strict_types=1);

namespace App\Demo;

final class DemoDashboard
{
    /**
     * Deterministic by design - no randomness and no clock. Tests assert on these
     * values, and a cloner comparing their own work against the demo needs it to
     * look the same on every load.
     *
     * @return array<string, mixed>
     */
    public static function for(string $state): array
    {
        $state = in_array($state, ['populated', 'empty', 'loading', 'partial', 'error'], true)
            ? $state
            : 'populated';

        return [
            'state'    => $state,
            'metrics'  => ['status' => self::status($state, 'metrics'), 'cells' => self::cells()],
            'chart'    => ['status' => self::status($state, 'chart'), ...self::chart()],
            'queue'    => ['status' => self::status($state, 'queue'), 'items' => self::queue()],
            'accounts' => ['status' => self::status($state, 'accounts'), 'rows' => self::accounts()],
        ];
    }

    private static function status(string $state, string $panel): string
    {
        return match ($state) {
            'empty', 'loading' => $state,
            'partial'          => $panel === 'chart' ? 'empty' : 'ready',
            'error'            => $panel === 'chart' ? 'error' : 'ready',
            default            => 'ready',
        };
    }

    /** @return list<array{label: string, value: string, detail: string}> */
    private static function cells(): array
    {
        return [
            // Must equal the count of accounts rows with status 'In progress' - a test asserts it.
            ['label' => 'In progress',         'value' => '3',       'detail' => 'Two more than this time last month'],
            ['label' => 'Due this week',       'value' => '2',       'detail' => 'Both in data migration'],
            ['label' => 'Completed in August', 'value' => '7',       'detail' => 'Up from five in July'],
            ['label' => 'Median time to live', 'value' => '19 days', 'detail' => 'Down from twenty-four days in July'],
        ];
    }

    /**
     * @return array{
     *     question: string,
     *     labels: list<string>,
     *     series: list<array{label: string, data: list<int>}>
     * }
     */
    private static function chart(): array
    {
        return [
            'question' => 'Are we completing onboardings faster than new ones arrive?',
            'labels'   => ['30 Jun', '7 Jul', '14 Jul', '21 Jul', '28 Jul', '4 Aug', '11 Aug', '18 Aug'],
            'series'   => [
                ['label' => 'Incoming', 'data' => [4, 6, 5, 7, 6, 5, 6, 5]],
                ['label' => 'Completed', 'data' => [2, 3, 4, 4, 5, 6, 7, 7]],
            ],
        ];
    }

    /** @return list<array{title: string, reason: string, age: string, severity: 'high'|'medium'|'low'}> */
    private static function queue(): array
    {
        return [
            ['title' => 'Ashgrove Media',   'reason' => 'Stalled in kickoff',            'age' => '9 days',  'severity' => 'high'],
            ['title' => 'Verity Labs',      'reason' => 'Missing an assigned owner',     'age' => '5 days',  'severity' => 'medium'],
            ['title' => 'Northmoor Trust',  'reason' => 'Training session overdue',      'age' => '3 days',  'severity' => 'medium'],
            ['title' => 'Calder & Wu',      'reason' => 'Ready to close',                'age' => '1 day',   'severity' => 'low'],
        ];
    }

    /** @return list<array{name: string, owner: string, stage: string, started: string, status: string}> */
    private static function accounts(): array
    {
        return [
            ['name' => 'Halden Freight',   'owner' => 'Priya Raman', 'stage' => 'Data migration', 'started' => '12 Aug', 'status' => 'In progress'],
            ['name' => 'Verity Labs',      'owner' => 'Tom Achebe',  'stage' => 'Kickoff',        'started' => '19 Aug', 'status' => 'In progress'],
            ['name' => 'Northmoor Trust',  'owner' => 'Priya Raman', 'stage' => 'Training',       'started' => '02 Aug', 'status' => 'In progress'],
            ['name' => 'Calder & Wu',      'owner' => 'Sam Ellery',  'stage' => 'Go live',        'started' => '28 Jul', 'status' => 'Completed'],
            ['name' => 'Brightwater Coop', 'owner' => 'Tom Achebe',  'stage' => 'Data migration', 'started' => '21 Jul', 'status' => 'Completed'],
            ['name' => 'Ashgrove Media',   'owner' => 'Sam Ellery',  'stage' => 'Kickoff',        'started' => '25 Aug', 'status' => 'Stalled'],
        ];
    }
}
