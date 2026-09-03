<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Error\StyleValidationError;
use DiceBear\Error\ValidationError;
use DiceBear\Style;
use PHPUnit\Framework\TestCase;

class StyleTest extends TestCase
{
    private static function minimal(): array
    {
        return ['canvas' => ['width' => 100, 'height' => 100, 'elements' => []]];
    }

    private static function full(): array
    {
        return [
            '$schema' => 'https://example.com/schema.json',
            '$comment' => 'Test style',
            'meta' => [
                'license' => ['name' => 'MIT', 'url' => 'https://example.com/license', 'text' => 'MIT License'],
                'creator' => ['name' => 'Test', 'url' => 'https://example.com'],
                'source' => ['name' => 'Source', 'url' => 'https://example.com/source'],
            ],
            'canvas' => [
                'width' => 200,
                'height' => 200,
                'elements' => [
                    [
                        'type' => 'element',
                        'name' => 'rect',
                        'attributes' => ['width' => '100', 'height' => '100', 'fill' => '#ff0000'],
                        'children' => [
                            ['type' => 'text', 'value' => 'hello'],
                        ],
                    ],
                    [
                        'type' => 'component',
                        'name' => 'eyes',
                    ],
                    [
                        'type' => 'text',
                        'value' => ['type' => 'variable', 'name' => 'initials'],
                    ],
                ],
            ],
            'components' => [
                'eyes' => [
                    'width' => 50,
                    'height' => 50,
                    'probability' => 100,
                    'rotate' => ['min' => -10, 'max' => 10],
                    'translate' => ['x' => ['min' => 0, 'max' => 5], 'y' => ['min' => -2, 'max' => 2]],
                    'variants' => [
                        'open' => [
                            'elements' => [
                                ['type' => 'element', 'name' => 'circle', 'attributes' => ['r' => '10', 'cx' => '25', 'cy' => '25']],
                            ],
                        ],
                        'closed' => [
                            'elements' => [
                                ['type' => 'element', 'name' => 'line', 'attributes' => ['x1' => '10', 'y1' => '25', 'x2' => '40', 'y2' => '25']],
                            ],
                        ],
                    ],
                ],
            ],
            'colors' => [
                'skin' => [
                    'values' => ['#f0c8a0', '#d4a574', '#8d5524'],
                ],
                'hair' => [
                    'values' => ['#2c1b18', '#b55239'],
                    'notEqualTo' => ['skin'],
                ],
                'background' => [
                    'values' => ['#ffffff', '#000000'],
                    'contrastTo' => 'skin',
                ],
            ],
        ];
    }

    // constructor

    public function testAcceptsMinimalDefinition(): void
    {
        $style = new Style(self::minimal());
        $this->assertNotNull($style);
    }

    public function testAcceptsFullDefinition(): void
    {
        $style = new Style(self::full());
        $this->assertNotNull($style);
    }

    public function testFromJsonParsesRawDefinition(): void
    {
        $style = Style::fromJson(json_encode(self::full()));
        $this->assertSame('https://example.com/schema.json', $style->schema());
    }

    public function testFromJsonThrowsJsonExceptionForMalformedJson(): void
    {
        $this->expectException(\JsonException::class);
        Style::fromJson('not json');
    }

    public function testFromJsonThrowsStyleValidationErrorForInvalidDefinition(): void
    {
        $this->expectException(StyleValidationError::class);
        Style::fromJson('{}');
    }

    public function testThrowsStyleValidationErrorForInvalidData(): void
    {
        $this->expectException(StyleValidationError::class);
        new Style([]);
    }

    public function testThrowsValidationError(): void
    {
        $this->expectException(ValidationError::class);
        new Style([]);
    }

    public function testThrowsRuntimeException(): void
    {
        $this->expectException(\RuntimeException::class);
        new Style([]);
    }

    public function testErrorIncludesDetails(): void
    {
        try {
            new Style([]);
            $this->fail('Expected error');
        } catch (StyleValidationError $e) {
            $this->assertIsArray($e->details);
            $this->assertGreaterThan(0, count($e->details));
        }
    }

    // primitive methods

    public function testReturnsSchema(): void
    {
        $full = self::full();
        $this->assertSame($full['$schema'], (new Style($full))->schema());
    }

    public function testReturnsComment(): void
    {
        $full = self::full();
        $this->assertSame($full['$comment'], (new Style($full))->comment());
    }

    public function testReturnsNullForMissingOptionalPrimitives(): void
    {
        $style = new Style(self::minimal());
        $this->assertNull($style->schema());
        $this->assertNull($style->comment());
    }

    public function testReturnsDefaultsForMissingOptionalObjects(): void
    {
        $style = new Style(self::minimal());
        $this->assertNotNull($style->meta());
        $this->assertNull($style->meta()->license()->name());
        $this->assertNull($style->meta()->creator()->name());
        $this->assertNull($style->meta()->source()->name());
        $this->assertSame([], $style->attributes());
    }

