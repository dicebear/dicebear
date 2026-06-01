<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Prng\Fnv1a;
use DiceBear\Style\Canvas;
use DiceBear\Style\Element;
use DiceBear\Utils\Initials;
use DiceBear\Utils\License;
use DiceBear\Utils\Number;
use DiceBear\Utils\Xml;

/**
 * Walks a style's element tree and turns it into the final SVG markup.
 *
 * The renderer is single-use: it accumulates `<defs>` entries and per-render
 * caches across method calls, so a fresh instance is required per avatar.
 */
class Renderer
{
    private Style $style;
    private Resolver $resolver;
    /** @var array<string, string> */
    private array $defs = [];
    private ?string $cachedSeedHash = null;
    private ?string $cachedInitials = null;

    public function __construct(Style $style, Resolver $resolver)
    {
        $this->style = $style;
        $this->resolver = $resolver;
    }

    /**
     * Builds the complete SVG document for the avatar.
     */
    public function render(): string
    {
        $canvas = $this->style->canvas();
        $background = $this->renderBackground($canvas);
        $body = $this->renderElements($canvas->elements());

        // Order matters: scale and flip around center, then rotate, translate,
        // and finally clip with border radius (outermost wrapper).
        $body = $this->applyScale($body, $canvas);
        $body = $this->applyFlip($body, $canvas);
        $body = $this->applyRotate($body, $canvas);
        $body = $this->applyTranslate($body, $canvas);
        $body = $this->applyBorderRadius($background . $body, $canvas);

        $metadata = License::xml($this->style->meta());
        $defs = count($this->defs) > 0
            ? '<defs>' . implode('', array_values($this->defs)) . '</defs>'
            : '';
        $size = $this->resolver->size();

        $title = $this->resolver->title();
        $escapedTitle = $title !== null ? Xml::escape($title) : null;

        $width = Number::format($canvas->width());
        $height = Number::format($canvas->height());
        $attrs = [
            'xmlns="http://www.w3.org/2000/svg"',
            "viewBox=\"0 0 {$width} {$height}\"",
        ];

        $rootAttributes = $this->renderAttributes($this->style->attributes());

        if ($rootAttributes !== '') {
            $attrs[] = ltrim($rootAttributes);
        }

        if ($escapedTitle !== null) {
            $attrs[] = 'role="img"';
            $attrs[] = "aria-label=\"{$escapedTitle}\"";
        } else {
            $attrs[] = 'aria-hidden="true"';
        }

        if ($size !== null) {
            $sizeValue = Number::format($size);
            $attrs[] = "width=\"{$sizeValue}\"";
            $attrs[] = "height=\"{$sizeValue}\"";
        }

        $titleElement = $escapedTitle !== null ? "<title>{$escapedTitle}</title>" : '';

        $svg = '<svg ' . implode(' ', $attrs) . '>' . $metadata . $defs . $titleElement . $body . '</svg>';

        if ($this->resolver->idRandomization()) {
            $svg = $this->randomizeIds($svg);
        }

        return $svg;
    }

    /**
     * Wraps `$body` in a flip transform when `flip` is set to anything other
     * than `'none'`.
     */
    private function applyFlip(string $body, Canvas $canvas): string
    {
        $flip = $this->resolver->flip();

        if ($flip === 'none') {
            return $body;
        }

        $w = Number::format($canvas->width());
        $h = Number::format($canvas->height());

        // @phpstan-ignore match.unhandled
        $transform = match ($flip) {
            'horizontal' => "translate({$w}, 0) scale(-1, 1)",
            'vertical' => "translate(0, {$h}) scale(1, -1)",
            'both' => "translate({$w}, {$h}) scale(-1, -1)",
        };

        return "<g transform=\"{$transform}\">{$body}</g>";
    }

    /**
     * Wraps `$body` in a uniform scale transform around the canvas center
     * when the option differs from `1`.
     */
    private function applyScale(string $body, Canvas $canvas): string
    {
        $scale = $this->resolver->scale();

        if ($scale === 1.0) {
            return $body;
        }

        $cx = $canvas->width() / 2;
        $cy = $canvas->height() / 2;
        $cxValue = Number::format($cx);
        $cyValue = Number::format($cy);
        $scaleValue = Number::format($scale);
        $negCx = Number::format(-$cx);
        $negCy = Number::format(-$cy);

        return "<g transform=\"translate({$cxValue}, {$cyValue}) scale({$scaleValue}) translate({$negCx}, {$negCy})\">{$body}</g>";
    }

