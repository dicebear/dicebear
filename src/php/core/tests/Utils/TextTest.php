<?php

declare(strict_types=1);

namespace DiceBear\Tests\Utils;

use DiceBear\Utils\Text;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class TextTest extends TestCase
{
    public function testLeavesValidUtf8AsItIs(): void
    {
        foreach (['', 'abc', 'Zoë', '日本語', "\u{1F600}", "a\u{FFFD}b"] as $value) {
            $this->assertSame($value, Text::wellFormed($value));
        }
    }

    /**
     * One U+FFFD per maximal subpart, as the Unicode Standard recommends and
     * TextDecoder does. The expectations were taken from TextDecoder.
     *
     * @return array<string, array{string, string}>
     */
    public static function maximalSubpartProvider(): array
    {
        return [
            'cut three-byte sequence' => ['e28241', "\u{FFFD}A"],
            'encoded surrogate' => ['eda0bd', "\u{FFFD}\u{FFFD}\u{FFFD}"],
            'overlong two-byte' => ['c0af', "\u{FFFD}\u{FFFD}"],
            'above U+10FFFF' => ['f4908080', "\u{FFFD}\u{FFFD}\u{FFFD}\u{FFFD}"],
            'cut four-byte at the end' => ['f09f98', "\u{FFFD}"],
            'lone continuation byte' => ['80', "\u{FFFD}"],
            'byte never in UTF-8' => ['ff', "\u{FFFD}"],
            'lead then non-continuation' => ['e228a1', "\u{FFFD}(\u{FFFD}"],
            'overlong four-byte' => ['f0808080', "\u{FFFD}\u{FFFD}\u{FFFD}\u{FFFD}"],
            'surrogate between letters' => ['61eda0bd62', "a\u{FFFD}\u{FFFD}\u{FFFD}b"],
            'cut after E0 A0' => ['e0a0', "\u{FFFD}"],
            'E0 80 is two subparts' => ['e080', "\u{FFFD}\u{FFFD}"],
            'cut after F4 8F' => ['f48f', "\u{FFFD}"],
            'lone lead byte' => ['c2', "\u{FFFD}"],
            'cut four-byte before letters' => ['f09f986141', "\u{FFFD}aA"],
        ];
    }

    #[DataProvider('maximalSubpartProvider')]
    public function testReplacesMaximalSubparts(string $hex, string $expected): void
    {
        $this->assertSame($expected, Text::wellFormed(hex2bin($hex)));
    }

    public function testWellFormedDeepCoversKeysValuesAndNestedArrays(): void
    {
        $bad = "a\xFFb";

        $this->assertSame(
            ["k\u{FFFD}" => ["a\u{FFFD}b", ['x' => "a\u{FFFD}b"]], 'n' => 1, 'b' => true, 0 => null],
            Text::wellFormedDeep(["k\xFF" => [$bad, ['x' => $bad]], 'n' => 1, 'b' => true, 0 => null]),
        );
    }

    /**
     * An array that refers to itself more than once must not multiply the
     * walk; json_encode() still reports the recursion.
     */
    public function testWellFormedDeepStopsAtAReferenceCycle(): void
    {
        $data = ['seed' => "a\xFF"];
        $data['a'] = &$data;
        $data['b'] = &$data;

        $result = Text::wellFormedDeep($data);

        $this->assertSame("a\u{FFFD}", $result['seed']);
        $this->assertSame("a\u{FFFD}", $result['a']['seed']);
        $this->assertFalse(@json_encode($result));
    }

    /**
     * The same reference in two places is not a cycle and is walked both
     * times.
     */
    public function testWellFormedDeepWalksASharedReferenceTwice(): void
    {
        $shared = ["a\xFF"];
        $data = ['x' => &$shared, 'y' => &$shared, 'z' => ['deep' => &$shared]];

        $this->assertSame(
            ['x' => ["a\u{FFFD}"], 'y' => ["a\u{FFFD}"], 'z' => ['deep' => ["a\u{FFFD}"]]],
            Text::wellFormedDeep($data),
        );
    }
}
