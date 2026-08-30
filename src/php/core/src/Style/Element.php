<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over a single render-tree element from a style definition.
 *
 * The same node type covers SVG elements, text, and component references —
 * `type()` discriminates between them.
 */
class Element
{
    /** @var list<Element>|null */
    private ?array $children = null;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /**
     * Returns the element type discriminator (`svg`, `text`, `component`, …).
     */
    public function type(): string
    {
        return $this->data['type'];
    }

    /**
     * Returns the element's tag/component name, or `null` for elements that
     * don't have one.
     */
    public function name(): ?string
    {
        return $this->data['name'] ?? null;
    }

    /**
     * Returns the element's textual value (for `text` elements) or template
     * fragment, or `null` when not applicable.
     *
     * @return string|array<string, mixed>|null
     */
    public function value(): string|array|null
    {
        return $this->data['value'] ?? null;
    }

    /**
     * Returns the element's raw attribute map, or `null` when no attributes
     * are defined.
     *
     * @return array<string, mixed>|null
     */
    public function attributes(): ?array
    {
        return $this->data['attributes'] ?? null;
    }

    /**
     * Returns the element's declarative animation timelines. Empty for
     * elements without animations.
     *
     * @return list<array<string, mixed>>
     */
    public function animations(): array
    {
        return $this->data['animations'] ?? [];
    }

    /**
     * Returns the element's children, lazily wrapped as {@see Element}
     * instances on first access.
     *
     * @return list<Element>
     */
    public function children(): array
    {
        return $this->children ??= array_map(
            fn(array $child) => new Element($child),
            $this->data['children'] ?? [],
        );
    }
}
