<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\OptionsDescriptor;
use DiceBear\Style;
use PHPUnit\Framework\TestCase;

class OptionsDescriptorTest extends TestCase
{
    private static function minimalStyle(): Style
    {
        return new Style(['canvas' => ['width' => 100, 'height' => 100, 'elements' => []]]);
    }

    private static function fullStyle(): Style
    {
        return new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 100, 'height' => 100,
                    'variants' => [
                        'open' => ['elements' => []],
                        'closed' => ['elements' => []],
                        'wink' => ['elements' => []],
                    ],
                ],
                'mouth' => [
                    'width' => 100, 'height' => 100,
                    'variants' => [
                        'happy' => ['elements' => []],
                        'sad' => ['elements' => []],
                    ],
                ],
            ],
            'colors' => [
                'skin' => ['values' => ['#ff0000', '#00ff00']],
                'hair' => ['values' => ['#000000']],
                'text' => ['values' => ['#ffffff', '#000000'], 'contrastTo' => 'background'],
                'outline' => [
                    'values' => ['#111111', '#eeeeee'],
                    'contrastTo' => 'skin',
                    'notEqualTo' => ['skin'],
                ],
            ],
        ]);
    }

    // base options

    public function testIncludesAllBaseOptions(): void
    {
        $schema = (new OptionsDescriptor(self::minimalStyle()))->toJSON();

        $this->assertSame(['type' => 'string'], $schema['seed']);
        $this->assertSame(['type' => 'number', 'min' => 1, 'max' => 4096], $schema['size']);
        $this->assertSame(['type' => 'boolean'], $schema['idRandomization']);
        $this->assertSame(['type' => 'enum', 'values' => ['none', 'horizontal', 'vertical', 'both'], 'list' => true], $schema['flip']);
        $this->assertSame(['type' => 'range', 'min' => 0, 'max' => 10], $schema['scale']);
        $this->assertSame(['type' => 'range', 'min' => 0, 'max' => 50], $schema['borderRadius']);
        $this->assertSame(['type' => 'range', 'min' => -360, 'max' => 360], $schema['rotate']);
        $this->assertSame(['type' => 'range', 'min' => -1000, 'max' => 1000], $schema['translateX']);
        $this->assertSame(['type' => 'range', 'min' => -1000, 'max' => 1000], $schema['translateY']);
        $this->assertSame(['type' => 'string', 'list' => true], $schema['fontFamily']);
        $this->assertSame(['type' => 'number', 'min' => 1, 'max' => 1000, 'list' => true], $schema['fontWeight']);
    }

    public function testAlwaysIncludesBackgroundColorOptions(): void
    {
        $schema = (new OptionsDescriptor(self::minimalStyle()))->toJSON();

        $this->assertSame(['type' => 'color', 'list' => true], $schema['backgroundColor']);
        $this->assertSame(['type' => 'enum', 'values' => ['solid', 'linear', 'radial'], 'list' => true], $schema['backgroundColorFill']);
        $this->assertSame(['type' => 'range', 'min' => 2], $schema['backgroundColorFillStops']);
        $this->assertSame(['type' => 'range', 'min' => -360, 'max' => 360], $schema['backgroundColorAngle']);
        $this->assertSame(['type' => 'enum', 'values' => ['random', 'fixed']], $schema['backgroundColorOrder']);
    }

    // component options

    public function testGeneratesComponentOptions(): void
    {
        $schema = (new OptionsDescriptor(self::fullStyle()))->toJSON();

        $this->assertArrayHasKey('eyesVariant', $schema);
        $this->assertArrayHasKey('eyesProbability', $schema);
        $this->assertArrayNotHasKey('eyesRotate', $schema);
        $this->assertArrayNotHasKey('eyesTranslateX', $schema);
        $this->assertArrayNotHasKey('eyesTranslateY', $schema);
        $this->assertArrayNotHasKey('eyesScale', $schema);
        $this->assertArrayHasKey('mouthVariant', $schema);
    }

    public function testRootScaleConstraints(): void
    {
        $schema = (new OptionsDescriptor(self::fullStyle()))->toJSON();
        $this->assertSame(['type' => 'range', 'min' => 0, 'max' => 10], $schema['scale']);
    }

    public function testSortedVariantNames(): void
    {
        $schema = (new OptionsDescriptor(self::fullStyle()))->toJSON();

        $this->assertSame([
            'type' => 'enum',
            'values' => ['closed', 'open', 'wink'],
            'list' => true,
            'weighted' => true,
        ], $schema['eyesVariant']);
    }

    public function testProbabilityConstraints(): void
    {
        $schema = (new OptionsDescriptor(self::fullStyle()))->toJSON();
        $this->assertSame(['type' => 'number', 'min' => 0, 'max' => 100], $schema['eyesProbability']);
    }

    // color options

    public function testGeneratesColorOptions(): void
    {
        $schema = (new OptionsDescriptor(self::fullStyle()))->toJSON();

        $this->assertSame(['type' => 'color', 'list' => true], $schema['skinColor']);
        $this->assertSame(['type' => 'color', 'list' => true], $schema['hairColor']);
        $this->assertSame(['type' => 'enum', 'values' => ['solid', 'linear', 'radial'], 'list' => true], $schema['skinColorFill']);
        $this->assertSame(['type' => 'enum', 'values' => ['random', 'fixed']], $schema['skinColorOrder']);
    }

    public function testExposesContrastToOnColorFields(): void
    {
        $schema = (new OptionsDescriptor(self::fullStyle()))->toJSON();

        $this->assertSame([
            'type' => 'color',
            'list' => true,
            'contrastTo' => 'background',
        ], $schema['textColor']);
        $this->assertArrayNotHasKey('contrastTo', $schema['skinColor']);
    }

    public function testExposesNotEqualToOnColorFields(): void
    {
        $schema = (new OptionsDescriptor(self::fullStyle()))->toJSON();

        $this->assertSame([
            'type' => 'color',
            'list' => true,
            'contrastTo' => 'skin',
            'notEqualTo' => ['skin'],
        ], $schema['outlineColor']);
        $this->assertArrayNotHasKey('notEqualTo', $schema['skinColor']);
    }

    // caching

    public function testStructurallyEqual(): void
    {
        $descriptor = new OptionsDescriptor(self::fullStyle());
        $this->assertSame($descriptor->toJSON(), $descriptor->toJSON());
    }

    public function testReturnsIndependentCopies(): void
    {
        $descriptor = new OptionsDescriptor(self::fullStyle());
        $a = $descriptor->toJSON();
        $b = $descriptor->toJSON();

        $a['seed'] = ['type' => 'mutated'];
        $this->assertNotSame($a['seed'], $b['seed']);
    }
}
