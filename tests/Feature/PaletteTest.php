<?php

declare(strict_types=1);

/**
 * Guards DESIGN.md rule 5, which forbids purple, violet and fuchsia anywhere -
 * including chart series. The name check mirrors DESIGN.md's own suggested `rg`
 * command. The hue check exists because the violation this replaced was a raw
 * hex value (#7e6bc4), which no name-based search would ever have caught.
 */
function hueOf(string $hex): float
{
    [$r, $g, $b] = array_map(
        fn (string $pair): float => hexdec($pair) / 255,
        mb_str_split(mb_substr($hex, 1), 2),
    );

    $max = max($r, $g, $b);
    $min = min($r, $g, $b);
    $delta = $max - $min;

    if ($delta === 0.0) {
        return 0.0;
    }

    $hue = match (true) {
        $max === $r => 60 * fmod(($g - $b) / $delta, 6),
        $max === $g => 60 * ((($b - $r) / $delta) + 2),
        default     => 60 * ((($r - $g) / $delta) + 4),
    };

    return $hue < 0 ? $hue + 360 : $hue;
}

test('no forbidden colour family is named anywhere in the front end', function (): void {
    $offenders = [];

    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator(resource_path(), FilesystemIterator::SKIP_DOTS),
    );

    foreach ($files as $file) {
        if (! $file->isFile()) {
            continue;
        }

        $contents = (string) file_get_contents($file->getPathname());

        if (preg_match('/(purple|violet|fuchsia)-\d{2,3}/i', $contents) === 1) {
            $offenders[] = str_replace(base_path() . '/', '', $file->getPathname());
        }
    }

    expect($offenders)->toBe([]);
});

test('no chart series sits in the purple hue band', function (): void {
    preg_match_all(
        '/--chart-\d:\s*(#[0-9a-f]{6})/i',
        (string) file_get_contents(resource_path('css/app.css')),
        $matches,
    );

    expect($matches[1])->toHaveCount(10);

    // Band floor is 240, not 255: #7e6bc4 (the violation this test guards against)
    // sits at 252.8 degrees, so a 255 floor would miss it. Tailwind violet-500 is at
    // 258, purple-500 at 271, fuchsia-500 at 292. Chart-2 blue is at 200, leaving
    // 40 degrees of headroom below the band.
    foreach ($matches[1] as $hex) {
        expect(hueOf($hex))->not->toBeBetween(240.0, 330.0, "{$hex} is purple");
    }
});

test('the unused sidebar token family is gone', function (): void {
    expect((string) file_get_contents(resource_path('css/app.css')))
        ->not->toContain('--sidebar');
});

test('the hue band catches the violation it was written for', function (): void {
    // #7e6bc4 was the real --chart-4 value in this repo. A band that misses it
    // is decoration, not a guard.
    expect(hueOf('#7e6bc4'))->toBeBetween(240.0, 330.0);
});
