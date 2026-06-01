<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Avatar;
use DiceBear\Prng;
use DiceBear\Prng\Fnv1a;
use DiceBear\Prng\Mulberry32;
use DiceBear\Utils\Number;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

// Cross-language parity tests. Reads the shared fixtures at
// tests/fixtures/parity/ and asserts that the PHP implementation produces
// exactly the values committed there. The JS test suite at
// src/js/core/tests/Parity.test.js reads the same fixtures, so any
// divergence between the two implementations will surface as a failure
// on whichever side drifts.
//
// To regenerate the fixtures: `npm run fixtures:parity` (from repo root).
class ParityTest extends TestCase
{
    private const FIXTURES_DIR = __DIR__ . '/../../../../tests/fixtures/parity';

    /** @return array<string, mixed> */
    private static function loadFixture(string $relPath): array
    {
        $raw = file_get_contents(self::FIXTURES_DIR . '/' . $relPath);
        return json_decode($raw, true, flags: JSON_THROW_ON_ERROR);
    }

    // -----------------------------------------------------------------------
    // Fnv1a
    // -----------------------------------------------------------------------

    public static function fnv1aProvider(): array
    {
        $cases = [];
        foreach (self::loadFixture('fnv1a.json') as $entry) {
            $cases['hash ' . json_encode($entry['input'])] = [$entry];
        }
        return $cases;
    }

    #[DataProvider('fnv1aProvider')]
    public function testFnv1a(array $entry): void
    {
        $this->assertSame($entry['hash'], Fnv1a::hash($entry['input']));
        $this->assertSame($entry['hex'], Fnv1a::hex($entry['input']));
    }

    // -----------------------------------------------------------------------
    // Mulberry32
    // -----------------------------------------------------------------------

    public static function mulberry32Provider(): array
    {
        $cases = [];
        foreach (self::loadFixture('mulberry32.json') as $entry) {
            $cases['seed ' . $entry['seed']] = [$entry];
        }
        return $cases;
    }

    #[DataProvider('mulberry32Provider')]
    public function testMulberry32(array $entry): void
    {
        $m = new Mulberry32($entry['seed']);
        foreach ($entry['sequence'] as $i => $expected) {
            $float = $m->nextFloat();
            $state = $m->state();
            $this->assertSame($expected['float'], $float, "step $i float");
            $this->assertSame($expected['state'], $state, "step $i state");
        }
    }

    // -----------------------------------------------------------------------
    // Prng
    // -----------------------------------------------------------------------

    private static function prngFixture(string $method): array
    {
        static $fixture = null;
        if ($fixture === null) {
            $fixture = self::loadFixture('prng.json');
        }
        $cases = [];
        foreach ($fixture[$method] as $i => $entry) {
            $cases["#$i " . json_encode(['seed' => $entry['seed'], 'key' => $entry['key']])] = [$entry];
        }
        return $cases;
    }

    public static function prngGetValueProvider(): array
    {
        return self::prngFixture('getValue');
    }

    #[DataProvider('prngGetValueProvider')]
    public function testPrngGetValue(array $c): void
    {
        $this->assertSame($c['result'], (new Prng($c['seed']))->getValue($c['key']));
    }

    public static function prngPickProvider(): array
    {
        return self::prngFixture('pick');
    }

    #[DataProvider('prngPickProvider')]
    public function testPrngPick(array $c): void
    {
        $this->assertSame($c['result'], (new Prng($c['seed']))->pick($c['key'], $c['items']));
    }

    public static function prngWeightedPickProvider(): array
    {
        return self::prngFixture('weightedPick');
    }

    #[DataProvider('prngWeightedPickProvider')]
    public function testPrngWeightedPick(array $c): void
    {
        $this->assertSame($c['result'], (new Prng($c['seed']))->weightedPick($c['key'], $c['weights']));
    }

    public static function prngBoolProvider(): array
    {
        return self::prngFixture('bool');
    }

    #[DataProvider('prngBoolProvider')]
    public function testPrngBool(array $c): void
    {
        $this->assertSame($c['result'], (new Prng($c['seed']))->bool($c['key'], (float) $c['likelihood']));
    }

    public static function prngFloatProvider(): array
    {
        return self::prngFixture('float');
    }

    #[DataProvider('prngFloatProvider')]
    public function testPrngFloat(array $c): void
    {
        $this->assertSame((float) $c['result'], (new Prng($c['seed']))->float($c['key'], $c['range']));
    }

    public static function prngIntegerProvider(): array
    {
        return self::prngFixture('integer');
    }

    #[DataProvider('prngIntegerProvider')]
    public function testPrngInteger(array $c): void
    {
        $this->assertSame($c['result'], (new Prng($c['seed']))->integer($c['key'], $c['range']));
    }

    public static function prngShuffleProvider(): array
    {
        return self::prngFixture('shuffle');
    }

    #[DataProvider('prngShuffleProvider')]
    public function testPrngShuffle(array $c): void
    {
        $this->assertSame($c['result'], (new Prng($c['seed']))->shuffle($c['key'], $c['items']));
    }

    // -----------------------------------------------------------------------
    // Number formatting
    // -----------------------------------------------------------------------

    public static function numberProvider(): array
    {
        $cases = [];
        foreach (self::loadFixture('numbers.json') as $i => $entry) {
            $cases["#$i {$entry['output']}"] = [$entry];
        }
        return $cases;
    }

    #[DataProvider('numberProvider')]
    public function testNumberFormatting(array $entry): void
    {
        $this->assertSame($entry['output'], Number::format($entry['input']));
    }

    // -----------------------------------------------------------------------
    // Avatar
    // -----------------------------------------------------------------------

    public static function avatarProvider(): array
    {
        $cases = [];
        foreach (glob(self::FIXTURES_DIR . '/avatars/*.json') as $path) {
            $styleName = basename($path, '.json');
            foreach (self::loadFixture("avatars/$styleName.json") as $entry) {
                $cases["$styleName / {$entry['id']}"] = [$styleName, $entry];
            }
        }
        return $cases;
    }

    #[DataProvider('avatarProvider')]
    public function testAvatar(string $styleName, array $entry): void
    {
        static $styleCache = [];
        $styleData = $styleCache[$styleName] ??= self::loadFixture("styles/$styleName.json");

        $json = (new Avatar($styleData, $entry['options']))->toJSON();
        $this->assertSame($entry['svg'], $json['svg']);
        // Round-trip the resolved options through json_encode/json_decode
        // so int-vs-float typing matches the JS-generated fixture
        // (PHP `1.0` and JS `1` both become JSON `1`).
        $this->assertSame(
            $entry['resolvedOptions'],
            json_decode(json_encode($json['options'], JSON_THROW_ON_ERROR), true, flags: JSON_THROW_ON_ERROR),
        );
    }
}
