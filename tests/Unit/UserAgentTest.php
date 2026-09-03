<?php

declare(strict_types=1);

use App\Support\UserAgent;

it('describes common browsers and platforms', function (string $agent, string $expected): void {
    expect(UserAgent::describe($agent))->toBe($expected);
})->with([
    'chrome on macos' => [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Chrome on macOS',
    ],
    'safari on ios' => [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
        'Safari on iOS',
    ],
    'firefox on windows' => [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
        'Firefox on Windows',
    ],
    'edge on windows' => [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
        'Edge on Windows',
    ],
    'opera on windows' => [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/117.0.0.0',
        'Opera on Windows',
    ],
    'chrome on android' => [
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
        'Chrome on Android',
    ],
]);

it('falls back to the raw string when it recognises nothing', function (): void {
    expect(UserAgent::describe('curl/8.4.0'))->toBe('curl/8.4.0');
});

it('handles a missing user agent', function (): void {
    expect(UserAgent::describe(null))->toBe('Unknown device');
});

it('handles an empty user agent', function (): void {
    expect(UserAgent::describe(''))->toBe('Unknown device');
});

it('handles a whitespace-only user agent', function (): void {
    expect(UserAgent::describe('   '))->toBe('Unknown device');
});

it('truncates an absurdly long unrecognised agent', function (): void {
    // Session rows carry whatever a client sent. Rendering it unbounded would let
    // one row wreck the layout.
    expect(mb_strlen(UserAgent::describe(str_repeat('x', 500))))->toBeLessThanOrEqual(120);
});

it('reports a modern iPad as macOS, which is a known limit of user-agent sniffing', function (): void {
    // iPadOS 13+ Safari sends a macOS-identical agent by default. Nothing in the
    // string distinguishes it, so this is documented rather than fixed.
    expect(UserAgent::describe(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'
    ))->toBe('Safari on macOS');
});
