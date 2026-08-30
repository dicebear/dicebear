import type {
  StyleDefinitionElement,
  StyleDefinitionElementValue,
  StyleDefinitionElementType,
  StyleDefinitionAttributes,
  StyleDefinitionAnimation,
} from '../StyleDefinition.js';

/**
 * Read-only view over a single render-tree element from a style definition.
 *
 * The same node type covers SVG elements, text, and component references —
 * `type()` discriminates between them.
 */
export class Element {
  #data: StyleDefinitionElement;
  #children?: readonly Element[];

  constructor(data: StyleDefinitionElement) {
    this.#data = data;
  }

  /**
   * Returns the element type discriminator (`svg`, `text`, `component`, …).
   */
  type(): StyleDefinitionElementType {
    return this.#data.type;
  }

  /**
   * Returns the element's tag/component name, or `undefined` for elements
   * that don't have one.
   */
  name(): string | undefined {
    return this.#data.name;
  }

  /**
   * Returns the element's textual value (for `text` elements) or template
   * fragment, or `undefined` when not applicable.
   */
  value(): StyleDefinitionElementValue | undefined {
    return this.#data.value;
  }

  /**
   * Returns the element's raw attribute map, or `undefined` when no
   * attributes are defined.
   */
  attributes(): StyleDefinitionAttributes | undefined {
    return this.#data.attributes;
  }

  /**
   * Returns the element's declarative animation timelines. Empty for
   * elements without animations.
   */
  animations(): readonly StyleDefinitionAnimation[] {
    return this.#data.animations ?? [];
  }

  /**
   * Returns the element's children, lazily wrapped as {@link Element}
   * instances on first access.
   */
  children(): readonly Element[] {
    this.#children ??= (this.#data.children ?? []).map(
      (child) => new Element(child),
    );

    return this.#children;
  }
}