    /**
     * Clips `$body` to the canvas rectangle (rounded when `borderRadius` is
     * non-zero) and registers the corresponding `clipPath` in `<defs>`. The
     * clip is always applied so transformed content cannot bleed past the
     * canvas bounds, regardless of the consumer's `overflow` setting.
     */
    private function applyBorderRadius(string $body, Canvas $canvas): string
    {
        $radius = $this->resolver->borderRadius();
        $id = 'clip-' . $this->hashSeed();

        $rx = Number::format(($radius / 100) * $canvas->width());
        $ry = Number::format(($radius / 100) * $canvas->height());
        $width = Number::format($canvas->width());
        $height = Number::format($canvas->height());

        $this->defs[$id] = "<clipPath id=\"{$id}\"><rect width=\"{$width}\" height=\"{$height}\" rx=\"{$rx}\" ry=\"{$ry}\"/></clipPath>";

        return "<g clip-path=\"url(#{$id})\">{$body}</g>";
    }

    /**
     * Wraps `$body` in a rotation around the canvas center when `rotate` is
     * non-zero.
     */
    private function applyRotate(string $body, Canvas $canvas): string
    {
        $rotate = $this->resolver->rotate();

        if ($rotate === 0.0) {
            return $body;
        }

        $cx = Number::format($canvas->width() / 2);
        $cy = Number::format($canvas->height() / 2);
        $rotateValue = Number::format($rotate);

        return "<g transform=\"rotate({$rotateValue}, {$cx}, {$cy})\">{$body}</g>";
    }

    /**
     * Wraps `$body` in a translate transform when either `translateX` or
     * `translateY` is non-zero. Offsets are interpreted as percentages of
     * the canvas dimensions.
     */
    private function applyTranslate(string $body, Canvas $canvas): string
    {
        $translateX = $this->resolver->translateX();
        $translateY = $this->resolver->translateY();

        if ($translateX === 0.0 && $translateY === 0.0) {
            return $body;
        }

        $x = Number::format(($translateX / 100) * $canvas->width());
        $y = Number::format(($translateY / 100) * $canvas->height());

        return "<g transform=\"translate({$x}, {$y})\">{$body}</g>";
    }

    /**
     * Returns a `<rect>` filling the canvas with the resolved background
     * color, or an empty string when no background colors are configured.
     */
    private function renderBackground(Canvas $canvas): string
    {
        $colors = $this->resolver->color('background');

        if (count($colors) === 0) {
            return '';
        }

        $fill = Xml::escape($this->resolveColorReference('background'));
        $width = Number::format($canvas->width());
        $height = Number::format($canvas->height());

        return "<rect width=\"{$width}\" height=\"{$height}\" fill=\"{$fill}\"/>";
    }

    /**
     * Suffixes every `id` declaration and reference with a random hex string
     * so that multiple instances of the same avatar do not collide in a
     * shared document. Uses `random_int()` intentionally — a PRNG-derived
     * suffix would produce the same ID for the same seed.
     */
    private function randomizeIds(string $svg): string
    {
        $suffix = str_pad(dechex(random_int(0, 0xffffff)), 6, '0', STR_PAD_LEFT);
        $ids = [];

        if (preg_match_all('/\bid="([^"]+)"/', $svg, $matches)) {
            $ids = array_unique($matches[1]);
        }

        if (count($ids) === 0) {
            return $svg;
        }

        $escaped = array_map(fn($id) => preg_quote($id, '/'), $ids);
        $pattern = '/(id="|url\(#|href="#)(' . implode('|', $escaped) . ')("|\))/';

        return preg_replace_callback($pattern, function ($match) use ($suffix) {
            return $match[1] . $match[2] . '-' . $suffix . $match[3];
        }, $svg);
    }

    /**
     * Renders a list of elements and concatenates their markup.
     *
     * @param list<Element> $elements
     */
    private function renderElements(array $elements): string
    {
        return implode('', array_map(fn($el) => $this->renderElement($el), $elements));
    }

    /**
     * Dispatches a single element to the renderer for its type.
     */
    private function renderElement(Element $element): string
    {
        // @phpstan-ignore match.unhandled
        return match ($element->type()) {
            'element' => $this->renderSvgElement($element),
            'text' => $this->renderTextElement($element),
            'component' => $this->renderComponentElement($element),
        };
    }

