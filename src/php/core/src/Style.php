<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Error\StyleValidationError;
use DiceBear\Style\Canvas;
use DiceBear\Style\Color;
use DiceBear\Style\Component;
use DiceBear\Style\Meta;
use DiceBear\Validator\StyleValidator;

/**
 * Validated, lazily-decomposed wrapper around a style definition. Construction
 * runs the JSON Schema validator and stores a deep copy of the input so that
 * later mutation of the source object cannot leak into the rendered avatar.
 */
class Style
{
    /** @var array<string, mixed> */
    private array $data;
    private ?Meta $meta = null;
    private ?Canvas $canvas = null;
    /** @var array<string, Component>|null */
    private ?array $components = null;
    /** @var array<string, Color>|null */
    private ?array $colors = null;
    private ?bool $hasAnimations = null;
    /** @var list<string>|null */
    private ?array $animationNames = null;

    public function __construct(mixed $data)
    {
        StyleValidator::validate($data);

        $this->data = is_array($data) ? $data : json_decode(json_encode($data), true);

        $this->validateAliases();
        $this->validateAnimations();
    }

    /**
     * Parses and validates a style definition from its raw JSON string.
     *
     * The string counterpart to the constructor, for the common case where the
     * definition is raw JSON, such as a file shipped by the `dicebear/styles`
     * package. Throws a {@see \JsonException} when $json is not valid JSON, and
     * a {@see StyleValidationError} when the decoded value is not a valid style
     * definition. Pass an already-decoded array to the constructor instead.
     */
    public static function fromJson(string $json): self
    {
        return new self(json_decode($json, true, flags: JSON_THROW_ON_ERROR));
    }

    /**
     * Returns the definition's `$id`, or `null` when not set.
     */
    public function id(): ?string
    {
        return $this->data['$id'] ?? null;
    }

    /**
     * Returns the definition's `$schema` URI, or `null` when not set.
     */
    public function schema(): ?string
    {
        return $this->data['$schema'] ?? null;
    }

    /**
     * Returns the definition's `$comment`, or `null` when not set.
     */
    public function comment(): ?string
    {
        return $this->data['$comment'] ?? null;
    }

    /**
     * Returns the {@see Meta} view, lazily constructed on first access.
     */
    public function meta(): Meta
    {
        return $this->meta ??= new Meta($this->data['meta'] ?? []);
    }

    /**
     * Returns the root SVG attributes from the definition, defaulting to an
     * empty array.
     *
     * @return array<string, mixed>
     */
    public function attributes(): array
    {
        return $this->data['attributes'] ?? [];
    }

    /**
     * Returns the {@see Canvas} view, lazily constructed on first access.
     */
    public function canvas(): Canvas
    {
        return $this->canvas ??= new Canvas($this->data['canvas']);
    }

    /**
     * Returns a name → {@see Component} map for all defined components, built
     * lazily on first access.
     *
     * @return array<string, Component>
     */
    public function components(): array
    {
        if ($this->components !== null) {
            return $this->components;
        }

        $entries = $this->data['components'] ?? [];
        $this->components = [];

        foreach ($entries as $name => $data) {
            if (!self::isAlias($data)) {
                $this->components[$name] = new Component($name, $data);
            }
        }

        foreach ($entries as $name => $data) {
            if (self::isAlias($data)) {
                $this->components[$name] = new Component(
                    $name,
                    $data,
                    $this->components[$data['extends']] ?? null,
                );
            }
        }

        return $this->components;
    }

    /**
     * Verifies that every component declared via `extends` references an
     * existing, non-alias component in the same `components` map. The schema
     * itself cannot enforce cross-references between sibling keys.
     */
    private function validateAliases(): void
    {
        $components = $this->data['components'] ?? null;

        if ($components === null) {
            return;
        }

        $errors = [];

        foreach ($components as $name => $data) {
            if (!self::isAlias($data)) {
                continue;
            }

            $target = $data['extends'];
            $targetData = $components[$target] ?? null;

            if ($targetData === null) {
                $errors[] = [
                    'instancePath' => "/components/{$name}/extends",
                    'message' => "references unknown component \"{$target}\"",
                ];

                continue;
            }

            if (self::isAlias($targetData)) {
                $errors[] = [
                    'instancePath' => "/components/{$name}/extends",
                    'message' => "references alias \"{$target}\" — alias chains are not allowed",
                ];
            }
        }

        if (count($errors) > 0) {
            throw new StyleValidationError($errors);
        }
    }

