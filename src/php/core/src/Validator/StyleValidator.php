<?php

declare(strict_types=1);

namespace DiceBear\Validator;

use DiceBear\Error\StyleValidationError;

/**
 * Validates style definitions. Runs {@see StyleSchemaValidator} first, then
 * the checks the schema cannot express: alias targets, component cycles and
 * keyframe order.
 *
 * @internal
 */
class StyleValidator
{
    /**
     * Validates the given style definition.
     *
     * Throws a {@see StyleValidationError} on failure.
     */
    public static function validate(mixed $data): void
    {
        StyleSchemaValidator::validate($data);

        /** @var array<string, mixed> $definition */
        $definition = is_array($data) ? $data : json_decode(json_encode($data), true);

        self::validateAliases($definition);
        self::validateComponentCycles($definition);
        self::validateAnimations($definition);
    }

    /**
     * Verifies that every component declared via `extends` references an
     * existing, non-alias component in the same `components` map. The schema
     * itself cannot enforce cross-references between sibling keys.
     *
     * @param array<string, mixed> $definition
     */
    private static function validateAliases(array $definition): void
    {
        $components = $definition['components'] ?? null;

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
     * Verifies that no component renders itself, directly or through other
     * components. The renderer registers a variant's `<defs>` entry only after
     * its body has rendered, so a cycle would recurse until the stack runs out.
     * A reference to an alias counts as a reference to its source, since the
     * alias renders the source's variants. Unknown names render nothing and
     * close no cycle. Runs after {@see validateAliases()}, so every alias
     * points at a base component here.
     *
     * @param array<string, mixed> $definition
     */
    private static function validateComponentCycles(array $definition): void
    {
        $components = $definition['components'] ?? null;

        if ($components === null) {
            return;
        }

        /** @var array<string, list<array{name: string, source: string, path: string}>> $references */
        $references = [];

        foreach ($components as $name => $data) {
            if (self::isAlias($data)) {
                continue;
            }

            $found = [];
            $walk = function (array $elements, string $path) use (&$walk, &$found, $components): void {
                foreach ($elements as $index => $element) {
                    $elementPath = "{$path}/{$index}";
                    $referenced = $element['name'] ?? null;

                    if (($element['type'] ?? null) === 'component' && is_string($referenced)) {
                        $target = $components[$referenced] ?? null;

                        if ($target !== null) {
                            $found[] = [
                                'name' => $referenced,
                                'source' => self::isAlias($target) ? $target['extends'] : $referenced,
                                'path' => $elementPath,
                            ];
                        }
                    }

                    if (isset($element['children'])) {
                        $walk($element['children'], "{$elementPath}/children");
                    }
                }
            };

            foreach ($data['variants'] as $variantName => $variant) {
                $walk($variant['elements'], "/components/{$name}/variants/{$variantName}/elements");
            }

            $references[(string) $name] = $found;
        }

        // Depth-first search: a reference to a component that is still on the
        // stack closes a cycle. The depth is bounded by the number of components.
        $onStack = [];
        $done = [];
        $errors = [];

        $visit = function (string $name) use (&$visit, &$onStack, &$done, &$errors, $references): void {
            $onStack[$name] = true;

            foreach ($references[$name] ?? [] as $reference) {
                if (isset($onStack[$reference['source']])) {
                    $errors[] = [
                        'instancePath' => $reference['path'],
                        'message' => "references component \"{$reference['name']}\", which leads back to \"{$reference['source']}\" — component cycles are not allowed",
                    ];
                } elseif (!isset($done[$reference['source']])) {
                    $visit($reference['source']);
                }
            }

            unset($onStack[$name]);
            $done[$name] = true;
        };

        foreach (array_keys($references) as $name) {
            if (!isset($done[$name])) {
                $visit((string) $name);
            }
        }

        if (count($errors) > 0) {
            throw new StyleValidationError($errors);
        }
    }

    /**
     * Verifies that every animation track lists its keyframes in strictly
     * ascending `at` order. The schema cannot express ordering between array
     * items. Step jumps are expressed with the `hold` easing rather than
     * duplicate positions.
     *
     * @param array<string, mixed> $definition
     */
    private static function validateAnimations(array $definition): void
    {
        $errors = [];

        self::visitElements($definition, function (array $element, string $path) use (&$errors): void {
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
     * @param array<string, mixed> $definition
     * @param callable(array<string, mixed>, string): void $visit
     */
    private static function visitElements(array $definition, callable $visit): void
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

        $walk($definition['canvas']['elements'], '/canvas/elements');

        foreach ($definition['components'] ?? [] as $name => $component) {
            if (self::isAlias($component)) {
                continue;
            }

            foreach ($component['variants'] as $variantName => $variant) {
                $walk($variant['elements'], "/components/{$name}/variants/{$variantName}/elements");
            }
        }
    }

    /**
     * @param array<string, mixed> $data
     */
    private static function isAlias(array $data): bool
    {
        return array_key_exists('extends', $data);
    }
}
