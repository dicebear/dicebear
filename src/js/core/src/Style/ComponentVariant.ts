import type { StyleDefinitionComponentVariant } from '../StyleDefinition.js';
import { Element } from './Element.js';

/**
 * Read-only view over an entry in a component's `variants` block.
 */
export class ComponentVariant {
  #data: StyleDefinitionComponentVariant;
  #elements?: readonly Element[];

  constructor(data: StyleDefinitionComponentVariant) {
    this.#data = data;
  }

  /**
   * Returns the variant's elements, lazily wrapped as {@link Element}
   * instances on first access.
   */
  elements(): readonly Element[] {
    this.#elements ??= this.#data.elements.map((el) => new Element(el));

    return this.#elements;
  }

  /**
   * Returns the weighted-pick weight for this variant, defaulting to `1`.
   */
  weight(): number {
    return this.#data.weight ?? 1;
  }

  /**
   * Returns the variant's descriptive tags (e.g. `hairLength:long`), or an
   * empty list when none are authored. Consumed by the `tags` render option
   * to filter the variant pool.
   */
  tags(): readonly string[] {
    return this.#data.tags ?? [];
  }

  /**
   * Tests this variant against a single tag-filter token's grammar. With no
   * `value`, it matches a whole category: the bare `category` tag or any
   * `category:value` tag. With a `value`, it matches only the exact
   * `category:value` tag. The resolver composes these checks into the
   * include/exclude filter structure.
   */
  hasTag(category: string, value?: string): boolean {
    if (value === undefined) {
      return this.tags().some(
        (tag) => tag === category || tag.startsWith(`${category}:`),
      );
    }

    return this.tags().includes(`${category}:${value}`);
  }
}
