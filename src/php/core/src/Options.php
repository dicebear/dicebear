<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Validator\OptionsValidator;

/**
 * Validates the raw user-supplied options and exposes them through typed
 * accessors. Each accessor returns the user's input in a normalized form
 * (always a list for options that accept either a scalar or a list, or
 * `null` when the option is not set), so consumers — chiefly
 * {@see Resolver} — never have to do their own normalization.
 *
 * Resolution against the style definition and the PRNG happens in
 * {@see Resolver}; this class is purely about reading user input.
 *
 * @internal
 */
class Options
{
    public const COLOR_ORDER_RANDOM = 'random';
    public const COLOR_ORDER_FIXED = 'fixed';

    /** @var array<string, mixed> */
    private array $data;

    /** @var list<array{category: string, value?: string, negated: bool}>|null */
    private ?array $tags = null;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(array $data = [])
    {
        OptionsValidator::validate($data);

        $this->data = $data;
    }

    public function seed(): ?string
    {
        return $this->data['seed'] ?? null;
    }

    public function size(): ?int
    {
        return $this->data['size'] ?? null;
    }

    public function idRandomization(): ?bool
    {
        return $this->data['idRandomization'] ?? null;
    }

    public function title(): ?string
    {
        return $this->data['title'] ?? null;
    }

    /** @return list<string> */
    public function flip(): array
    {
        return $this->asArray($this->data['flip'] ?? null);
    }

    /** @return list<string> */
    public function fontFamily(): array
    {
        return $this->asArray($this->data['fontFamily'] ?? null);
    }

    /** @return list<int|float> */
    public function fontWeight(): array
    {
        return $this->asArray($this->data['fontWeight'] ?? null);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function scale(): ?array
    {
        return $this->toRange($this->data['scale'] ?? null);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function borderRadius(): ?array
    {
        return $this->toRange($this->data['borderRadius'] ?? null);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function rotate(): ?array
    {
        return $this->toRange($this->data['rotate'] ?? null);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function translateX(): ?array
    {
        return $this->toRange($this->data['translateX'] ?? null);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function translateY(): ?array
    {
        return $this->toRange($this->data['translateY'] ?? null);
    }

    /**
     * Returns the animation switch as given for booleans, and normalizes a
     * single animation name to a one-element list.
     *
     * @return bool|list<string>|null
     */
    public function animation(): bool|array|null
    {
        $raw = $this->data['animation'] ?? null;

        if ($raw === null || is_bool($raw)) {
            return $raw;
        }

        return $this->asArray($raw);
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function animationSpeed(): ?array
    {
        return $this->toRange($this->data['animationSpeed'] ?? null);
    }

    /**
     * Returns the global `tags` filter as parsed tokens, or an empty list when
     * unset. Each raw token (`category` / `category:value`, optionally
     * `!`-prefixed to disallow) is decoded into `['category' => …, 'value' => …,
     * 'negated' => …]` so the resolver composes the filter without parsing the
     * grammar itself. An empty list means no tag filtering (classic behavior).
     * Memoized, since the resolver reads it once per component.
     *
     * @return list<array{category: string, value?: string, negated: bool}>
     */
    public function tags(): array
    {
        return $this->tags ??= array_map(static function (string $token): array {
            $negated = str_starts_with($token, '!');
            $body = $negated ? substr($token, 1) : $token;
            $sep = strpos($body, ':');

            if ($sep === false) {
                return ['category' => $body, 'negated' => $negated];
            }

            return [
                'category' => substr($body, 0, $sep),
                'value' => substr($body, $sep + 1),
                'negated' => $negated,
            ];
        }, $this->asArray($this->data['tags'] ?? null));
    }

    /**
     * Returns the user-set variant constraint for `$name` as a weighted map,
     * or `null` when `${name}Variant` is unset. A bare string or string list
     * is normalized to a map with each entry weighted `1`.
     *
     * @return array<string, int|float>|null
     */
    public function componentVariant(string $name): ?array
    {
        $raw = $this->dynamic($name . 'Variant');

        if ($raw === null) {
            return null;
        }

        if (is_string($raw)) {
            return [$raw => 1];
        }

        if (is_array($raw) && array_is_list($raw)) {
            /** @var array<string, int|float> */
            return array_fill_keys($raw, 1);
        }

        /** @var array<string, int|float> */
        return $raw;
    }

    public function componentProbability(string $name): int|float|null
    {
        return $this->dynamic($name . 'Probability');
    }

    /**
     * Asymmetric on purpose: returns `null` (rather than `[]`) when
     * `${name}Color` is unset so the resolver can fall back to the style
     * definition's color values.
     *
     * @return list<string>|null
     */
    public function color(string $name): ?array
    {
        $raw = $this->dynamic($name . 'Color');

        return $raw === null ? null : $this->asArray($raw);
    }

    /** @return list<string> */
    public function colorFill(string $name): array
    {
        return $this->asArray($this->dynamic($name . 'ColorFill'));
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function colorAngle(string $name): ?array
    {
        return $this->toRange($this->dynamic($name . 'ColorAngle'));
    }

    /** @return array{min: int|float, max: int|float}|null */
    public function colorFillStops(string $name): ?array
    {
        return $this->toRange($this->dynamic($name . 'ColorFillStops'));
    }

    public function colorOrder(string $name): ?string
    {
        return $this->dynamic($name . 'ColorOrder');
    }

    /**
     * Returns the raw value of a dynamic-key option (e.g. `${name}Color`)
     * untouched. Used for keys that vary by component or color name.
     */
    private function dynamic(string $key): mixed
    {
        return $this->data[$key] ?? null;
    }

    /** @return list<mixed> */
    private function asArray(mixed $value): array
    {
        if ($value === null) {
            return [];
        }

        return is_array($value) ? $value : [$value];
    }

    /**
     * Normalizes a user-facing range option (bare number, `[n]`, `[min, max]`,
     * or `null`) into the internal range struct. A bare number `n` — or a
     * single-element array `[n]` — becomes `['min' => n, 'max' => n]` (a fixed
     * value). An array's smaller/larger element is taken as min/max. An empty
     * array is treated as unset so the resolver applies the option's default.
     *
     * @return array{min: int|float, max: int|float}|null
     */
    private function toRange(mixed $value): ?array
    {
        if ($value === null) {
            return null;
        }

        if (is_int($value) || is_float($value)) {
            return ['min' => $value, 'max' => $value];
        }

        if (is_array($value) && array_is_list($value) && count($value) > 0) {
            return ['min' => min($value), 'max' => max($value)];
        }

        return null;
    }
}