    /**
     * @param array<string, mixed> $data
     */
    private static function isAlias(array $data): bool
    {
        return array_key_exists('extends', $data);
    }

    /**
     * Verifies that every animation track lists its keyframes in strictly
     * ascending `at` order. The schema cannot express ordering between array
     * items. Step jumps are expressed with the `hold` easing rather than
     * duplicate positions.
     */
    private function validateAnimations(): void
    {
        $errors = [];

        $this->visitElements(function (array $element, string $path) use (&$errors): void {
            foreach ($element['animations'] ?? [] as $animationIndex => $animation) {
                foreach ($animation['tracks'] as $trackName => $track) {
                    $keyframes = $track['keyframes'];
                    $count = count($keyframes);

                    for ($i = 1; $i < $count; $i++) {
                        if ($keyframes[$i]['at'] <= $keyframes[$i - 1]['at']) {
                            $errors[] = [
                                'instancePath' => "{$path}/animations/{$animationIndex}/tracks/{$trackName}/keyframes/{$i}/at",
                                'message' => 'must be greater than the previous keyframe',
                            ];
                        }
                    }
                }
            }
        });

        if (count($errors) > 0) {
            throw new StyleValidationError($errors);
        }
    }

    /**
     * Walks every element in the definition — the canvas tree and every
     * component variant tree — and invokes `$visit` with the element and its
     * JSON pointer path.
     *
     * @param callable(array<string, mixed>, string): void $visit
     */
    private function visitElements(callable $visit): void
    {
        $walk = function (array $elements, string $path) use (&$walk, $visit): void {
            foreach ($elements as $index => $element) {
                $elementPath = "{$path}/{$index}";

                $visit($element, $elementPath);

                if (isset($element['children'])) {
                    $walk($element['children'], "{$elementPath}/children");
                }
            }
        };

        $walk($this->data['canvas']['elements'], '/canvas/elements');

        foreach ($this->data['components'] ?? [] as $name => $component) {
            if (self::isAlias($component)) {
                continue;
            }

            foreach ($component['variants'] as $variantName => $variant) {
                $walk($variant['elements'], "/components/{$name}/variants/{$variantName}/elements");
            }
        }
    }

    /**
     * Returns whether any element in the definition carries declarative
     * animations. Computed once and cached. Consumed by the options
     * descriptor to advertise the `animation` options only where they have an
     * effect.
     */
    public function hasAnimations(): bool
    {
        if ($this->hasAnimations === null) {
            $found = false;

            $this->visitElements(function (array $element) use (&$found): void {
                if (count($element['animations'] ?? []) > 0) {
                    $found = true;
                }
            });

            $this->hasAnimations = $found;
        }

        return $this->hasAnimations;
    }

    /**
     * Returns the sorted distinct names of the definition's animation
     * timelines. Computed once and cached. Consumed by the options descriptor
     * so tooling can offer the by-name form of the `animation` option. Sorted
     * so every port reports the same order regardless of how it walks the
     * definition.
     *
     * @return list<string>
     */
    public function animationNames(): array
    {
        if ($this->animationNames === null) {
            $names = [];

            $this->visitElements(function (array $element) use (&$names): void {
                foreach ($element['animations'] ?? [] as $animation) {
                    $name = $animation['name'] ?? null;

                    if ($name !== null && !in_array($name, $names, true)) {
                        $names[] = $name;
                    }
                }
            });

            sort($names, SORT_STRING);

            $this->animationNames = $names;
        }

        return $this->animationNames;
    }

    /**
     * Returns a name → {@see Color} map for all defined colors, built lazily
     * on first access.
     *
     * @return array<string, Color>
     */
    public function colors(): array
    {
        if ($this->colors === null) {
            $this->colors = [];

            foreach ($this->data['colors'] ?? [] as $name => $data) {
                $this->colors[$name] = new Color($data);
            }
        }

        return $this->colors;
    }
}
