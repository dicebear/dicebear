<?php

declare(strict_types=1);

namespace DiceBear\Tests\Utils;

use DiceBear\Options;
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

    public function testOptionsReadTheSeedAndTheTitleWithIllFormedTextReplaced(): void
    {
        $options = new Options(['seed' => "Jo\xF0\x9F\x98", 'title' => "a\xFFb"]);

        $this->assertSame("Jo\u{FFFD}", $options->seed());
        $this->assertSame("a\u{FFFD}b", $options->title());
    }

    public function testOptionsLeaveAWellFormedSeedAndTitleAsTheyAre(): void
    {
        $options = new Options(['seed' => "Jo\u{1F600}", 'title' => 'Zoë']);

        $this->assertSame("Jo\u{1F600}", $options->seed());
        $this->assertSame('Zoë', $options->title());
    }

    public function testOptionsReadAnAbsentSeedAndTitleAsAbsent(): void
    {
        $options = new Options([]);

        $this->assertNull($options->seed());
        $this->assertNull($options->title());
    }
}
