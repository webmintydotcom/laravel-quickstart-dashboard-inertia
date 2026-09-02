<?php

declare(strict_types=1);

namespace App\Support;

final class UserAgent
{
    private const MAX_LENGTH = 120;

    /**
     * Order matters. Edge's user agent contains "Chrome", and Chrome's contains
     * "Safari", so the most specific token has to win.
     *
     * @var array<string, string>
     */
    private const BROWSERS = [
        'Edg/'     => 'Edge',
        'OPR/'     => 'Opera',
        'Firefox/' => 'Firefox',
        'Chrome/'  => 'Chrome',
        'Safari/'  => 'Safari',
    ];

    /** @var array<string, string> */
    private const PLATFORMS = [
        'iPhone'      => 'iOS',
        'iPad'        => 'iPadOS',
        'Android'     => 'Android',
        'Mac OS X'    => 'macOS',
        'Windows'     => 'Windows',
        'Linux'       => 'Linux',
    ];

    public static function describe(?string $userAgent): string
    {
        if ($userAgent === null || mb_trim($userAgent) === '') {
            return 'Unknown device';
        }

        $browser = self::match($userAgent, self::BROWSERS);
        $platform = self::match($userAgent, self::PLATFORMS);

        if ($browser !== null && $platform !== null) {
            return "{$browser} on {$platform}";
        }

        return mb_substr($browser ?? $platform ?? $userAgent, 0, self::MAX_LENGTH);
    }

    /**
     * @param  array<string, string>  $candidates
     */
    private static function match(string $userAgent, array $candidates): ?string
    {
        foreach ($candidates as $needle => $label) {
            if (str_contains($userAgent, $needle)) {
                return $label;
            }
        }

        return null;
    }
}
