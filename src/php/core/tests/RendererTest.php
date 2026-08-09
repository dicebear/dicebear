<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Avatar;
use DiceBear\Style;
use PHPUnit\Framework\TestCase;

class RendererTest extends TestCase
{
    private static function minimalStyle(): Style
    {
        return new Style(['canvas' => ['width' => 100, 'height' => 100, 'elements' => []]]);
    }

    // SVG wrapper

    public function testSvgWithViewBox(): void
    {
        $svg = (new Avatar(self::minimalStyle()))->toString();
        $this->assertStringStartsWith('<svg ', $svg);
        $this->assertStringContainsString('xmlns="http://www.w3.org/2000/svg"', $svg);
        $this->assertStringContainsString('viewBox="0 0 100 100"', $svg);
        $this->assertStringEndsWith('</svg>', $svg);
    }

    public function testTitleSetsRoleImgAndAriaLabel(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['title' => 'Test Avatar']))->toString();
        $this->assertStringContainsString('role="img"', $svg);
        $this->assertStringContainsString('aria-label="Test Avatar"', $svg);
        $this->assertStringContainsString('<title>Test Avatar</title>', $svg);
    }

    public function testTitleEscaped(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['title' => 'A & B <C>']))->toString();
        $this->assertStringContainsString('aria-label="A &amp; B &lt;C&gt;"', $svg);
        $this->assertStringContainsString('<title>A &amp; B &lt;C&gt;</title>', $svg);
    }

    public function testAriaHiddenWithoutTitle(): void
    {
        $svg = (new Avatar(self::minimalStyle()))->toString();
        $this->assertStringContainsString('aria-hidden="true"', $svg);
        $this->assertStringNotContainsString('role="img"', $svg);
        $this->assertStringNotContainsString('<title>', $svg);
    }

    public function testSizeIncludedWhenSet(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['size' => 64]))->toString();
        $this->assertStringContainsString('width="64"', $svg);
        $this->assertStringContainsString('height="64"', $svg);
    }

    public function testSizeNotIncludedWhenNotSet(): void
    {
        $svg = (new Avatar(self::minimalStyle()))->toString();
        $openTag = substr($svg, 0, strpos($svg, '>') + 1);
        $this->assertStringNotContainsString('width=', $openTag);
        $this->assertStringNotContainsString('height=', $openTag);
    }

    // element rendering

    public function testSelfClosingElements(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'rect', 'attributes' => ['x' => '0', 'y' => '0', 'width' => '100', 'height' => '100']],
                ],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringContainsString('<rect x="0" y="0" width="100" height="100"/>', $svg);
    }

    public function testElementsWithChildren(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'g', 'children' => [
                        ['type' => 'element', 'name' => 'circle', 'attributes' => ['cx' => '50', 'cy' => '50', 'r' => '10']],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringContainsString('<g><circle cx="50" cy="50" r="10"/></g>', $svg);
    }

    public function testNestedElements(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'g', 'attributes' => ['id' => 'outer'], 'children' => [
                        ['type' => 'element', 'name' => 'g', 'attributes' => ['id' => 'inner'], 'children' => [
                            ['type' => 'element', 'name' => 'rect'],
                        ]],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringContainsString('<g id="outer"><g id="inner"><rect/></g></g>', $svg);
    }

    // text rendering

    public function testTextContent(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'text', 'children' => [
                        ['type' => 'text', 'value' => 'Hello'],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringContainsString('<text>Hello</text>', $svg);
    }

    public function testVariableReferenceInitial(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'text', 'children' => [
                        ['type' => 'text', 'value' => ['type' => 'variable', 'name' => 'initial']],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style, ['seed' => 'Alice']))->toString();
        $this->assertStringContainsString('<text>A</text>', $svg);
    }

    public function testInitialsMultiWord(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'text', 'children' => [
                        ['type' => 'text', 'value' => ['type' => 'variable', 'name' => 'initials']],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style, ['seed' => 'Alice Bob']))->toString();
        $this->assertStringContainsString('<text>AB</text>', $svg);
    }

    public function testInitialsSingleWord(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'text', 'children' => [
                        ['type' => 'text', 'value' => ['type' => 'variable', 'name' => 'initials']],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style, ['seed' => 'Alice']))->toString();
        $this->assertStringContainsString('<text>AL</text>', $svg);
    }

    public function testInitialsDiscardAtSymbol(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'text', 'children' => [
                        ['type' => 'text', 'value' => ['type' => 'variable', 'name' => 'initials']],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style, ['seed' => 'alice@example.com']))->toString();
        $this->assertStringContainsString('<text>AL</text>', $svg);
    }

    // component rendering

    public function testRendersSelectedVariant(): void
    {
        $style = $this->styleWithComponents();
        $svg = (new Avatar($style, ['seed' => 'test', 'eyesVariant' => 'open']))->toString();
        $this->assertStringContainsString('<circle r="5"/>', $svg);
        $this->assertStringNotContainsString('<line', $svg);
    }

    public function testRegistersVariantBodyInDefsAndReferencesItViaUse(): void
    {
        $style = $this->styleWithComponents();
        $svg = (new Avatar($style, ['seed' => 'test', 'eyesVariant' => 'open']))->toString();

        $this->assertSame(
            1,
            preg_match('/<g id="(eyes-open-[a-f0-9]+)"><circle r="5"\\/><\\/g>/', $svg, $idMatch),
            'expected variant body wrapped in <g id="…"> inside <defs>',
        );
        $this->assertStringContainsString('<defs>', $svg);
        $this->assertStringContainsString("<use href=\"#{$idMatch[1]}\"/>", $svg);
    }

    public function testSkipsComponentWithProbabilityZero(): void
    {
        $style = $this->styleWithComponents();
        $svg = (new Avatar($style, ['seed' => 'test', 'eyesProbability' => 0]))->toString();
        $this->assertStringNotContainsString('<circle', $svg);
        $this->assertStringNotContainsString('<line', $svg);
        $this->assertStringNotContainsString('<use', $svg);
    }

    public function testComponentTransformsFromDefinition(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [['type' => 'component', 'name' => 'eyes']],
            ],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'translate' => ['x' => ['min' => 5, 'max' => 5], 'y' => ['min' => 10, 'max' => 10]],
                    'variants' => ['open' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['r' => '5']]]]],
                ],
            ],
        ]);
        $svg = (new Avatar($style, ['seed' => 'test']))->toString();
        $this->assertStringContainsString('<use transform="translate(2.5, 5)" href="#eyes-open-', $svg);
    }

    public function testComponentRotationFromDefinitionWithCenter(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [['type' => 'component', 'name' => 'eyes']],
            ],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'rotate' => ['min' => 45, 'max' => 45],
                    'variants' => ['open' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['r' => '5']]]]],
                ],
            ],
        ]);
        $svg = (new Avatar($style, ['seed' => 'test']))->toString();
        $this->assertStringContainsString('<use transform="rotate(45, 25, 25)" href="#eyes-open-', $svg);
    }

    public function testOmitsTransformAttributeWithoutComponentTransforms(): void
    {
        $style = $this->styleWithComponents();
        $svg = (new Avatar($style, [
            'seed' => 'test',
            'eyesVariant' => 'open',
        ]))->toString();

        $this->assertStringContainsString('<use href="#eyes-open-', $svg);
        $this->assertSame(0, preg_match('/<use[^>]*\\btransform=/', $svg));
    }

    public function testAppliesAttributesFromComponentReferenceToUseTag(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100,
                'height' => 100,
                'elements' => [
                    [
                        'type' => 'component',
                        'name' => 'eyes',
                        'attributes' => [
                            'transform' => 'matrix(.5 0 0 .5 10 20)',
                            'opacity' => '.75',
                        ],
                    ],
                ],
            ],
            'components' => [
                'eyes' => [
                    'width' => 50,
                    'height' => 50,
                    'variants' => [
                        'open' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['r' => '5']]]],
                    ],
                ],
            ],
        ]);

        $svg = (new Avatar($style, ['seed' => 'test', 'eyesVariant' => 'open']))->toString();

        $this->assertStringContainsString(
            '<use transform="matrix(.5 0 0 .5 10 20)" opacity=".75" href="#eyes-open-',
            $svg,
        );
    }

    public function testPrependsUserTransformToBuiltInComponentTransforms(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100,
                'height' => 100,
                'elements' => [
                    [
                        'type' => 'component',
                        'name' => 'eyes',
                        'attributes' => ['transform' => 'matrix(.5 0 0 .5 10 20)'],
                    ],
                ],
            ],
            'components' => [
                'eyes' => [
                    'width' => 50,
                    'height' => 50,
                    'rotate' => ['min' => 45, 'max' => 45],
                    'variants' => [
                        'open' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['r' => '5']]]],
                    ],
                ],
            ],
        ]);

        $svg = (new Avatar($style, ['seed' => 'test']))->toString();

        $this->assertStringContainsString(
            '<use transform="matrix(.5 0 0 .5 10 20) rotate(45, 25, 25)" href="#eyes-open-',
            $svg,
        );
    }

    public function testDeduplicatesIdenticalComponentReferences(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100,
                'height' => 100,
                'elements' => [
                    ['type' => 'component', 'name' => 'eyes'],
                    ['type' => 'component', 'name' => 'eyes'],
                ],
            ],
            'components' => [
                'eyes' => [
                    'width' => 50,
                    'height' => 50,
                    'variants' => [
                        'open' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['r' => '5']]]],
                    ],
                ],
            ],
        ]);

        $svg = (new Avatar($style, ['seed' => 'test', 'eyesVariant' => 'open']))->toString();

        $this->assertSame(1, preg_match_all('/<circle r="5"\\/>/', $svg), 'variant body must appear only once');
        $this->assertSame(2, preg_match_all('/<use href="#eyes-open-[a-f0-9]+"\\/>/', $svg), 'each component reference becomes its own <use>');
    }

    // color rendering

    public function testSolidColorReference(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'rect', 'attributes' => ['fill' => ['type' => 'color', 'name' => 'bg']]],
                ],
            ],
            'colors' => ['bg' => ['values' => ['#ff0000']]],
        ]);
        $svg = (new Avatar($style, ['seed' => 'test', 'bgColor' => ['#ff0000']]))->toString();
        $this->assertStringContainsString('fill="#ff0000"', $svg);
    }

    public function testLinearGradient(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'rect', 'attributes' => ['fill' => ['type' => 'color', 'name' => 'bg']]],
                ],
            ],
            'colors' => ['bg' => ['values' => ['#ff0000', '#0000ff']]],
        ]);
        $svg = (new Avatar($style, ['seed' => 'test', 'bgColor' => ['#ff0000', '#0000ff'], 'bgColorFill' => 'linear']))->toString();
        $this->assertStringContainsString('<defs>', $svg);
        $this->assertStringContainsString('<linearGradient id="bg-color-', $svg);
        $this->assertStringContainsString('stop-color="#ff0000"', $svg);
        $this->assertStringContainsString('stop-color="#0000ff"', $svg);
        $this->assertStringContainsString('fill="url(#bg-color-', $svg);
    }

    public function testRadialGradient(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'rect', 'attributes' => ['fill' => ['type' => 'color', 'name' => 'bg']]],
                ],
            ],
            'colors' => ['bg' => ['values' => ['#ff0000', '#0000ff']]],
        ]);
        $svg = (new Avatar($style, ['seed' => 'test', 'bgColor' => ['#ff0000', '#0000ff'], 'bgColorFill' => 'radial']))->toString();
        $this->assertStringContainsString('<radialGradient id="bg-color-', $svg);
    }

    public function testKeepsStopOrderWhenColorOrderFixed(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'rect', 'attributes' => ['fill' => ['type' => 'color', 'name' => 'bg']]],
                ],
            ],
            'colors' => ['bg' => ['values' => ['#ff0000', '#0000ff']]],
        ]);
        $svg = (new Avatar($style, [
            'seed' => 'test',
            'bgColor' => ['#0055a4', '#ffffff', '#ef4135'],
            'bgColorFill' => 'linear',
            'bgColorOrder' => 'fixed',
        ]))->toString();
        $this->assertStringContainsString(
            '<stop offset="0%" stop-color="#0055a4"/>'
                . '<stop offset="50%" stop-color="#ffffff"/>'
                . '<stop offset="100%" stop-color="#ef4135"/>',
            $svg,
        );
    }

    // flip

    public function testHorizontalFlip(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['flip' => 'horizontal']))->toString();
        $this->assertStringContainsString('scale(-1, 1)', $svg);
        $this->assertStringContainsString('translate(100, 0)', $svg);
    }

    public function testVerticalFlip(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['flip' => 'vertical']))->toString();
        $this->assertStringContainsString('scale(1, -1)', $svg);
        $this->assertStringContainsString('translate(0, 100)', $svg);
    }

    public function testBothFlip(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['flip' => 'both']))->toString();
        $this->assertStringContainsString('scale(-1, -1)', $svg);
        $this->assertStringContainsString('translate(100, 100)', $svg);
    }

    public function testNoFlipWhenNone(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['flip' => 'none']))->toString();
        $this->assertStringNotContainsString('scale(-1', $svg);
    }

    // scale

    public function testScaleTransform(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['scale' => 0.5]))->toString();
        $this->assertStringContainsString('scale(0.5)', $svg);
        $this->assertStringContainsString('translate(50, 50)', $svg);
        $this->assertStringContainsString('translate(-50, -50)', $svg);
    }

    public function testNoScaleWhen1(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['scale' => 1]))->toString();
        $this->assertStringNotContainsString('scale(', $svg);
    }

    // component scale

    /**
     * @param array<string, mixed> $extras
     */
    private static function styleWithComponent(array $extras = []): Style
    {
        return new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [['type' => 'component', 'name' => 'eyes']],
            ],
            'components' => [
                'eyes' => array_merge(
                    ['width' => 50, 'height' => 50],
                    $extras,
                    ['variants' => ['open' => ['elements' => [['type' => 'element', 'name' => 'rect']]]]],
                ),
            ],
        ]);
    }

    public function testComponentScaleFromDefinition(): void
    {
        $svg = (new Avatar(self::styleWithComponent(['scale' => ['min' => 2, 'max' => 2]]), ['seed' => 'test']))->toString();
        $this->assertStringContainsString('translate(25, 25) scale(2) translate(-25, -25)', $svg);
    }

    public function testNoComponentScaleWrapperWhenDefinitionIsOne(): void
    {
        $svg = (new Avatar(self::styleWithComponent(), ['seed' => 'test']))->toString();
        $this->assertStringNotContainsString('scale(', $svg);
    }

    public function testComponentScaleAfterRotateInTransformAttribute(): void
    {
        $svg = (new Avatar(
            self::styleWithComponent(['rotate' => ['min' => 45, 'max' => 45], 'scale' => ['min' => 2, 'max' => 2]]),
            ['seed' => 'test'],
        ))->toString();

        $rotateIndex = strpos($svg, 'rotate(45');
        $scaleIndex = strpos($svg, 'scale(2)');

        $this->assertNotFalse($rotateIndex);
        $this->assertNotFalse($scaleIndex);
        $this->assertLessThan($scaleIndex, $rotateIndex);
    }

    // borderRadius

    public function testBorderRadiusViaClipPath(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['borderRadius' => 10]))->toString();
        $this->assertStringContainsString('<clipPath id="clip-', $svg);
        $this->assertStringContainsString('rx="10"', $svg);
        $this->assertStringContainsString('ry="10"', $svg);
        $this->assertStringContainsString('clip-path="url(#clip-', $svg);
    }

    public function testStillAppliesSquareClipPathWhenBorderRadiusIs0(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['borderRadius' => 0]))->toString();
        $this->assertStringContainsString('<clipPath id="clip-', $svg);
        $this->assertStringContainsString('rx="0"', $svg);
        $this->assertStringContainsString('ry="0"', $svg);
        $this->assertStringContainsString('clip-path="url(#clip-', $svg);
    }

    // idRandomization

    public function testRandomizeIdsWhenEnabled(): void
    {
        $style = $this->styleWithIds();
        $svg = (new Avatar($style, ['seed' => 'test', 'idRandomization' => true]))->toString();
        $this->assertStringNotContainsString('id="grad1"', $svg);
        $this->assertStringNotContainsString('url(#grad1)', $svg);
        $this->assertStringContainsString('id="grad1-', $svg);
        $this->assertStringContainsString('url(#grad1-', $svg);
    }

    public function testPreserveIdsWhenDisabled(): void
    {
        $style = $this->styleWithIds();
        $svg = (new Avatar($style, ['seed' => 'test', 'idRandomization' => false]))->toString();
        $this->assertStringContainsString('id="grad1"', $svg);
        $this->assertStringContainsString('url(#grad1)', $svg);
    }

    public function testDifferentIdsOnEachCall(): void
    {
        $style = $this->styleWithIds();
        $svg1 = (new Avatar($style, ['seed' => 'test', 'idRandomization' => true]))->toString();
        $svg2 = (new Avatar($style, ['seed' => 'test', 'idRandomization' => true]))->toString();
        $this->assertNotSame($svg1, $svg2);
    }

    // background

    public function testSolidBackground(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['backgroundColor' => ['#ff0000']]))->toString();
        $this->assertStringContainsString('<rect width="100" height="100" fill="#ff0000"/>', $svg);
    }

    public function testGradientBackground(): void
    {
        $svg = (new Avatar(self::minimalStyle(), [
            'backgroundColor' => ['#ff0000', '#0000ff'],
            'backgroundColorFill' => 'linear',
        ]))->toString();
        $this->assertStringContainsString('<linearGradient id="background-color-', $svg);
        $this->assertStringContainsString('fill="url(#background-color-', $svg);
    }

    public function testGradientRotation(): void
    {
        $svg = (new Avatar(self::minimalStyle(), [
            'backgroundColor' => ['#ff0000', '#0000ff'],
            'backgroundColorFill' => 'linear',
            'backgroundColorAngle' => 45,
        ]))->toString();
        $this->assertStringContainsString('gradientTransform="rotate(45, 0.5, 0.5)"', $svg);
    }

    public function testNoBackgroundWithoutColors(): void
    {
        $svg = (new Avatar(self::minimalStyle()))->toString();
        // The clipPath wrapper always emits a <rect>; only the background
        // <rect> carries a fill attribute, so check for that specifically.
        $this->assertDoesNotMatchRegularExpression('/<rect[^>]*\sfill=/', $svg);
    }

    // global transforms

    public function testGlobalRotation(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['rotate' => 45]))->toString();
        $this->assertStringContainsString('rotate(45, 50, 50)', $svg);
    }

    public function testNoRotationWhen0(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['rotate' => 0]))->toString();
        $this->assertStringNotContainsString('rotate(', $svg);
    }

    public function testGlobalTranslate(): void
    {
        $svg = (new Avatar(self::minimalStyle(), ['translateX' => 10, 'translateY' => -20]))->toString();
        $this->assertStringContainsString('translate(10, -20)', $svg);
    }

    // metadata

    public function testMetadataWithDublinCore(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'meta' => [
                'creator' => ['name' => 'John Doe'],
                'source' => ['name' => 'My Style', 'url' => 'https://example.com'],
                'license' => ['name' => 'MIT', 'url' => 'https://opensource.org/licenses/MIT'],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringContainsString('<metadata', $svg);
        $this->assertStringContainsString('<dc:title>My Style</dc:title>', $svg);
        $this->assertStringContainsString('<dc:creator>John Doe</dc:creator>', $svg);
    }

    public function testNoMetadataWhenNoMeta(): void
    {
        $svg = (new Avatar(self::minimalStyle()))->toString();
        $this->assertStringNotContainsString('<metadata', $svg);
    }

    public function testRemixOfPrefix(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'meta' => [
                'creator' => ['name' => 'Pablo Stanley'],
                'source' => ['name' => 'Avataaars', 'url' => 'https://avataaars.com'],
                'license' => ['name' => 'CC BY 4.0', 'url' => 'https://creativecommons.org/licenses/by/4.0/'],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringContainsString('Remix of', $svg);
        $this->assertStringContainsString('Avataaars', $svg);
    }

    public function testNoRemixOfForMitDiceBear(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'meta' => [
                'creator' => ['name' => 'DiceBear'],
                'source' => ['name' => 'Initials'],
                'license' => ['name' => 'MIT'],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringNotContainsString('Remix of', $svg);
        $this->assertStringContainsString('Initials', $svg);
    }

    public function testXmlEscapingInMetadata(): void
    {
        $style = new Style([
            'canvas' => ['width' => 100, 'height' => 100, 'elements' => []],
            'meta' => [
                'creator' => ['name' => 'A & B'],
                'source' => ['name' => '<Script>'],
                'license' => ['name' => 'MIT'],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringContainsString('A &amp; B', $svg);
        $this->assertStringContainsString('&lt;Script&gt;', $svg);
    }

    // variable attributes

    public function testFontFamilyVariable(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'text', 'attributes' => ['font-family' => ['type' => 'variable', 'name' => 'fontFamily']], 'children' => [
                        ['type' => 'text', 'value' => 'Hello'],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style, ['fontFamily' => 'Arial']))->toString();
        $this->assertStringContainsString('font-family="Arial"', $svg);
    }

    public function testFontWeightVariable(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'text', 'attributes' => ['font-weight' => ['type' => 'variable', 'name' => 'fontWeight']], 'children' => [
                        ['type' => 'text', 'value' => 'Hello'],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style, ['fontWeight' => 700]))->toString();
        $this->assertStringContainsString('font-weight="700"', $svg);
    }

    public function testPlainStringFontFamily(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'text', 'attributes' => ['font-family' => 'monospace'], 'children' => [
                        ['type' => 'text', 'value' => 'Hello'],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringContainsString('font-family="monospace"', $svg);
    }

    // xml escaping

    public function testEscapeAttributeValues(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'rect', 'attributes' => ['d' => 'a & b "c"']],
                ],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringContainsString('d="a &amp; b &quot;c&quot;"', $svg);
    }

    public function testEscapeTextContent(): void
    {
        $style = new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'text', 'children' => [
                        ['type' => 'text', 'value' => '<script>alert("xss")</script>'],
                    ]],
                ],
            ],
        ]);
        $svg = (new Avatar($style))->toString();
        $this->assertStringNotContainsString('<script>', $svg);
        $this->assertStringContainsString('&lt;script&gt;', $svg);
    }

    // helpers

    private function styleWithComponents(): Style
    {
        return new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [['type' => 'component', 'name' => 'eyes']],
            ],
            'components' => [
                'eyes' => [
                    'width' => 50, 'height' => 50,
                    'variants' => [
                        'open' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['r' => '5']]]],
                        'closed' => ['elements' => [['type' => 'element', 'name' => 'line', 'attributes' => ['x1' => '0', 'x2' => '10']]]],
                    ],
                ],
            ],
        ]);
    }

    private function styleWithIds(): Style
    {
        return new Style([
            'canvas' => [
                'width' => 100, 'height' => 100,
                'elements' => [
                    ['type' => 'element', 'name' => 'defs', 'children' => [
                        ['type' => 'element', 'name' => 'linearGradient', 'attributes' => ['id' => 'grad1'], 'children' => [
                            ['type' => 'element', 'name' => 'stop', 'attributes' => ['offset' => '0%', 'stop-color' => 'red']],
                        ]],
                    ]],
                    ['type' => 'element', 'name' => 'rect', 'attributes' => ['fill' => 'url(#grad1)']],
                ],
            ],
        ]);
    }

    // component aliases

    private static function aliasStyle(): Style
    {
        return new Style([
            'canvas' => [
                'width' => 100,
                'height' => 100,
                'elements' => [
                    ['type' => 'component', 'name' => 'eyes'],
                    ['type' => 'component', 'name' => 'eyesRight'],
                ],
            ],
            'components' => [
                'eyes' => [
                    'width' => 20,
                    'height' => 20,
                    'variants' => [
                        'a' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['id' => 'a']]]],
                        'b' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['id' => 'b']]]],
                        'c' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['id' => 'c']]]],
                        'd' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['id' => 'd']]]],
                        'e' => ['elements' => [['type' => 'element', 'name' => 'circle', 'attributes' => ['id' => 'e']]]],
                    ],
                ],
                'eyesRight' => ['extends' => 'eyes'],
            ],
        ]);
    }

    public function testAliasGetsIndependentVariantPerSeed(): void
    {
        $differed = false;

        foreach (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] as $seed) {
            $svg = (new Avatar(self::aliasStyle(), ['seed' => $seed]))->toString();
            preg_match_all('/<circle id="([a-z])"\\/>/', $svg, $matches);

            if (count($matches[1]) === 2 && $matches[1][0] !== $matches[1][1]) {
                $differed = true;
                break;
            }
        }

        $this->assertTrue($differed, 'expected at least one seed where alias picks a different variant than the source');
    }

    public function testAliasInheritsEyesVariantAndSharesDefsEntry(): void
    {
        $svg = (new Avatar(self::aliasStyle(), [
            'seed' => 'fallthrough',
            'eyesVariant' => 'b',
        ]))->toString();

        preg_match_all('/<circle id="([a-z])"\\/>/', $svg, $circles);
        preg_match_all('/<use href="#(eyes-[a-z]-[a-f0-9]+)"\\/>/', $svg, $uses);

        $this->assertSame(['b'], $circles[1], 'variant body is registered once');
        $this->assertCount(2, $uses[1], 'both component slots reference the body');
        $this->assertSame($uses[1][0], $uses[1][1], 'both <use> elements share the same href');
    }

    public function testAliasPropagatesEyesProbability(): void
    {
        $svg = (new Avatar(self::aliasStyle(), [
            'seed' => 'probability-fallthrough',
            'eyesProbability' => 0,
        ]))->toString();

        $this->assertStringNotContainsString('<circle', $svg);
    }

    public function testAliasSilentlyIgnoresAliasKeyedOptions(): void
    {
        $without = (new Avatar(self::aliasStyle(), [
            'seed' => 'ignore-alias-key',
            'eyesVariant' => 'a',
        ]))->toString();
        $with = (new Avatar(self::aliasStyle(), [
            'seed' => 'ignore-alias-key',
            'eyesVariant' => 'a',
            'eyesRightVariant' => 'd',
        ]))->toString();

        $this->assertSame($without, $with);
    }
}
