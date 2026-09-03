<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Error\CircularColorReferenceError;
use DiceBear\Options;
use DiceBear\Resolver;
use DiceBear\Style;
use PHPUnit\Framework\TestCase;

class ResolverTest extends TestCase
{
    /**
     * @param array<string, mixed> $data
     */
    private static function makeResolver(Style $style, array $data = []): Resolver
    {
        return new Resolver($style, new Options($data));
    }

    private static function minimalStyle(): Style
    {
        return new Style(['canvas' => ['width' => 100, 'height' => 100, 'elements' => []]]);
    }

    private static function styleWithComponents(): Style
    {
        return new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'variants' => [
                        'open' => ['elements' => []],
                        'closed' => ['elements' => []],
                        'wink' => ['elements' => []],
                    ],
                ],
            ],
        ]);
    }

    private static function styleWithColors(): Style
    {
        return new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'colors' => [
                'skin' => ['values' => ['#f0c8a0', '#d4a574', '#8d5524']],
                'hair' => ['values' => ['#2c1b18', '#b55239', '#d6b370'], 'notEqualTo' => ['skin']],
                'background' => ['values' => ['#ffffff', '#000000', '#cccccc'], 'contrastTo' => 'skin'],
            ],
        ]);
    }

    private static function styleWithWeights(): Style
    {
        return new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'variants' => [
                        'common' => ['elements' => [], 'weight' => 10],
                        'rare' => ['elements' => [], 'weight' => 1],
                        'hidden' => ['elements' => [], 'weight' => 0],
                    ],
                ],
            ],
        ]);
    }

    private static function fullOptions(): array
    {
        return [
            'seed' => 'test-seed',
            'size' => 128,
            'idRandomization' => true,
            'flip' => ['horizontal', 'vertical'],
            'fontFamily' => ['Arial', 'Helvetica'],
            'fontWeight' => [400, 700],
            'scale' => [0.8, 1.2],
            'borderRadius' => [0, 50],
            'eyesProbability' => 80,
            'eyesVariant' => ['open', 'closed', 'wink'],
            'skinColor' => ['#f0c8a0', '#d4a574'],
            'rotate' => [-15, 15],
            'translateX' => [-5, 5],
            'translateY' => [-2, 2],
        ];
    }

    // constructor

    public function testAcceptsMinimalOptions(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), []);
        $this->assertNotNull($resolver);
    }

    public function testAcceptsFullOptions(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), self::fullOptions());
        $this->assertNotNull($resolver);
    }

    // defaults

    public function testDefaults(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), []);
        $this->assertSame('', $resolver->seed());
        $this->assertNull($resolver->size());
        $this->assertFalse($resolver->idRandomization());
        $this->assertSame('none', $resolver->flip());
        $this->assertSame('system-ui', $resolver->fontFamily());
        $this->assertSame(400, $resolver->fontWeight());
        $this->assertEqualsWithDelta(1, $resolver->scale(), 1e-10);
        $this->assertEqualsWithDelta(0, $resolver->borderRadius(), 1e-10);
    }

    public function testPatternDefaults(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), []);
        $this->assertNull($resolver->variant('eyes'));
        $this->assertSame([], $resolver->color('skin'));
        $this->assertSame('solid', $resolver->colorFill('skin'));
        $this->assertEqualsWithDelta(0, $resolver->rotate(), 1e-10);
        $this->assertEqualsWithDelta(0, $resolver->translateX(), 1e-10);
        $this->assertEqualsWithDelta(0, $resolver->translateY(), 1e-10);
    }

    // single values

    public function testSingleValues(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'my-seed',
            'size' => 256,
            'idRandomization' => true,
            'flip' => 'horizontal',
            'fontFamily' => 'Arial',
            'fontWeight' => 700,
            'scale' => 1.5,
            'borderRadius' => 25,
        ]);

        $this->assertSame('my-seed', $resolver->seed());
        $this->assertSame(256, $resolver->size());
        $this->assertTrue($resolver->idRandomization());
        $this->assertSame('horizontal', $resolver->flip());
        $this->assertSame('Arial', $resolver->fontFamily());
        $this->assertSame(700, $resolver->fontWeight());
        $this->assertEqualsWithDelta(1.5, $resolver->scale(), 1e-10);
        $this->assertEqualsWithDelta(25, $resolver->borderRadius(), 1e-10);
    }

    public function testSinglePatternValues(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'eyesProbability' => 80,
            'eyesVariant' => 'open',
            'skinColor' => '#f0c8a0',
            'rotate' => 45,
            'translateX' => 5,
            'translateY' => -3,
        ]);

        $this->assertNull($resolver->variant('eyes'));
        $this->assertSame(['#f0c8a0'], $resolver->color('skin'));
        $this->assertEqualsWithDelta(45, $resolver->rotate(), 1e-10);
        $this->assertEqualsWithDelta(5, $resolver->translateX(), 1e-10);
        $this->assertEqualsWithDelta(-3, $resolver->translateY(), 1e-10);
    }

    // PRNG resolution

    public function testDeterministic(): void
    {
        $full = self::fullOptions();
        $a = self::makeResolver(self::minimalStyle(), $full);
        $b = self::makeResolver(self::minimalStyle(), $full);

        $this->assertSame($a->flip(), $b->flip());
        $this->assertSame($a->fontFamily(), $b->fontFamily());
        $this->assertSame($a->fontWeight(), $b->fontWeight());
        $this->assertSame($a->scale(), $b->scale());
        $this->assertSame($a->borderRadius(), $b->borderRadius());
    }

    public function testDifferentSeeds(): void
    {
        $full = self::fullOptions();
        $a = self::makeResolver(self::minimalStyle(), array_merge($full, ['seed' => 'seed-a']));
        $b = self::makeResolver(self::minimalStyle(), array_merge($full, ['seed' => 'seed-b']));

        $results = [
            $a->flip() !== $b->flip(),
            $a->fontFamily() !== $b->fontFamily(),
            $a->scale() !== $b->scale(),
            $a->rotate() !== $b->rotate(),
        ];

        $this->assertTrue(in_array(true, $results, true));
    }

    public function testPicksFromArrays(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'pick-test',
            'flip' => ['horizontal', 'vertical'],
            'skinColor' => ['#f0c8a0', '#d4a574', '#8d5524'],
        ]);

        $this->assertContains($resolver->flip(), ['horizontal', 'vertical']);
        $this->assertCount(1, $resolver->color('skin'));
        $this->assertContains($resolver->color('skin')[0], ['#f0c8a0', '#d4a574', '#8d5524']);
    }

    public function testInterpolatesRanges(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'range-test',
            'scale' => [0.8, 1.2],
            'borderRadius' => [0, 50],
            'rotate' => [-15, 15],
            'translateX' => [-5, 5],
        ]);

        $this->assertGreaterThanOrEqual(0.8, $resolver->scale());
        $this->assertLessThanOrEqual(1.2, $resolver->scale());
        $this->assertGreaterThanOrEqual(0, $resolver->borderRadius());
        $this->assertLessThanOrEqual(50, $resolver->borderRadius());
        $this->assertGreaterThanOrEqual(-15, $resolver->rotate());
        $this->assertLessThanOrEqual(15, $resolver->rotate());
    }

    public function testPicksColorFillFromArrays(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'fill-test',
            'skinColorFill' => ['solid', 'linear', 'radial'],
        ]);
        $this->assertContains($resolver->colorFill('skin'), ['solid', 'linear', 'radial']);
    }

    public function testColorFillStopsForGradient(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'gradient-test',
            'skinColor' => ['#f0c8a0', '#d4a574', '#8d5524'],
            'skinColorFill' => 'linear',
            'skinColorFillStops' => 2,
        ]);

        $colors = $resolver->color('skin');
        $this->assertCount(2, $colors);

        foreach ($colors as $c) {
            $this->assertContains($c, ['#f0c8a0', '#d4a574', '#8d5524']);
        }
    }

    public function testDefaultsTo2StopsForGradient(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'gradient-default-test',
            'skinColor' => ['#f0c8a0', '#d4a574', '#8d5524'],
            'skinColorFill' => 'radial',
        ]);
        $this->assertCount(2, $resolver->color('skin'));
    }

    public function testSingleColorForSolidFill(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'solid-test',
            'skinColor' => ['#f0c8a0', '#d4a574', '#8d5524'],
            'skinColorFill' => 'solid',
        ]);

        $colors = $resolver->color('skin');
        $this->assertCount(1, $colors);
        $this->assertContains($colors[0], ['#f0c8a0', '#d4a574', '#8d5524']);
    }

    public function testPicksFromFontWeightArray(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'fw-test',
            'fontWeight' => [400, 700],
        ]);
        $this->assertContains($resolver->fontWeight(), [400, 700]);
    }

    // colorFillStops via color()

    public function testRespectsCustomStopsCount(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'stops-test',
            'skinColor' => ['#ff0000', '#00ff00', '#0000ff', '#ffffff'],
            'skinColorFill' => 'linear',
            'skinColorFillStops' => 3,
        ]);
        $this->assertCount(3, $resolver->color('skin'));
    }

    public function testPicksIntegerStopsFromRange(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $resolver = self::makeResolver(self::minimalStyle(), [
                'seed' => "stops-{$i}",
                'skinColor' => ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'],
                'skinColorFill' => 'radial',
                'skinColorFillStops' => [2, 4],
            ]);

            $count = count($resolver->color('skin'));
            $this->assertGreaterThanOrEqual(2, $count);
            $this->assertLessThanOrEqual(4, $count);
        }
    }

    // colorOrder

    public function testColorOrderDefaultsToRandom(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), ['seed' => 'order-default']);
        $this->assertSame('random', $resolver->colorOrder('skin'));
    }

    public function testColorOrderFixedKeepsGivenOrderForGradientFills(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'order-fixed',
            'skinColor' => ['#0055a4', '#ffffff', '#ef4135'],
            'skinColorFill' => 'linear',
            'skinColorOrder' => 'fixed',
        ]);

        $this->assertSame(['#0055a4', '#ffffff', '#ef4135'], $resolver->color('skin'));
    }

    public function testColorOrderFixedKeepsOrderForEverySeed(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $resolver = self::makeResolver(self::minimalStyle(), [
                'seed' => "order-fixed-{$i}",
                'skinColor' => ['#0055a4', '#ffffff', '#ef4135'],
                'skinColorFill' => 'linear',
                'skinColorOrder' => 'fixed',
            ]);

            $this->assertSame(['#0055a4', '#ffffff', '#ef4135'], $resolver->color('skin'));
        }
    }

    public function testColorOrderFixedDefaultsStopCountToNumberOfColors(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'order-stops',
            'skinColor' => ['#ff0000', '#00ff00', '#0000ff', '#ffffff'],
            'skinColorFill' => 'linear',
            'skinColorOrder' => 'fixed',
        ]);

        $this->assertCount(4, $resolver->color('skin'));
    }

    public function testColorOrderFixedRespectsExplicitStopCount(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'order-explicit-stops',
            'skinColor' => ['#0055a4', '#ffffff', '#ef4135'],
            'skinColorFill' => 'linear',
            'skinColorFillStops' => 2,
            'skinColorOrder' => 'fixed',
        ]);

        $this->assertSame(['#0055a4', '#ffffff'], $resolver->color('skin'));
    }

    public function testColorOrderFixedAlwaysUsesFirstColorForSolidFill(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'order-solid',
            'skinColor' => ['#ef4135', '#0055a4'],
            'skinColorOrder' => 'fixed',
        ]);

        $this->assertSame(['#ef4135'], $resolver->color('skin'));
    }

    public function testColorOrderFixedSkipsContrastSorting(): void
    {
        // background.contrastTo = skin: by default the strongest-contrast
        // candidate comes first, with a fixed order the user's first color wins.
        $options = [
            'seed' => 'order-contrast',
            'skinColor' => '#000000',
            'backgroundColor' => ['#111111', '#ffffff'],
        ];

        $control = self::makeResolver(self::styleWithColors(), $options);
        $fixed = self::makeResolver(
            self::styleWithColors(),
            array_merge($options, ['backgroundColorOrder' => 'fixed']),
        );

        $this->assertSame(['#ffffff'], $control->color('background'));
        $this->assertSame(['#111111'], $fixed->color('background'));
    }

    public function testColorOrderFixedStillAppliesNotEqualToFiltering(): void
    {
        // hair.notEqualTo = skin
        $resolver = self::makeResolver(self::styleWithColors(), [
            'seed' => 'order-not-equal',
            'skinColor' => '#2c1b18',
            'hairColor' => ['#2c1b18', '#b55239', '#d6b370'],
            'hairColorFill' => 'linear',
            'hairColorOrder' => 'fixed',
        ]);

        $this->assertSame(['#b55239', '#d6b370'], $resolver->color('hair'));
    }

    public function testColorOrderFixedKeepsStylePaletteInDefinitionOrder(): void
    {
        // Without user-supplied colors, 'fixed' uses the palette as the style
        // lists it, for every seed.
        for ($i = 0; $i < 5; $i++) {
            $resolver = self::makeResolver(self::styleWithColors(), [
                'seed' => "order-style-{$i}",
                'skinColorFill' => 'linear',
                'skinColorFillStops' => 3,
                'skinColorOrder' => 'fixed',
            ]);

            $this->assertSame(['#f0c8a0', '#d4a574', '#8d5524'], $resolver->color('skin'));
        }
    }

    public function testColorOrderFixedSkipsContrastSortingForStylePalette(): void
    {
        // background.contrastTo = skin: the contrast sort would put black
        // first against a white skin, the fixed order keeps white first.
        $resolver = self::makeResolver(self::styleWithColors(), [
            'seed' => 'order-style-contrast',
            'skinColor' => '#ffffff',
            'backgroundColorOrder' => 'fixed',
        ]);

        $this->assertSame(['#ffffff'], $resolver->color('background'));
    }

    public function testColorOrderFixedDefaultsStopCountToPaletteSize(): void
    {
        $resolver = self::makeResolver(self::styleWithColors(), [
            'seed' => 'order-style-stops',
            'skinColorFill' => 'linear',
            'skinColorOrder' => 'fixed',
        ]);

        $this->assertSame(['#f0c8a0', '#d4a574', '#8d5524'], $resolver->color('skin'));
    }

    // componentTransform()

    public function testComponentTransformIdentityDefaults(): void
    {
        $resolver = self::makeResolver(self::styleWithComponents(), ['seed' => 'identity']);
        $t = $resolver->componentTransform('eyes');
        $this->assertEqualsWithDelta(0.0, $t['rotate'], 1e-10);
        $this->assertEqualsWithDelta(0.0, $t['translateX'], 1e-10);
        $this->assertEqualsWithDelta(0.0, $t['translateY'], 1e-10);
        $this->assertEqualsWithDelta(1.0, $t['scale'], 1e-10);
    }

    public function testComponentTransformDrawsRotateFromDefinition(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'rotate' => ['min' => -10, 'max' => 10],
                    'variants' => ['open' => ['elements' => []]],
                ],
            ],
        ]);
        $resolver = self::makeResolver($style, ['seed' => 'rotate']);
        $t = $resolver->componentTransform('eyes');
        $this->assertGreaterThanOrEqual(-10, $t['rotate']);
        $this->assertLessThanOrEqual(10, $t['rotate']);
    }

    public function testComponentTransformIsDeterministicPerSeed(): void
    {
        $a = self::makeResolver(self::styleWithComponents(), ['seed' => 'pick']);
        $b = self::makeResolver(self::styleWithComponents(), ['seed' => 'pick']);
        $this->assertSame($a->componentTransform('eyes'), $b->componentTransform('eyes'));
    }

    public function testComponentTransformIdentityForUnknownComponent(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), ['seed' => 'unknown']);
        $t = $resolver->componentTransform('missing');
        $this->assertEqualsWithDelta(0.0, $t['rotate'], 1e-10);
        $this->assertEqualsWithDelta(0.0, $t['translateX'], 1e-10);
        $this->assertEqualsWithDelta(0.0, $t['translateY'], 1e-10);
        $this->assertEqualsWithDelta(1.0, $t['scale'], 1e-10);
    }

    public function testRootScaleDefaultsToOne(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), ['seed' => 'root-scale']);
        $this->assertEqualsWithDelta(1.0, $resolver->scale(), 1e-10);
    }

    // probability / visibility

    public function testVariantWhenProbability100(): void
    {
        $resolver = self::makeResolver(self::styleWithComponents(), [
            'seed' => 'visible-test',
            'eyesProbability' => 100,
        ]);
        $this->assertNotNull($resolver->variant('eyes'));
    }

    public function testVariantNullWhenProbability0(): void
    {
        $resolver = self::makeResolver(self::styleWithComponents(), [
            'seed' => 'hidden-test',
            'eyesProbability' => 0,
        ]);
        $this->assertNull($resolver->variant('eyes'));
    }

    public function testVariantVisibleByDefault(): void
    {
        $resolver = self::makeResolver(self::styleWithComponents(), ['seed' => 'default-visible-test']);
        $this->assertNotNull($resolver->variant('eyes'));
    }

    // variant constraints

    public function testOnlyPicksFromStyleDefinedVariants(): void
    {
        $resolver = self::makeResolver(self::styleWithComponents(), [
            'seed' => 'variant-test',
            'eyesVariant' => ['open', 'closed', 'invalid'],
        ]);

        $result = $resolver->variant('eyes');
        $this->assertNotNull($result);
        $this->assertContains($result, ['open', 'closed', 'wink']);
        $this->assertNotSame('invalid', $result);
    }

    public function testVariantNullWhenNoUserVariantsMatch(): void
    {
        $resolver = self::makeResolver(self::styleWithComponents(), [
            'seed' => 'fallback-test',
            'eyesVariant' => ['invalid1', 'invalid2'],
        ]);
        $this->assertNull($resolver->variant('eyes'));
    }

    public function testEmptyVariantArrayYieldsNullVariant(): void
    {
        $resolver = self::makeResolver(self::styleWithComponents(), [
            'seed' => 'empty-test',
            'eyesVariant' => [],
        ]);
        $this->assertNull($resolver->variant('eyes'));
    }

    public function testPicksFromStyleVariantsWhenNoOption(): void
    {
        $resolver = self::makeResolver(self::styleWithComponents(), ['seed' => 'default-test']);
        $result = $resolver->variant('eyes');
        $this->assertNotNull($result);
        $this->assertContains($result, ['open', 'closed', 'wink']);
    }

    public function testVariantNullWhenComponentMissing(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'no-component-test',
            'eyesVariant' => 'open',
        ]);
        $this->assertNull($resolver->variant('eyes'));
    }

    // color constraints

    public function testContrastToSorting(): void
    {
        $resolver = self::makeResolver(self::styleWithColors(), [
            'seed' => 'contrast-test',
            'skinColor' => '#f0c8a0',
            'backgroundColor' => ['#ffffff', '#000000', '#cccccc'],
        ]);

        $colors = $resolver->color('background');
        $this->assertCount(1, $colors);
        $this->assertSame('#000000', $colors[0]);
    }

    public function testNotEqualToFiltering(): void
    {
        $resolver = self::makeResolver(self::styleWithColors(), [
            'seed' => 'not-equal-test',
            'skinColor' => '#f0c8a0',
            'hairColor' => ['#f0c8a0', '#2c1b18', '#b55239'],
        ]);

        $colors = $resolver->color('hair');
        $this->assertCount(1, $colors);
        $this->assertNotSame('#f0c8a0', $colors[0]);
    }

    public function testNotEqualToKeepsAllWhenAllWouldBeFiltered(): void
    {
        $resolver = self::makeResolver(self::styleWithColors(), [
            'seed' => 'all-filtered-test',
            'skinColor' => '#f0c8a0',
            'hairColor' => ['#f0c8a0'],
        ]);

        $colors = $resolver->color('hair');
        $this->assertCount(1, $colors);
        $this->assertSame('#f0c8a0', $colors[0]);
    }

    public function testColorCaching(): void
    {
        $resolver = self::makeResolver(self::styleWithColors(), [
            'seed' => 'cache-test',
            'skinColor' => ['#f0c8a0', '#d4a574'],
        ]);
        $this->assertSame($resolver->color('skin'), $resolver->color('skin'));
    }

    public function testColorWithoutStyleDefinition(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'no-style-test',
            'customColor' => ['#ff0000', '#00ff00'],
        ]);

        $colors = $resolver->color('custom');
        $this->assertCount(1, $colors);
        $this->assertContains($colors[0], ['#ff0000', '#00ff00']);
    }

    public function testCircularContrastToThrows(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'colors' => [
                'a' => ['values' => ['#ff0000', '#00ff00'], 'contrastTo' => 'b'],
                'b' => ['values' => ['#0000ff', '#ffffff'], 'contrastTo' => 'a'],
            ],
        ]);

        $resolver = self::makeResolver($style, [
            'seed' => 'circular-test',
            'aColor' => ['#ff0000', '#00ff00'],
            'bColor' => ['#0000ff', '#ffffff'],
        ]);

        try {
            $resolver->color('a');
            $this->fail('Expected error');
        } catch (CircularColorReferenceError $e) {
            $this->assertSame(['a', 'b', 'a'], $e->chain);
            $this->assertStringContainsString('a → b → a', $e->getMessage());
        }
    }

    public function testCircularNotEqualToThrows(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'colors' => [
                'a' => ['values' => ['#ff0000'], 'notEqualTo' => ['b']],
                'b' => ['values' => ['#00ff00'], 'notEqualTo' => ['a']],
            ],
        ]);

        $resolver = self::makeResolver($style, [
            'seed' => 'circular-not-equal-test',
            'aColor' => ['#ff0000'],
            'bColor' => ['#00ff00'],
        ]);

        try {
            $resolver->color('a');
            $this->fail('Expected error');
        } catch (CircularColorReferenceError $e) {
            $this->assertSame(['a', 'b', 'a'], $e->chain);
            $this->assertStringContainsString('a → b → a', $e->getMessage());
        }
    }

    // resolved

    public function testResolvedIncludesConsumedValues(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'test',
            'flip' => ['horizontal', 'vertical'],
            'scale' => [0.5, 1],
        ]);

        $resolver->seed();
        $resolver->flip();
        $resolver->scale();

        $resolved = $resolver->resolved();
        $this->assertContains($resolved['flip'], ['horizontal', 'vertical', 'none']);
        $this->assertIsNumeric($resolved['scale']);
    }

    public function testResolvedDoesNotIncludeSeed(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), ['seed' => 'test']);

        $resolver->seed();

        $this->assertArrayNotHasKey('seed', $resolver->resolved());
    }

    public function testResolvedMemoized(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'test',
            'flip' => ['horizontal', 'vertical'],
        ]);

        $first = $resolver->flip();
        $second = $resolver->flip();
        $this->assertSame($first, $second);
    }

    public function testResolvedIncludesVariantValues(): void
    {
        $resolver = self::makeResolver(self::styleWithComponents(), [
            'seed' => 'test',
            'eyesVariant' => ['open', 'closed'],
        ]);

        $resolver->variant('eyes');

        $resolved = $resolver->resolved();
        $this->assertArrayHasKey('eyesVariant', $resolved);
        $this->assertContains($resolved['eyesVariant'], ['open', 'closed', 'wink']);
    }

    public function testResolvedIncludesColorValues(): void
    {
        $resolver = self::makeResolver(self::styleWithColors(), [
            'seed' => 'test',
            'skinColor' => ['#ff0000', '#00ff00'],
        ]);

        $resolver->color('skin');

        $resolved = $resolver->resolved();
        $this->assertArrayHasKey('skinColor', $resolved);
        $this->assertIsArray($resolved['skinColor']);
    }

    // variant weights

    public function testWeightZeroNeverPicked(): void
    {
        for ($i = 0; $i < 100; $i++) {
            $resolver = self::makeResolver(self::styleWithWeights(), ['seed' => "weight-{$i}"]);
            $this->assertNotSame('hidden', $resolver->variant('eyes'));
        }
    }

    public function testWeightZeroAllowedWhenExplicit(): void
    {
        $resolver = self::makeResolver(self::styleWithWeights(), [
            'seed' => 'explicit-hidden',
            'eyesVariant' => 'hidden',
        ]);
        $this->assertSame('hidden', $resolver->variant('eyes'));
    }

    public function testHigherWeightFavored(): void
    {
        $commonCount = 0;
        for ($i = 0; $i < 200; $i++) {
            $resolver = self::makeResolver(self::styleWithWeights(), ['seed' => "favor-{$i}"]);
            if ($resolver->variant('eyes') === 'common') {
                $commonCount++;
            }
        }
        $this->assertGreaterThan(100, $commonCount);
    }

    public function testObjectVariantOverridesWeights(): void
    {
        for ($i = 0; $i < 100; $i++) {
            $resolver = self::makeResolver(self::styleWithWeights(), [
                'seed' => "override-{$i}",
                'eyesVariant' => ['hidden' => 1],
            ]);
            $this->assertSame('hidden', $resolver->variant('eyes'));
        }
    }

    public function testObjectVariantFiltersAndWeights(): void
    {
        for ($i = 0; $i < 100; $i++) {
            $resolver = self::makeResolver(self::styleWithWeights(), [
                'seed' => "filter-{$i}",
                'eyesVariant' => ['common' => 1, 'rare' => 1],
            ]);
            $this->assertContains($resolver->variant('eyes'), ['common', 'rare']);
        }
    }

    public function testAllWeightsZeroFallback(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'variants' => [
                        'a' => ['elements' => [], 'weight' => 0],
                        'b' => ['elements' => [], 'weight' => 0],
                    ],
                ],
            ],
        ]);
        $resolver = self::makeResolver($style, ['seed' => 'all-zero']);
        $this->assertContains($resolver->variant('eyes'), ['a', 'b']);
    }

    public function testDeterministicWithWeights(): void
    {
        $a = self::makeResolver(self::styleWithWeights(), ['seed' => 'deterministic-test']);
        $b = self::makeResolver(self::styleWithWeights(), ['seed' => 'deterministic-test']);
        $this->assertSame($a->variant('eyes'), $b->variant('eyes'));
    }

    // colorAngle

    public function testColorAngleDefault(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), []);
        $this->assertEqualsWithDelta(0, $resolver->colorAngle('skin'), 1e-10);
    }

    public function testColorAngleSingleValue(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), ['skinColorAngle' => 45]);
        $this->assertEqualsWithDelta(45, $resolver->colorAngle('skin'), 1e-10);
    }

    public function testColorAngleRange(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'seed' => 'angle-test',
            'skinColorAngle' => [-90, 90],
        ]);
        $value = $resolver->colorAngle('skin');
        $this->assertGreaterThanOrEqual(-90, $value);
        $this->assertLessThanOrEqual(90, $value);
    }

    // animationSpeed

    public function testAnimationSpeedDefaultsToOne(): void
    {
        $resolver = self::makeResolver(self::minimalStyle());
        $this->assertSame(1.0, $resolver->animationSpeed());
        $this->assertSame(1.0, $resolver->animationSpeedFor('blink'));
    }

    public function testSharesTheGlobalFactorWithEveryTimeline(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), ['animationSpeed' => 2]);
        $this->assertSame(2.0, $resolver->animationSpeedFor('blink'));
        $this->assertSame(2.0, $resolver->animationSpeedFor(null));
    }

    public function testLetsANamedDelayWinOverTheGlobalOne(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'animationDelay' => 1,
            'blinkAnimationDelay' => -2,
        ]);

        $this->assertSame(1.0, $resolver->animationDelay());
        $this->assertSame(-2.0, $resolver->animationDelayFor('blink'));
        $this->assertSame(1.0, $resolver->animationDelayFor('sway'));
        $this->assertSame(1.0, $resolver->animationDelayFor(null));
        $this->assertSame(0.0, self::makeResolver(self::minimalStyle())->animationDelayFor('blink'));
    }

    public function testDrawsADelayRangeUnderItsOwnKeySeeded(): void
    {
        $options = ['seed' => 'x', 'animationDelay' => [0, 3], 'blinkAnimationDelay' => [0, 3]];
        $resolver = self::makeResolver(self::minimalStyle(), $options);
        $global = $resolver->animationDelay();
        $blink = $resolver->animationDelayFor('blink');

        $this->assertGreaterThanOrEqual(0, $global);
        $this->assertLessThanOrEqual(3, $global);
        $this->assertGreaterThanOrEqual(0, $blink);
        $this->assertLessThanOrEqual(3, $blink);
        $this->assertNotSame($global, $blink);
        $this->assertSame($blink, self::makeResolver(self::minimalStyle(), $options)->animationDelayFor('blink'));
    }

    public function testLetsANamedSwitchWinOverTheGlobalOne(): void
    {
        $on = self::makeResolver(self::minimalStyle(), ['animation' => false, 'blinkAnimation' => true]);
        $this->assertTrue($on->animationPlays('blink'));
        $this->assertFalse($on->animationPlays('sway'));
        $this->assertFalse($on->animationPlays(null));
        $this->assertTrue($on->resolved()['blinkAnimation']);
        $this->assertArrayNotHasKey('swayAnimation', $on->resolved());

        $off = self::makeResolver(self::minimalStyle(), ['animation' => true, 'blinkAnimation' => false]);
        $this->assertFalse($off->animationPlays('blink'));
        $this->assertTrue($off->animationPlays('sway'));
        $this->assertTrue($off->animationPlays(null));
    }

    public function testLetsTheSpecificOptionWinOverTheGlobalOne(): void
    {
        $resolver = self::makeResolver(self::minimalStyle(), [
            'animationSpeed' => 0.5,
            'blinkAnimationSpeed' => 2,
        ]);

        $this->assertSame(2.0, $resolver->animationSpeedFor('blink'));
        $this->assertSame(0.5, $resolver->animationSpeedFor('sway'));
        $this->assertSame(0.5, $resolver->animationSpeedFor(null));
        $this->assertSame(2.0, $resolver->resolved()['blinkAnimationSpeed']);
        $this->assertArrayNotHasKey('swayAnimationSpeed', $resolver->resolved());
    }

    public function testDrawsASpecificRangeUnderItsOwnKey(): void
    {
        $options = [
            'seed' => 'x',
            'blinkAnimationSpeed' => [0.5, 2],
            'swayAnimationSpeed' => [0.5, 2],
        ];
        $resolver = self::makeResolver(self::minimalStyle(), $options);
        $blink = $resolver->animationSpeedFor('blink');

        $this->assertGreaterThanOrEqual(0.5, $blink);
        $this->assertLessThanOrEqual(2, $blink);
        $this->assertNotSame($blink, $resolver->animationSpeedFor('sway'));
        $this->assertNotSame(
            $blink,
            self::makeResolver(self::minimalStyle(), ['seed' => 'x', 'animationSpeed' => [0.5, 2]])->animationSpeed(),
        );
        $this->assertSame($blink, self::makeResolver(self::minimalStyle(), $options)->animationSpeedFor('blink'));
    }
}
