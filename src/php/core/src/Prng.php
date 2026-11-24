<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Prng\Fnv1a;
use DiceBear\Prng\Mulberry32;
use DiceBear\Utils\Number;

/**
 * Key-based pseudorandom number generator.
 *
 * Each method takes a key that, combined with the seed, produces a
 * deterministic value. The same seed + key always yields the same result,
 * regardless of call order.
 *
 * @internal
 */
class Prng
{
    private string $seed;

    public function __construct(string $seed)
    {
        $this->seed = $seed;
    }

    /**
     * Picks a single item from `$items` deterministically. Returns `null`
     * for an empty list. Duplicate values (by string representation) are
     * collapsed before picking so that input order and duplication do not
     * affect the result.
     *
     * @template T
     *
     * @param list<T> $items
     *
     * @return T|null
     */
    public function pick(string $key, array $items): mixed
    {
        if (count($items) === 0) {
            return null;
        }

        if (count($items) === 1) {
            return $items[0];
        }

        $unique = self::uniqueByCodePoint($items);

        if (count($unique) === 1) {
            return $unique[0];
        }

        $sorted = $unique;
        usort($sorted, self::compareByCodePoint(...));
        $index = (int) floor($this->getValue($key) * count($sorted));

        return $sorted[$index];
    }

    /**
     * Picks a key from `$weights` proportional to its weight. When all
     * weights are zero, falls back to an unweighted {@see pick()}. Returns
     * `null` for an empty map.
     *
     * @param array<string, int|float> $weights
     */
    public function weightedPick(string $key, array $weights): ?string
    {
        if (count($weights) === 0) {
            return null;
        }

        $keys = array_keys($weights);

        if (count($keys) === 1) {
            return (string) $keys[0];
        }

        usort($keys, self::compareByCodePoint(...));

        // Sum in sorted-key order to match JS reduce-over-sorted parity —
        // float addition is non-associative, so iterating $weights directly
        // (insertion order) would diverge from JS for fractional weights.
        $totalWeight = 0.0;
        foreach ($keys as $k) {
            $totalWeight += $weights[$k];
        }

        if ($totalWeight === 0.0) {
            return $this->pick($key, array_map('strval', $keys));
        }

        $threshold = $this->getValue($key) * $totalWeight;
        $cumulative = 0;

        foreach ($keys as $k) {
            $cumulative += $weights[$k];

            if ($threshold < $cumulative) {
                return (string) $k;
            }
        }

        return (string) $keys[count($keys) - 1];
    }

    /**
     * Returns `true` with the given probability (0–100, default 50).
     */
    public function bool(string $key, float $likelihood = 50): bool
    {
        return $this->getValue($key) * 100 < $likelihood;
    }

    /**
     * Returns a deterministic float in `$range`, rounded to four decimal
     * places. With `$range['step'] > 0`, the result is drawn uniformly from
     * `{ min + i*step | 0 ≤ i ≤ floor((max - min) / step) }`, so both
     * endpoints of an evenly-divisible range are equally likely. Non-positive
     * or absent step means continuous. `min`/`max` are sorted internally, so
     * a reversed pair is tolerated.
     *
     * @param array{min: int|float, max: int|float, step?: int|float} $range
     */
    public function float(string $key, array $range): float
    {
        $min = min($range['min'], $range['max']);
        $max = max($range['min'], $range['max']);
        $step = $range['step'] ?? 0;

        if ($step > 0) {
            $buckets = (int) floor(($max - $min) / $step) + 1;
            $i = (int) floor($this->getValue($key) * $buckets);
            $value = $min + $i * $step;
        } else {
            $value = $min + $this->getValue($key) * ($max - $min);
        }

        // Number::roundHalfUp matches JS Math.round (half toward +Infinity);
        // PHP's native round() rounds half away from zero, diverging from the
        // reference for negative values landing exactly on a .5 boundary.
        return Number::roundHalfUp($value * 10000) / 10000;
    }

    /**
     * Returns a deterministic integer in `$range`. `min`/`max` are sorted
     * internally, so a reversed pair is tolerated. `$range['step']` is
     * accepted for symmetry with {@see float()} but ignored.
     *
     * @param array{min: int|float, max: int|float, step?: int|float} $range
     */
    public function integer(string $key, array $range): int
    {
        // Floats, like the other ports: an (int) cast of a bound past the int
        // range would wrap around before the clamp below.
        $min = (float) min($range['min'], $range['max']);
        $max = (float) max($range['min'], $range['max']);

        $value = floor($this->getValue($key) * ($max - $min + 1)) + $min;

        // A float beyond the int range wraps around in an (int) cast. The
        // schema sets no maximum for a stop count, and every count past the
        // palette size draws the same gradient, so clamp to the int32 range.
        return (int) max(-2147483648, min(2147483647, $value));
    }

    /**
     * Fisher-Yates shuffle with chained Mulberry32 state. Duplicate values
     * (by string representation) are collapsed before shuffling, so a
     * caller's slice off the front cannot accidentally produce a repeated
     * value.
     *
     * @template T
     *
     * @param list<T> $items
     *
     * @return list<T>
     */
    public function shuffle(string $key, array $items): array
    {
        if (count($items) <= 1) {
            return $items;
        }

        $result = self::uniqueByCodePoint($items);
        usort($result, self::compareByCodePoint(...));
        $prng = new Mulberry32(Fnv1a::hash($this->seed . ':' . $key));

        for ($i = count($result) - 1; $i > 0; $i--) {
            $j = (int) floor($prng->nextFloat() * ($i + 1));
            $temp = $result[$i];
            $result[$i] = $result[$j];
            $result[$j] = $temp;
        }

        return $result;
    }

    /**
     * Returns a single float in `[0, 1)` derived from `seed:key`. The same
     * seed/key pair always produces the same value.
     */
    public function getValue(string $key): float
    {
        return (new Mulberry32(Fnv1a::hash($this->seed . ':' . $key)))->nextFloat();
    }

    /**
     * Cross-language deterministic sort, matching JS `String(a) < String(b)`,
     * which compares by UTF-16 code unit. Converting to big-endian UTF-16
     * before `strcmp` reproduces that order; it diverges from UTF-8 byte
     * (code-point) order only for supplementary-plane characters.
     */
    private static function compareByCodePoint(mixed $a, mixed $b): int
    {
        $au = (string) mb_convert_encoding((string) $a, 'UTF-16BE', 'UTF-8');
        $bu = (string) mb_convert_encoding((string) $b, 'UTF-16BE', 'UTF-8');

        return strcmp($au, $bu);
    }

    /**
     * Deduplicates by string representation, keeping the first occurrence.
     * Mirrors the cross-language sort key used by
     * {@see compareByCodePoint()} so that every port collapses the same
     * set of inputs. `$keyFn` lets callers (e.g. {@see weightedPick()})
     * extract the sort key from a compound element.
     *
     * @template T
     *
     * @param list<T> $items
     * @param (callable(T): string)|null $keyFn
     *
     * @return list<T>
     */
    private static function uniqueByCodePoint(array $items, ?callable $keyFn = null): array
    {
        $seen = [];
        $result = [];

        foreach ($items as $item) {
            $repr = $keyFn !== null ? $keyFn($item) : (string) $item;

            if (!isset($seen[$repr])) {
                $seen[$repr] = true;
                $result[] = $item;
            }
        }

        return $result;
    }
}