    /**
     * Renders an SVG element. The special `defs` name diverts children into
     * the shared `<defs>` block.
     *
     * Element names and attribute names are not escaped here — they are
     * validated by StyleValidator against a strict allowlist schema (no
     * `<script>`, no event handlers). Values are escaped via `Xml::escape()`.
     */
    private function renderSvgElement(Element $element): string
    {
        $name = $element->name();

        if ($name === null) {
            return '';
        }

        if ($name === 'defs') {
            foreach ($element->children() as $child) {
                $rendered = $this->renderElement($child);

                if (strlen($rendered) > 0) {
                    $attrs = $child->attributes();
                    $id = isset($attrs['id']) && is_string($attrs['id']) ? $attrs['id'] : '_' . count($this->defs);
                    $this->defs[$id] = $rendered;
                }
            }

            return '';
        }

        $attrs = $this->renderAttributes($element->attributes());
        $children = $this->renderElements($element->children());

        if (strlen($children) === 0) {
            return "<{$name}{$attrs}/>";
        }

        return "<{$name}{$attrs}>{$children}</{$name}>";
    }

    /**
     * Renders a text element by escaping its resolved value.
     */
    private function renderTextElement(Element $element): string
    {
        $value = $element->value();

        return $value !== null ? Xml::escape($this->resolveValue($value)) : '';
    }

    /**
     * Resolves a component reference to a chosen variant and emits a `<use>`
     * pointing at a `<defs>` entry that holds the variant body. Aliases of the
     * same source component sharing a variant — and identical components
     * referenced more than once — therefore produce a single `<defs>` entry
     * referenced by every `<use>`, never duplicated SVG markup.
     *
     * Any `attributes` on the component reference are written to the emitted
     * `<use>` tag. A user-supplied `transform` is prepended to the
     * per-component transforms so it acts as the outer (placement) transform,
     * with the style's translate/rotate/scale applied inside it.
     */
    private function renderComponentElement(Element $element): string
    {
        $componentName = $element->name();

        if (!is_string($componentName)) {
            return '';
        }

        $variantName = $this->resolver->variant($componentName);

        if ($variantName === null) {
            return '';
        }

        $components = $this->style->components();
        $component = $components[$componentName] ?? null;

        if ($component === null) {
            return '';
        }

        $variants = $component->variants();
        $variant = $variants[$variantName] ?? null;

        if ($variant === null) {
            return '';
        }

        $id = "{$component->sourceName()}-{$variantName}-{$this->hashSeed()}";

        if (!array_key_exists($id, $this->defs)) {
            $body = $this->renderElements($variant->elements());

            $this->defs[$id] = "<g id=\"{$id}\">{$body}</g>";
        }

        $transforms = $this->buildTransforms($component);
        $userAttributes = $element->attributes();
        $mergedAttributes = $userAttributes;

        if (count($transforms) > 0) {
            $userTransform = $userAttributes['transform'] ?? null;
            $allParts = is_string($userTransform) && $userTransform !== ''
                ? [$userTransform, ...$transforms]
                : $transforms;

            $mergedAttributes = $userAttributes ?? [];
            $mergedAttributes['transform'] = implode(' ', $allParts);
        }

        $attrs = $this->renderAttributes($mergedAttributes);

        return "<use{$attrs} href=\"#{$id}\"/>";
    }

    /**
     * Returns the per-component SVG `transform` fragments derived from the
     * component's translate, rotate, and scale options. Translate values are
     * percentages of the component canvas dimensions, matching the
     * semantics of the user-facing `translateX` / `translateY` options.
     *
     * The fragments are ordered so that, when joined into a single
     * `transform` attribute, the scale is the rightmost (innermost)
     * transform — applied first to a point, followed by rotate, then
     * translate.
     *
     * @return list<string>
     */
    private function buildTransforms(Style\Component $component): array
    {
        ['rotate' => $rotate, 'translateX' => $translateX, 'translateY' => $translateY, 'scale' => $scale] =
            $this->resolver->componentTransform($component->name());

        if ($translateX === 0.0 && $translateY === 0.0 && $rotate === 0.0 && $scale === 1.0) {
            return [];
        }

        $transforms = [];
        $cx = $component->width() / 2;
        $cy = $component->height() / 2;
        $cxValue = Number::format($cx);
        $cyValue = Number::format($cy);

        if ($translateX !== 0.0 || $translateY !== 0.0) {
            $x = Number::format(($translateX / 100) * $component->width());
            $y = Number::format(($translateY / 100) * $component->height());
            $transforms[] = "translate({$x}, {$y})";
        }

        if ($rotate !== 0.0) {
            $rotateValue = Number::format($rotate);
            $transforms[] = "rotate({$rotateValue}, {$cxValue}, {$cyValue})";
        }

        if ($scale !== 1.0) {
            $scaleValue = Number::format($scale);
            $negCx = Number::format(-$cx);
            $negCy = Number::format(-$cy);
            $transforms[] = "translate({$cxValue}, {$cyValue}) scale({$scaleValue}) translate({$negCx}, {$negCy})";
        }

        return $transforms;
    }

