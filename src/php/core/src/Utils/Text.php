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
 * The replacement does not use mbstring, whose substitute character is global
 * state shared with the caller.
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
