<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Error\CircularColorReferenceError;
use DiceBear\Utils\Color as ColorUtil;

/**
 * Bundles the three inputs needed to derive any deterministic value for an
 * avatar — the {@see Style}, the validated user {@see Options}, and a seeded
 * {@see Prng} — and exposes them as named accessors. Each accessor memoizes
 * its result so that repeated calls cannot drift. The memo also serves as
 * the informational snapshot returned by {@see resolved} — every value the
 * resolver picks during one resolution lands there, except for the raw seed.
 *
 * @internal
 */
class Resolver
{
    private Style $style;
    private Options $options;
    private Prng $prng;
    /** @var list<string> */
    private array $colorResolving = [];
    /** @var array<string, mixed> */
    private array $result = [];
    /**
     * @var ?array{
     *     allows: array<string, list<string>>,
     *     bares: list<string>,
     *     disallows: list<array{category: string, value: ?string}>,
     *     bareDisallows: array<string, true>,
     * }
     */
    private ?array $tagFilter = null;

    public function __construct(Style $style, Options $options)
    {
        $this->style = $style;
        $this->options = $options;
        $this->prng = new Prng($this->seed());
    }

    public function seed(): string
    {
        // Deliberately not memoized — the seed is the only input we keep out
        // of the {@see resolved} snapshot, so a serialized avatar never leaks it.
        return $this->options->seed() ?? '';
    }

    public function size(): ?int
    {
        return $this->memo('size', fn() => $this->options->size());
    }

    public function idRandomization(): bool
    {
        return $this->memo('idRandomization', fn() => $this->options->idRandomization() ?? false);
    }

    public function animation(): bool
    {
        // Deliberately without PRNG involvement: whether an avatar animates
        // must not depend on the seed.
        return $this->memo('animation', fn() => $this->options->animation() ?? false);
    }

    /**
     * Whether one timeline plays. A named timeline follows its
     * `${name}Animation` switch when the user set one, recorded under that
     * key, and the global `animation` switch otherwise. Unnamed timelines
     * always follow the global switch.
     */
    public function animationPlays(?string $name): bool
    {
        $value = $name === null ? null : $this->options->animationFor($name);

        if ($name === null || $value === null) {
            return $this->animation();
        }

        return $this->memo("{$name}Animation", fn() => $value);
    }

    public function animationSpeed(): float
    {
        return $this->memoFloat('animationSpeed', $this->options->animationSpeed(), 1.0);
    }

    /**
     * Returns the speed factor of one timeline. A named timeline plays at its
     * `${name}AnimationSpeed` option when the user set one, drawn under that
     * key, and at the global factor otherwise. Unnamed timelines always
     * follow the global factor.
     */
    public function animationSpeedFor(?string $name): float
    {
        $range = $name === null ? null : $this->options->animationSpeedFor($name);

        if ($name === null || $range === null) {
            return $this->animationSpeed();
        }

        return $this->memoFloat("{$name}AnimationSpeed", $range, 1.0);
    }

    public function animationDelay(): float
    {
        return $this->memoFloat('animationDelay', $this->options->animationDelay(), 0.0);
    }

    /**
     * Returns the start offset of one timeline in seconds. A named timeline
     * uses its `${name}AnimationDelay` option when the user set one, drawn
     * under that key, and the global offset otherwise. Unnamed timelines
     * always follow the global offset.
     */
    public function animationDelayFor(?string $name): float
    {
        $range = $name === null ? null : $this->options->animationDelayFor($name);

        if ($name === null || $range === null) {
            return $this->animationDelay();
        }

        return $this->memoFloat("{$name}AnimationDelay", $range, 0.0);
    }

    public function title(): ?string
    {
        return $this->memo('title', fn() => $this->options->title());
    }

    public function flip(): string
    {
        return $this->memo(
            'flip',
            fn() => $this->prng->pick('flip', $this->options->flip()) ?? 'none',
        );
    }

    public function fontFamily(): string
    {
        return $this->memo(
            'fontFamily',
            fn() => $this->prng->pick('fontFamily', $this->options->fontFamily()) ?? 'system-ui',
        );
    }

    public function fontWeight(): int|float
    {
        return $this->memo(
            'fontWeight',
            fn() => $this->prng->pick('fontWeight', $this->options->fontWeight()) ?? 400,
        );
    }

    public function scale(): float
    {
        return $this->memoFloat('scale', $this->options->scale(), 1.0);
    }

    public function borderRadius(): float
    {
        return $this->memoFloat('borderRadius', $this->options->borderRadius(), 0.0);
    }

    public function rotate(): float
    {
        return $this->memoFloat('rotate', $this->options->rotate(), 0.0);
    }