    /**
     * Serializes an attribute map to a leading space-prefixed string suitable
     * for inlining into a tag. Returns an empty string when there are no
     * attributes to render.
     *
     * @param array<string, mixed>|null $attributes
     */
    private function renderAttributes(?array $attributes): string
    {
        if ($attributes === null) {
            return '';
        }

        $parts = [];

        foreach ($attributes as $key => $value) {
            if ($value === null) {
                continue;
            }

            $parts[] = "{$key}=\"" . Xml::escape($this->resolveAttributeValue($value)) . '"';
        }

        if (count($parts) === 0) {
            return '';
        }

        return ' ' . implode(' ', $parts);
    }

    /**
     * Resolves a single attribute value: literal strings pass through, color
     * and variable references are dereferenced through the option resolver.
     *
     * @param string|array<string, mixed> $value
     */
    private function resolveAttributeValue(string|array $value): string
    {
        if (is_string($value)) {
            return $value;
        }

        if (($value['type'] ?? null) === 'color') {
            return $this->resolveColorReference($value['name']);
        }

        return $this->resolveVariable($value['name']);
    }

    /**
     * Resolves a named color into either a hex string (solid fill / single
     * color) or a `url(#…)` gradient reference, registering the gradient in
     * `<defs>` as a side effect.
     */
    private function resolveColorReference(string $name): string
    {
        $colors = $this->resolver->color($name);
        $fill = $this->resolver->colorFill($name);

        if ($fill === 'solid' || count($colors) <= 1) {
            return $colors[0] ?? 'none';
        }

        return $this->buildGradientDef($name, $colors, $fill);
    }

    /**
     * Builds the `<linearGradient>` or `<radialGradient>` for the given color
     * definition, registers it in `<defs>`, and returns its `url(#…)`
     * reference.
     *
     * @param list<string> $colors
     */
    private function buildGradientDef(string $name, array $colors, string $fill): string
    {
        $rotation = $this->resolver->colorAngle($name);
        $id = "{$name}-color-{$this->hashSeed()}";
        $tag = $fill === 'linear' ? 'linearGradient' : 'radialGradient';
        $rotationValue = Number::format($rotation);
        $rotateAttr = $rotation !== 0.0
            ? " gradientTransform=\"rotate({$rotationValue}, 0.5, 0.5)\""
            : '';

        $stops = [];
        $count = count($colors);

        foreach ($colors as $i => $color) {
            $offset = Number::format($i / ($count - 1) * 100);
            $stops[] = "<stop offset=\"{$offset}%\" stop-color=\"" . Xml::escape($color) . '"/>';
        }

        $this->defs[$id] = "<{$tag} id=\"{$id}\"{$rotateAttr}>" . implode('', $stops) . "</{$tag}>";

        return "url(#{$id})";
    }

    /**
     * Resolves an element value to its final string form. Literal strings
     * pass through; variable references are dereferenced.
     *
     * @param string|array<string, mixed> $value
     */
    private function resolveValue(string|array $value): string
    {
        if (is_string($value)) {
            return $value;
        }

        if (($value['type'] ?? null) === 'variable') {
            return $this->resolveVariable($value['name']);
        }

        return '';
    }

    /**
     * Resolves a built-in variable reference to its current value.
     */
    private function resolveVariable(string $name): string
    {
        // @phpstan-ignore match.unhandled
        return match ($name) {
            'initial' => mb_substr($this->initials(), 0, 1),
            'initials' => $this->initials(),
            'fontWeight' => Number::format($this->resolver->fontWeight()),
            'fontFamily' => $this->resolver->fontFamily(),
        };
    }

    /**
     * Returns the seed-derived initials, cached after the first call.
     */
    private function initials(): string
    {
        return $this->cachedInitials ??= Initials::fromSeed($this->resolver->seed());
    }

    /**
     * Returns the FNV-1a hex hash of the seed, cached after the first call.
     * The value is used to derive stable but unique IDs for `<defs>` entries.
     */
    private function hashSeed(): string
    {
        return $this->cachedSeedHash ??= Fnv1a::hex($this->resolver->seed());
    }
}