    // canvas

    public function testCanvasWidthAndHeight(): void
    {
        $style = new Style(self::full());
        $this->assertSame(200, $style->canvas()->width());
        $this->assertSame(200, $style->canvas()->height());
    }

    public function testCanvasElements(): void
    {
        $style = new Style(self::full());
        $this->assertCount(3, $style->canvas()->elements());
        $this->assertSame('element', $style->canvas()->elements()[0]->type());
        $this->assertSame('rect', $style->canvas()->elements()[0]->name());
        $this->assertSame('component', $style->canvas()->elements()[1]->type());
        $this->assertSame('eyes', $style->canvas()->elements()[1]->name());
    }

    public function testCanvasElementChildren(): void
    {
        $style = new Style(self::full());
        $children = $style->canvas()->elements()[0]->children();
        $this->assertCount(1, $children);
        $this->assertSame('text', $children[0]->type());
        $this->assertSame('hello', $children[0]->value());
    }

    public function testCanvasElementAttributes(): void
    {
        $style = new Style(self::full());
        $attrs = $style->canvas()->elements()[0]->attributes();
        $this->assertNotNull($attrs);
        $this->assertSame('100', $attrs['width']);
        $this->assertSame('#ff0000', $attrs['fill']);
    }

    public function testCanvasElementVariableReference(): void
    {
        $style = new Style(self::full());
        $el = $style->canvas()->elements()[2];
        $this->assertSame('text', $el->type());
        $this->assertSame(['type' => 'variable', 'name' => 'initials'], $el->value());
    }

    public function testCanvasCachesElements(): void
    {
        $style = new Style(self::full());
        $this->assertSame($style->canvas()->elements(), $style->canvas()->elements());
    }

    // meta

    public function testMetaLicense(): void
    {
        $style = new Style(self::full());
        $this->assertSame('MIT', $style->meta()->license()->name());
        $this->assertSame('https://example.com/license', $style->meta()->license()->url());
        $this->assertSame('MIT License', $style->meta()->license()->text());
    }

    public function testMetaCreator(): void
    {
        $style = new Style(self::full());
        $this->assertSame('Test', $style->meta()->creator()->name());
        $this->assertSame('https://example.com', $style->meta()->creator()->url());
    }

    public function testMetaSource(): void
    {
        $style = new Style(self::full());
        $this->assertSame('Source', $style->meta()->source()->name());
    }

    public function testMetaCached(): void
    {
        $style = new Style(self::full());
        $this->assertSame($style->meta(), $style->meta());
    }

    // components

    public function testComponentsReturnsArray(): void
    {
        $style = new Style(self::full());
        $this->assertCount(1, $style->components());
        $this->assertArrayHasKey('eyes', $style->components());
    }

    public function testComponentProperties(): void
    {
        $style = new Style(self::full());
        $eyes = $style->components()['eyes'];
        $this->assertSame(50, $eyes->width());
        $this->assertSame(50, $eyes->height());
        $this->assertSame(100, $eyes->probability());
        $this->assertSame(['min' => -10, 'max' => 10], $eyes->rotate());
    }

    public function testComponentTranslate(): void
    {
        $style = new Style(self::full());
        $translate = $style->components()['eyes']->translate();
        $this->assertSame(['min' => 0, 'max' => 5], $translate->x());
        $this->assertSame(['min' => -2, 'max' => 2], $translate->y());
    }

    public function testComponentVariants(): void
    {
        $style = new Style(self::full());
        $eyes = $style->components()['eyes'];
        $this->assertCount(2, $eyes->variants());
        $this->assertArrayHasKey('open', $eyes->variants());
        $this->assertArrayHasKey('closed', $eyes->variants());
    }

    public function testVariantElements(): void
    {
        $style = new Style(self::full());
        $open = $style->components()['eyes']->variants()['open'];
        $this->assertCount(1, $open->elements());
        $this->assertSame('circle', $open->elements()[0]->name());
    }

    public function testEmptyComponentsWhenNone(): void
    {
        $style = new Style(self::minimal());
        $this->assertCount(0, $style->components());
    }

    public function testComponentsCached(): void
    {
        $style = new Style(self::full());
        $this->assertSame($style->components(), $style->components());
    }

    // colors

    public function testColorsReturnsArray(): void
    {
        $style = new Style(self::full());
        $this->assertCount(3, $style->colors());
    }

    public function testColorValues(): void
    {
        $style = new Style(self::full());
        $skin = $style->colors()['skin'];
        $this->assertSame(['#f0c8a0', '#d4a574', '#8d5524'], $skin->values());
    }

    public function testColorNotEqualTo(): void
    {
        $style = new Style(self::full());
        $hair = $style->colors()['hair'];
        $this->assertSame(['skin'], $hair->notEqualTo());
    }

    public function testColorContrastTo(): void
    {
        $style = new Style(self::full());
        $bg = $style->colors()['background'];
        $this->assertSame('skin', $bg->contrastTo());
    }

