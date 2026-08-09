<?php

declare(strict_types=1);

namespace DiceBear;

/**
 * Builds a descriptor of every option a given style accepts. Tooling such as
 * the editor uses the result to render form controls and validation hints
 * without having to introspect the style itself.
 */
class OptionsDescriptor
{
    /** @var array<string, mixed> */
    private static array $rotateRange = ['type' => 'range', 'min' => -360, 'max' => 360];
    /** @var array<string, mixed> */
    private static array $translateRange = ['type' => 'range', 'min' => -1000, 'max' => 1000];

    /** @var array<string, mixed>|null */
    private ?array $descriptor = null;
    private Style $style;

    public function __construct(Style $style)
    {
        $this->style = $style;
    }

    /**
     * Returns the descriptor, building it lazily on first call.
     *
     * @return array<string, mixed>
     */
    public function toJSON(): array
    {
        $this->descriptor ??= $this->build();

        return $this->descriptor;
    }

    /**
     * Walks the style's components and colors and assembles the field map.
     *
     * @return array<string, mixed>
     */
    private function build(): array
    {
        $result = [
            'seed' => ['type' => 'string'],
            'size' => ['type' => 'number', 'min' => 1, 'max' => 4096],
            'idRandomization' => ['type' => 'boolean'],
            'title' => ['type' => 'string'],
            'flip' => [
                'type' => 'enum',
                'values' => ['none', 'horizontal', 'vertical', 'both'],
                'list' => true,
            ],
            'fontFamily' => ['type' => 'string', 'list' => true],
            'fontWeight' => ['type' => 'number', 'min' => 1, 'max' => 1000, 'list' => true],
            'scale' => ['type' => 'range', 'min' => 0, 'max' => 10],
            'borderRadius' => ['type' => 'range', 'min' => 0, 'max' => 50],
            'rotate' => self::$rotateRange,
            'translateX' => self::$translateRange,
            'translateY' => self::$translateRange,
        ];

        $tags = [];

        foreach ($this->style->components() as $name => $component) {
            if ($component->extendsName() !== null) {
                continue;
            }

            $variants = $component->variants();
            $variantNames = array_keys($variants);
            sort($variantNames);

            $result["{$name}Variant"] = [
                'type' => 'enum',
                'values' => $variantNames,
                'list' => true,
                'weighted' => true,
            ];
            $result["{$name}Probability"] = ['type' => 'number', 'min' => 0, 'max' => 100];

            foreach ($variants as $variant) {
                foreach ($variant->tags() as $tag) {
                    $tags[$tag] = true;
                }
            }
        }

        $colorNames = array_merge(array_keys($this->style->colors()), ['background']);
        $colors = $this->style->colors();

        foreach ($colorNames as $name) {
            $colorField = ['type' => 'color', 'list' => true];
            $contrastTo = isset($colors[$name]) ? $colors[$name]->contrastTo() : null;

            if ($contrastTo !== null) {
                $colorField['contrastTo'] = $contrastTo;
            }

            $result["{$name}Color"] = $colorField;
            $result["{$name}ColorFill"] = [
                'type' => 'enum',
                'values' => ['solid', 'linear', 'radial'],
                'list' => true,
            ];
            $result["{$name}ColorFillStops"] = ['type' => 'range', 'min' => 2];
            $result["{$name}ColorAngle"] = self::$rotateRange;
            $result["{$name}ColorOrder"] = [
                'type' => 'enum',
                'values' => [Options::COLOR_ORDER_RANDOM, Options::COLOR_ORDER_FIXED],
            ];
        }

        // Only advertise the `tags` filter when the style actually carries tags.
        // The values are the sorted union of every tag across the style's
        // variants, but `open` marks them as suggestions: the filter also
        // accepts `!` disallows and bare categories. Only an unknown category
        // is ignored. An unknown value inside a category the style does use
        // matches nothing, so every variant tagged on that axis is dropped.
        if (count($tags) > 0) {
            $tagValues = array_keys($tags);
            sort($tagValues);

            $result['tags'] = [
                'type' => 'enum',
                'values' => $tagValues,
                'list' => true,
                'open' => true,
            ];
        }

        return $result;
    }
}