    public function translateX(): float
    {
        return $this->memoFloat('translateX', $this->options->translateX(), 0.0);
    }

    public function translateY(): float
    {
        return $this->memoFloat('translateY', $this->options->translateY(), 0.0);
    }

    /**
     * Selects a variant for the given component. The pool the PRNG draws from
     * is built from the per-component `${name}Variant` option and the global
     * `tags` filter (see {@see variantWeights()}). Only variants that exist in
     * the style definition are considered.
     */
    public function variant(string $name): ?string
    {
        return $this->memo("{$name}Variant", function () use ($name) {
            $components = $this->style->components();
            $component = $components[$name] ?? null;

            if ($component === null || !$this->isVisible($name, $component)) {
                return null;
            }

            return $this->prng->weightedPick(
                "{$name}Variant",
                $this->variantWeights($component),
            );
        });
    }

    /**
     * @return list<string>
     */
    public function color(string $name): array
    {
        return $this->memo("{$name}Color", fn() => $this->resolveColor($name));
    }

    public function colorFill(string $name): string
    {
        return $this->memo(
            "{$name}ColorFill",
            fn() => $this->prng->pick("{$name}ColorFill", $this->options->colorFill($name)) ?? 'solid',
        );
    }

    public function colorAngle(string $name): float
    {
        return $this->memoFloat("{$name}ColorAngle", $this->options->colorAngle($name), 0.0);
    }

    public function colorOrder(string $name): string
    {
        // Deliberately not memoized: unlike colorFill this is no PRNG pick, so
        // it stays out of the {@see resolved} snapshot.
        return $this->options->colorOrder($name) ?? Options::COLOR_ORDER_RANDOM;
    }

    /**
     * Picks the rotate/translateX/translateY/scale values for a single
     * component. Memoized per `name`, so the four values land in
     * {@see resolved} as `${name}Rotate` / `${name}TranslateX` /
     * `${name}TranslateY` / `${name}Scale` for downstream introspection.
     *
     * @return array{rotate: float, translateX: float, translateY: float, scale: float}
     */
    public function componentTransform(string $name): array
    {
        $components = $this->style->components();
        $component = $components[$name] ?? null;

        return [
            'rotate' => $this->memoFloat("{$name}Rotate", $component?->rotate(), 0.0),
            'translateX' => $this->memoFloat("{$name}TranslateX", $component?->translate()->x(), 0.0),
            'translateY' => $this->memoFloat("{$name}TranslateY", $component?->translate()->y(), 0.0),
            'scale' => $this->memoFloat("{$name}Scale", $component?->scale(), 1.0),
        ];
    }

    /**
     * Returns an informational snapshot of every value the resolver picked.
     * Includes top-level options (scale/rotate/translate/…), per-component
     * variants/probabilities/colors, and per-component transform picks. The
     * raw seed is deliberately excluded.
     *
     * The snapshot is NOT a round-trip-able options object — extra keys like
     * `${name}Rotate` are not part of the user-options schema and feeding the
     * snapshot back into a new {@see Avatar} is not supported. Callers that
     * need to reproduce an avatar should pass the original `seed` and
     * user-supplied options.
     *
     * Unset entries (null) are filtered out so they disappear on JSON encode,
     * mirroring the JS behavior.
     *
     * Whole-number floats (e.g. `scale` 1.0, `rotate` 0.0) are left as floats
     * here. `json_encode()` drops the zero fraction by default — `1.0` encodes
     * to `1` — so the snapshot stays byte-identical to the JS, Rust, and Python
     * ports. This relies on the default encoder behavior: passing
     * `JSON_PRESERVE_ZERO_FRACTION` would emit `1.0` and break that parity.
     *
     * @return array<string, mixed>
     */
    public function resolved(): array
    {
        return array_filter($this->result, static fn($v) => $v !== null);
    }

    /**
     * Returns the visibility probability (0–100) for the given component.
     * Aliases read the source component's user-set probability so a single
     * `<source>Probability` option propagates to every alias of the source.
     */
    private function probability(Style\Component $component): int|float
    {
        $raw = $this->options->componentProbability($component->sourceName());

        return $raw ?? $component->probability();
    }

    private function isVisible(string $name, Style\Component $component): bool
    {
        return $this->prng->bool("{$name}Probability", $this->probability($component));
    }