    public function testEmptyColorsWhenNone(): void
    {
        $style = new Style(self::minimal());
        $this->assertCount(0, $style->colors());
    }

    public function testColorsCached(): void
    {
        $style = new Style(self::full());
        $this->assertSame($style->colors(), $style->colors());
    }

    // component aliases

    private static function aliasDefinition(): array
    {
        return [
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 50,
                    'height' => 60,
                    'probability' => 80,
                    'rotate' => ['min' => -10, 'max' => 10],
                    'scale' => ['min' => 0.9, 'max' => 1.1],
                    'translate' => ['x' => ['min' => -5, 'max' => 5], 'y' => ['min' => -2, 'max' => 2]],
                    'variants' => [
                        'open' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['r' => '5']]]],
                        'closed' => ['elements' => [['type' => 'element', 'name' => 'line', 'attributes' => ['x1' => '0', 'x2' => '10']]]],
                    ],
                ],
                'eyesRight' => ['extends' => 'eyes'],
            ],
        ];
    }

    public function testAliasExposedAsMapEntry(): void
    {
        $style = new Style(self::aliasDefinition());
        $this->assertArrayHasKey('eyesRight', $style->components());
        $this->assertSame('eyes', $style->components()['eyesRight']->extendsName());
        $this->assertNull($style->components()['eyes']->extendsName());
    }

    public function testAliasInheritsWidthAndHeight(): void
    {
        $alias = (new Style(self::aliasDefinition()))->components()['eyesRight'];
        $this->assertSame(50, $alias->width());
        $this->assertSame(60, $alias->height());
    }

    public function testAliasInheritsVariants(): void
    {
        $alias = (new Style(self::aliasDefinition()))->components()['eyesRight'];
        $this->assertSame(['open', 'closed'], array_keys($alias->variants()));
    }

    public function testAliasDelegatesProbabilityRotateScaleTranslateToSource(): void
    {
        $alias = (new Style(self::aliasDefinition()))->components()['eyesRight'];
        $this->assertSame(80, $alias->probability());
        $this->assertSame(['min' => -10, 'max' => 10], $alias->rotate());
        $this->assertSame(['min' => 0.9, 'max' => 1.1], $alias->scale());
        $this->assertSame(['min' => -5, 'max' => 5], $alias->translate()->x());
        $this->assertSame(['min' => -2, 'max' => 2], $alias->translate()->y());
    }

    public function testAliasRejectsUnknownExtendsTarget(): void
    {
        $this->expectException(StyleValidationError::class);

        new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => ['eyesRight' => ['extends' => 'missing']],
        ]);
    }

    public function testAliasRejectsAliasOfAlias(): void
    {
        $this->expectException(StyleValidationError::class);

        new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'components' => [
                'eyes' => [
                    'width' => 10,
                    'height' => 10,
                    'variants' => ['open' => ['elements' => []]],
                ],
                'eyesRight' => ['extends' => 'eyes'],
                'eyesRightAgain' => ['extends' => 'eyesRight'],
            ],
        ]);
    }

    // animation placement, enforced by the schema

    private static function opacityTrack(): array
    {
        return [
            'duration' => 1,
            'tracks' => ['opacity' => ['keyframes' => [['at' => 0, 'value' => 1]]]],
        ];
    }

    public function testRejectsAnimationsInsideDefs(): void
    {
        $this->expectException(StyleValidationError::class);

        new Style([
            'canvas' => [
                'width' => 100,
                'height' => 100,
                'elements' => [
                    [
                        'type' => 'element',
                        'name' => 'defs',
                        'children' => [
                            [
                                'type' => 'element',
                                'name' => 'circle',
                                'attributes' => ['id' => 'dot', 'r' => '10'],
                                'animations' => [self::opacityTrack()],
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    public function testRejectsAnimationsBelowClipPath(): void
    {
        $this->expectException(StyleValidationError::class);

        new Style([
            'canvas' => [
                'width' => 100,
                'height' => 100,
                'elements' => [
                    [
                        'type' => 'element',
                        'name' => 'clipPath',
                        'attributes' => ['id' => 'clip'],
                        'children' => [
                            [
                                'type' => 'element',
                                'name' => 'g',
                                'children' => [
                                    [
                                        'type' => 'element',
                                        'name' => 'circle',
                                        'attributes' => ['r' => '10'],
                                        'animations' => [self::opacityTrack()],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    public function testAcceptsAnimationsInsideMask(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100,
                'height' => 100,
                'elements' => [
                    [
                        'type' => 'element',
                        'name' => 'mask',
                        'attributes' => ['id' => 'fade'],
                        'children' => [
                            [
                                'type' => 'element',
                                'name' => 'circle',
                                'attributes' => ['r' => '10', 'fill' => '#fff'],
                                'animations' => [self::opacityTrack()],
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $this->assertTrue($style->hasAnimations());
    }
}
