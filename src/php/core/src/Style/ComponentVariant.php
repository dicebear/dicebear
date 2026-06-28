<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over an entry in a component's `variants` block.
 */
class ComponentVariant
{
    /** @var list<Element>|null */
    private ?array $elements = null;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /**
     * Returns the variant's elements, lazily wrapped as {@see Element}
     * instances on first access.
     *
     * @return list<Element>
     */
    public function elements(): array
    {
        return $this->elements ??= array_map(
            fn(array $el) => new Element($el),
            $this->data['elements'],
        );
    }

    /**
     * Returns the weighted-pick weight for this variant, defaulting to `1`.
     */
    public function weight(): int|float
    {
        return $this->data['weight'] ?? 1;
    }

    /**
     * Returns the variant's descriptive tags (e.g. `hairLength:long`), or an
     * empty list when none are authored. Consumed by the `tags` render option
     * to filter the variant pool.
     *
     * @return list<string>
     */
    public function tags(): array
    {
        return $this->data['tags'] ?? [];
    }

    /**
     * Tests this variant against a single tag-filter token's grammar. With no
     * `$value`, it matches a whole category: the bare `category` tag or any
     * `category:value` tag. With a `$value`, it matches only the exact
     * `category:value` tag. The resolver composes these checks into the
     * allow/disallow filter structure.
     */
    public function hasTag(string $category, ?string $value = null): bool
    {
        if ($value === null) {
            foreach ($this->tags() as $tag) {
                if ($tag === $category || str_starts_with($tag, "{$category}:")) {
                    return true;
                }
            }

            return false;
        }

        return in_array("{$category}:{$value}", $this->tags(), true);
    }
}
