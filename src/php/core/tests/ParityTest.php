<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Avatar;
use DiceBear\Error\CircularColorReferenceError;
use DiceBear\Error\ValidationError;
use DiceBear\OptionsDescriptor;
use DiceBear\Prng;
use DiceBear\Prng\Fnv1a;
use DiceBear\Prng\Mulberry32;
use DiceBear\Style;
use DiceBear\Utils\Color;
use DiceBear\Utils\Initials;
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
    // Initials
    // -----------------------------------------------------------------------

    public static function initialsProvider(): array
    {
        $cases = [];
        foreach (self::loadFixture('initials.json') as $i => $entry) {
            $cases["#$i " . json_encode($entry['seed'])] = [$entry];
        }
        return $cases;
    }

    #[DataProvider('initialsProvider')]
    public function testInitials(array $entry): void
    {
        $this->assertSame($entry['result'], Initials::fromSeed($entry['seed']));
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

        $avatar = new Avatar(new Style($styleData), $entry['options']);
        $json = $avatar->toJSON();
        $this->assertSame($entry['svg'], $json['svg']);
        // Round-trip the resolved options through json_encode/json_decode
        // so int-vs-float typing matches the JS-generated fixture
        // (PHP `1.0` and JS `1` both become JSON `1`).
        $this->assertSame(
            $entry['resolvedOptions'],
            json_decode(json_encode($json['options'], JSON_THROW_ON_ERROR), true, flags: JSON_THROW_ON_ERROR),
        );

        // Only select cases carry a dataUri — it pins the percent-encoding
        // contract (JS encodeURIComponent) without bloating every fixture.
        if (isset($entry['dataUri'])) {
            $this->assertSame($entry['dataUri'], $avatar->toDataUri());
        }
    }

    // -----------------------------------------------------------------------
    // Ill-formed text
    // -----------------------------------------------------------------------

    // Ill-formed UTF-8 in the seed and the title becomes U+FFFD, one per
    // maximal subpart, so the avatar matches the one for the well-formed
    // text. Inputs are hex strings; the utf16 cases are for the
    // ports whose strings are UTF-16 code units. See generate.mjs.
    public static function illFormedTextProvider(): array
    {
        $cases = [];
        foreach (self::loadFixture('ill-formed-text.json')['utf8'] as $entry) {
            $cases[$entry['input']] = [$entry];
        }
        return $cases;
    }

    #[DataProvider('illFormedTextProvider')]
    public function testIllFormedText(array $entry): void
    {
        $input = hex2bin($entry['input']);
        $avatar = new Avatar(new Style(self::loadFixture('styles/initials.json')), [
            'seed' => $input,
            'title' => $input,
        ]);

        $this->assertSame($entry['svg'], (string) $avatar);
    }

    // -----------------------------------------------------------------------
    // Color
    // -----------------------------------------------------------------------

    public static function colorProvider(): array
    {
        $fixtures = self::loadFixture('colors.json');
        $cases = [];

        foreach (['toHex', 'toRgbHex', 'parseHex', 'luminance'] as $method) {
            foreach ($fixtures[$method] as $entry) {
                $cases["$method {$entry['input']}"] = [$method, [$entry['input']], $entry['result']];
            }
        }

        foreach ($fixtures['sortByContrast'] as $i => $entry) {
            $cases["sortByContrast #$i"] = [
                'sortByContrast',
                [$entry['candidates'], $entry['refColor']],
                $entry['result'],
            ];
        }

        foreach ($fixtures['filterNotEqualTo'] as $i => $entry) {
            $cases["filterNotEqualTo #$i"] = [
                'filterNotEqualTo',
                [$entry['candidates'], $entry['excluded']],
                $entry['result'],
            ];
        }

        return $cases;
    }

    /**
     * @param list<mixed> $args
     */
    #[DataProvider('colorProvider')]
    public function testColor(string $method, array $args, mixed $expected): void
    {
        if ($method === 'luminance') {
            // JSON serializes whole-number luminance (0, 1) as int.
            $expected = (float) $expected;
        }

        $this->assertSame($expected, Color::$method(...$args));
    }

    // -----------------------------------------------------------------------
    // Validation
    // -----------------------------------------------------------------------
    //
    // Only the accept/reject outcome is shared across languages — error
    // messages are language-specific. The circular color reference cases
    // additionally pin the reported resolution chain.

    public static function styleValidationProvider(): array
    {
        $cases = [];
        foreach (self::loadFixture('validation.json')['styles'] as $entry) {
            $cases[$entry['id']] = [$entry];
        }
        return $cases;
    }

    #[DataProvider('styleValidationProvider')]
    public function testStyleValidation(array $entry): void
    {
        if ($entry['valid']) {
            $this->assertInstanceOf(Style::class, new Style($entry['definition']));
        } else {
            $this->expectException(ValidationError::class);
            new Style($entry['definition']);
        }
    }

    public static function optionsValidationProvider(): array
    {
        $cases = [];
        foreach (self::loadFixture('validation.json')['options'] as $entry) {
            $cases[$entry['id']] = [$entry];
        }
        return $cases;
    }

    #[DataProvider('optionsValidationProvider')]
    public function testOptionsValidation(array $entry): void
    {
        static $minimalStyle = null;
        $minimalStyle ??= array_values(array_filter(
            self::loadFixture('validation.json')['styles'],
            static fn (array $e) => $e['id'] === 'minimal',
        ))[0]['definition'];

        if ($entry['valid']) {
            $this->assertInstanceOf(Avatar::class, new Avatar(new Style($minimalStyle), $entry['options']));
        } else {
            $this->expectException(ValidationError::class);
            new Avatar(new Style($minimalStyle), $entry['options']);
        }
    }

    public static function circularColorProvider(): array
    {
        $cases = [];
        foreach (self::loadFixture('validation.json')['circularColors'] as $entry) {
            $cases[$entry['id']] = [$entry];
        }
        return $cases;
    }

    #[DataProvider('circularColorProvider')]
    public function testCircularColorReference(array $entry): void
    {
        try {
            new Avatar(new Style($entry['style']), $entry['options']);
            $this->fail('expected a circular color reference error');
        } catch (CircularColorReferenceError $e) {
            $this->assertSame($entry['chain'], $e->chain);
        }
    }

    // -----------------------------------------------------------------------
    // OptionsDescriptor
    // -----------------------------------------------------------------------

    public static function descriptorProvider(): array
    {
        $cases = [];
        foreach (glob(self::FIXTURES_DIR . '/descriptors/*.json') as $path) {
            $styleName = basename($path, '.json');
            $cases[$styleName] = [$styleName];
        }
        return $cases;
    }

    #[DataProvider('descriptorProvider')]
    public function testOptionsDescriptor(string $styleName): void
    {
        $style = new Style(self::loadFixture("styles/$styleName.json"));
        $descriptor = (new OptionsDescriptor($style))->toJSON();

        // Same round-trip as the avatar test: pins key order and int-vs-float
        // typing against the JS-generated fixture.
        $this->assertSame(
            self::loadFixture("descriptors/$styleName.json"),
            json_decode(json_encode($descriptor, JSON_THROW_ON_ERROR), true, flags: JSON_THROW_ON_ERROR),
        );
    }
}
