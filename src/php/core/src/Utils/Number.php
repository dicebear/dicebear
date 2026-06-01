<?php

declare(strict_types=1);

namespace DiceBear\Utils;

/**
 * Formats a number for SVG output, rounded to at most 5 decimal places.
 *
 * Rounding to a fixed precision keeps the output bounded and identical across
 * the JS, PHP, and Python ports: every value becomes a multiple of 1e-5 in the
 * SVG coordinate range, which has no exponential form, so the result is built
 * from integer arithmetic — sidestepping PHP's `precision`-based float cast,
 * which would otherwise diverge from the JS reference for small/large values.
 * Five decimals is far below sub-pixel precision for any realistic canvas.
 */
class Number
{
    public static function format(int|float $value): string
    {
        if (is_nan((float) $value)) {
            return 'NaN';
        }

        if (is_infinite((float) $value)) {
            return $value > 0 ? 'Infinity' : '-Infinity';
        }

        $scaled = self::roundHalfUp($value * 100000);
        $sign = $scaled < 0 ? '-' : '';
        $scaled = abs($scaled);

        $integerPart = intdiv($scaled, 100000);
        $fraction = rtrim(str_pad((string) ($scaled % 100000), 5, '0', STR_PAD_LEFT), '0');

        return $sign . $integerPart . ($fraction !== '' ? '.' . $fraction : '');
    }

    /**
     * Rounds half toward +Infinity, matching JS Math.round. Comparing the
     * fractional part against 0.5 — rather than floor($x + 0.5) — avoids the
     * edge case where the largest double below 0.5 would round up to 1.0.
     */
    public static function roundHalfUp(float $value): int
    {
        $floor = floor($value);

        return (int) ($value - $floor < 0.5 ? $floor : $floor + 1);
    }
}
