<?php

declare(strict_types=1);

namespace DiceBear\Utils;

/**
 * Makes user text well-formed before the core reads it.
 *
 * A PHP string can hold bytes that are not UTF-8, for example an emoji cut off
 * in the middle of its bytes. Ports whose strings are UTF-16 can hold a lone
 * surrogate instead. Neither has a meaning another port could reproduce, so
 * every port replaces them with U+FFFD first. Here each maximal subpart of an
 * ill-formed sequence becomes one U+FFFD, the substitution the Unicode
 * Standard recommends (chapter 3, "U+FFFD Substitution of Maximal Subparts")
 * and the WHATWG Encoding Standard's TextDecoder applies.
 *
 * mbstring is not used for the replacement: its substitute character is
 * global state shared with the caller.
 *
 * @internal
 */
class Text
{
    private const REPLACEMENT = "\u{FFFD}";

    /**
     * Returns `$value` with every ill-formed UTF-8 sequence replaced by
     * U+FFFD, one per maximal subpart. Valid UTF-8 comes back unchanged.
     */
    public static function wellFormed(string $value): string
    {
        if (mb_check_encoding($value, 'UTF-8')) {
            return $value;
        }

        $result = '';
        $length = strlen($value);
        $i = 0;

        while ($i < $length) {
            $lead = ord($value[$i]);

            if ($lead < 0x80) {
                $result .= $value[$i];
                $i++;
                continue;
            }

            [$need, $lo, $hi] = self::sequence($lead);

            if ($need === 0) {
                // A byte that cannot start a sequence.
                $result .= self::REPLACEMENT;
                $i++;
                continue;
            }

            $j = $i + 1;

            for ($k = 0; $k < $need; $k++) {
                if ($j >= $length) {
                    break;
                }

                $byte = ord($value[$j]);

                if ($byte < $lo || $byte > $hi) {
                    break;
                }

                $j++;
                $lo = 0x80;
                $hi = 0xBF;
            }

            // The lead byte and the continuation bytes that fit it form one
            // maximal subpart; the byte that broke it starts over.
            $result .= $j - $i === $need + 1 ? substr($value, $i, $j - $i) : self::REPLACEMENT;
            $i = $j;
        }

        return $result;
    }

    /**
     * Applies {@see wellFormed()} to every string in a JSON-like value: array
     * keys, array values and nested arrays at any depth. Anything that is not
     * a string or an array is passed through.
     *
     * An array that contains itself through a reference is passed through
     * where it repeats, and `json_encode()` reports the recursion the way it
     * did before.
     */
    public static function wellFormedDeep(mixed $value): mixed
    {
        return self::deep($value, []);
    }

    /**
     * @param array<string, true> $path The references the walk is inside of,
     *                                  by {@see \ReflectionReference::getId()}.
     */
    private static function deep(mixed $value, array $path): mixed
    {
        if (is_string($value)) {
            return self::wellFormed($value);
        }

        if (!is_array($value)) {
            return $value;
        }

        $result = [];

        foreach ($value as $key => $item) {
            $inner = $path;

            // Only a reference can make an array contain itself, and meeting
            // one a second time on the way down is that cycle. A depth limit
            // alone would not do: an array that refers to itself twice doubles
            // the work on every level.
            if (is_array($item)) {
                $id = \ReflectionReference::fromArrayElement($value, $key)?->getId();

                if ($id !== null) {
                    if (isset($path[$id])) {
                        $result[is_string($key) ? self::wellFormed($key) : $key] = $item;
                        continue;
                    }

                    $inner[$id] = true;
                }
            }

            $result[is_string($key) ? self::wellFormed($key) : $key] = self::deep($item, $inner);
        }

        return $result;
    }

    /**
     * Returns how many continuation bytes follow `$lead` in a well-formed
     * sequence and the range the first one must fall in (Unicode Standard,
     * table 3-7). The count is 0 when `$lead` cannot start a sequence.
     *
     * @return array{int, int, int}
     */
    private static function sequence(int $lead): array
    {
        return match (true) {
            $lead >= 0xC2 && $lead <= 0xDF => [1, 0x80, 0xBF],
            $lead === 0xE0 => [2, 0xA0, 0xBF],
            $lead === 0xED => [2, 0x80, 0x9F],
            $lead >= 0xE1 && $lead <= 0xEF => [2, 0x80, 0xBF],
            $lead === 0xF0 => [3, 0x90, 0xBF],
            $lead >= 0xF1 && $lead <= 0xF3 => [3, 0x80, 0xBF],
            $lead === 0xF4 => [3, 0x80, 0x8F],
            default => [0, 0, 0],
        };
    }
}