    /**
     * Builds the name → weight map the PRNG draws a variant from. The
     * per-component `${name}Variant` option is more specific than the global
     * `tags` filter, so it takes precedence: when set, it fully governs the
     * component's pool (its named variants, weighted by the option) and the
     * tags filter is ignored for that component. The tags filter applies only
     * where the user gave no explicit `${name}Variant` (see
     * {@see tagFilteredNames()}), and falls back to every variant when neither
     * is set.
     *
     * Names the style does not define are dropped, and an empty `${name}Variant`
     * (or an empty tag result) yields no variant.
     *
     * @return array<string, int|float>
     */
    private function variantWeights(Style\Component $component): array
    {
        $variants = $component->variants();
        $named = $this->options->componentVariant($component->sourceName());
        $weights = [];

        if ($named !== null) {
            $names = array_keys($named);
        } elseif (count($this->options->tags()) > 0) {
            $names = $this->tagFilteredNames($variants);
        } else {
            $names = array_keys($variants);
        }

        foreach ($names as $name) {
            if (isset($variants[$name])) {
                $weights[$name] = $named !== null ? $named[$name] : $variants[$name]->weight();
            }
        }

        return $weights;
    }

    /**
     * Classifies the parsed {@see Options::tags()} tokens into the allow
     * groups, bare requirements and disallows the filter is composed from. The
     * result depends only on the options, never on a component, so it is
     * computed once per avatar rather than rebuilt for each of a style's
     * components. `bareDisallows` is the subset of `disallows` carrying no
     * value, kept as a lookup set for the per-component narrowing.
     *
     * @return array{
     *     allows: array<string, list<string>>,
     *     bares: list<string>,
     *     disallows: list<array{category: string, value: ?string}>,
     *     bareDisallows: array<string, true>,
     * }
     */
    private function tagFilter(): array
    {
        if ($this->tagFilter !== null) {
            return $this->tagFilter;
        }

        $allows = [];
        $bares = [];
        $disallows = [];
        $bareDisallows = [];

        foreach ($this->options->tags() as $token) {
            if ($token['negated']) {
                $value = $token['value'] ?? null;
                $disallows[] = ['category' => $token['category'], 'value' => $value];

                if ($value === null) {
                    $bareDisallows[$token['category']] = true;
                }
            } elseif (isset($token['value'])) {
                $allows[$token['category']][] = $token['value'];
            } else {
                $bares[] = $token['category'];
            }
        }

        $this->tagFilter = [
            'allows' => $allows,
            'bares' => array_values(array_unique($bares)),
            'disallows' => $disallows,
            'bareDisallows' => $bareDisallows,
        ];

        return $this->tagFilter;
    }

    /**
     * Narrows a component's variants to the names satisfying the global `tags`
     * filter, applying the parsed {@see Options::tags()} tokens in one pass over
     * the pool:
     *
     * - A positive `cat:value` token is an axis-scoped allow. Within each
     *   category some allow mentions, a variant is kept only if it carries no
     *   tag in that category (untouched) or matches one of the allowed values
     *   (OR within the category). Distinct allowed categories combine with AND,
     *   and a category no allow mentions is left unconstrained.
     * - A bare positive `cat` token requires the category: it drops variants
     *   that carry no tag in `cat`. It only binds where the category is in
     *   use — a component with no `cat` tag on any variant is left untouched,
     *   so `animation` turns on a style's opt-in animation without erasing
     *   the components that know nothing about it.
     * - A negative `!cat`/`!cat:value` token disallows, dropping every variant
     *   carrying any tag in `cat` (bare) or the exact `cat:value` tag. Disallows
     *   are checked alongside allows but always win.
     *
     * Returns the surviving variant names in definition order.
     *
     * @param array<string, Style\ComponentVariant> $variants
     *
     * @return list<string>
     */
    private function tagFilteredNames(array $variants): array
    {
        ['allows' => $allows, 'bares' => $bares, 'disallows' => $disallows, 'bareDisallows' => $bareDisallows] = $this->tagFilter();

        // A bare token only binds where its category is in use, so this
        // narrowing — unlike the classification — is genuinely per-component.
        $required = [];

        foreach ($bares as $category) {
            if (isset($bareDisallows[$category])) {
                continue;
            }

            foreach ($variants as $variant) {
                if ($variant->hasTag($category)) {
                    $required[] = $category;
                    break;
                }
            }
        }

        $names = [];

        foreach ($variants as $name => $variant) {
            $allowed = true;

            foreach ($required as $category) {
                if (!$variant->hasTag($category)) {
                    $allowed = false;
                    break;
                }
            }

            if (!$allowed) {
                continue;
            }

            foreach ($allows as $category => $values) {
                if (!$variant->hasTag($category)) {
                    continue;
                }

                $matches = false;

                foreach ($values as $value) {
                    if ($variant->hasTag($category, $value)) {
                        $matches = true;
                        break;
                    }
                }

                if (!$matches) {
                    $allowed = false;
                    break;
                }
            }

            $disallowed = false;

            foreach ($disallows as $disallow) {
                if ($variant->hasTag($disallow['category'], $disallow['value'])) {
                    $disallowed = true;
                    break;
                }
            }

            if ($allowed && !$disallowed) {
                $names[] = (string) $name;
            }
        }

        return $names;
    }

    /**
     * Resolves a named color to its final stop list, applying contrast
     * sorting and `notEqualTo` filtering from the style definition. Detects
     * circular references between colors and throws
     * {@see CircularColorReferenceError}.
     *
     * A user-set `${name}ColorOrder: 'fixed'` pins user-supplied colors to
     * their verbatim order: the shuffle and the contrast sort are skipped
     * (`notEqualTo` filtering still applies), and the gradient stop count
     * defaults to the number of supplied colors instead of 2. A style palette
     * carries no order contract, so with `fixed` it is still deduplicated,
     * code-point sorted, and contrast sorted; only the shuffle is skipped.
     *
     * @return list<string>
     */
    private function resolveColor(string $name): array
    {
        $userColors = $this->options->color($name);
        $styleColors = $this->style->colors();
        $styleColor = $styleColors[$name] ?? null;
        $source = $userColors ?? $styleColor?->values() ?? [];

        $candidates = array_map(fn($c) => ColorUtil::toHex($c), $source);
        $fixed = $this->colorOrder($name) === Options::COLOR_ORDER_FIXED;
        $verbatim = $userColors !== null && $fixed;
        $fill = $this->colorFill($name);
        $stops = $fill === 'solid' ? 1 : $this->colorFillStops($name, $verbatim ? count($candidates) : 2);

        if ($styleColor === null) {
            return array_slice($this->order($name, $candidates, $fixed, $verbatim), 0, $stops);
        }

        // Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a)
        if (in_array($name, $this->colorResolving, true)) {
            throw new CircularColorReferenceError(array_merge($this->colorResolving, [$name]));
        }

        $this->colorResolving[] = $name;
        $contrastTo = $styleColor->contrastTo();
        $notEqualTo = $styleColor->notEqualTo();

        try {
            if ($contrastTo !== null && !$verbatim) {
                $refColor = $this->color($contrastTo)[0] ?? null;

                if ($refColor !== null) {
                    $candidates = ColorUtil::sortByContrast($candidates, $refColor);
                }
            }

            if (count($notEqualTo) > 0) {
                $excluded = [];

                foreach ($notEqualTo as $ref) {
                    foreach ($this->color($ref) as $color) {
                        $excluded[] = $color;
                    }
                }

                $candidates = ColorUtil::filterNotEqualTo($candidates, $excluded);
            }
        } finally {
            array_pop($this->colorResolving);
        }

        // Skip shuffle when sorted by contrast to preserve the ordering
        $ordered = $contrastTo !== null
            ? $candidates
            : $this->order($name, $candidates, $fixed, $verbatim);

        return array_slice($ordered, 0, $stops);
    }

    /**
     * Applies `${name}ColorOrder` to the candidate list. `random` shuffles via
     * the PRNG. `fixed` skips the shuffle: user-supplied colors (`$verbatim`)
     * keep exactly the given order, while a style palette is still
     * deduplicated and sorted by UTF-16 code units, matching the
     * canonicalization the shuffle applies before drawing.
     *
     * @param list<string> $candidates
     *
     * @return list<string>
     */
    private function order(string $name, array $candidates, bool $fixed, bool $verbatim): array
    {
        if (!$fixed) {
            return $this->prng->shuffle("{$name}Color", $candidates);
        }

        if ($verbatim) {
            return $candidates;
        }

        // Hex colors are ASCII, so a byte sort equals the UTF-16 code unit
        // sort the JS reference applies.
        // Deprecated: DiceBear 11 will take the palette in its definition
        // order here, the same verbatim rule as user-supplied colors, and
        // drop this sort (see CHANGELOG.md, "Deprecated").
        $unique = array_values(array_unique($candidates));
        sort($unique, SORT_STRING);

        return $unique;
    }

    private function colorFillStops(string $name, int $fallback): int
    {
        $range = $this->options->colorFillStops($name);

        return $range === null ? $fallback : $this->prng->integer("{$name}ColorFillStops", $range);
    }

    /** @param array{min: int|float, max: int|float, step?: int|float}|null $range */
    private function memoFloat(string $key, ?array $range, float $fallback): float
    {
        return $this->memo($key, fn() => $range === null ? $fallback : $this->prng->float($key, $range));
    }

    private function memo(string $key, callable $compute): mixed
    {
        if (array_key_exists($key, $this->result)) {
            return $this->result[$key];
        }

        $value = $compute();
        $this->result[$key] = $value;

        return $value;
    }
}
