/**
 * Mutable mirrors of the style definition shapes from `@dicebear/core`.
 *
 * The core exports `StyleDefinition` as a deeply `readonly` type, which is
 * right for a validated style but unusable for a tool that rewrites element
 * trees in place. These local aliases describe the same JSON with writable
 * members, and only cover what the optimizer touches.
 */

export interface DefinitionColorReference {
  type: 'color';
  name: string;
}

export interface DefinitionVariableReference {
  type: 'variable';
  name: string;
}

export type DefinitionAttributeValue =
  string | DefinitionColorReference | DefinitionVariableReference;

export type DefinitionElementValue = string | DefinitionVariableReference;

export interface DefinitionElement {
  type: 'element' | 'text' | 'component';
  name?: string;
  value?: DefinitionElementValue;
  attributes?: Record<string, DefinitionAttributeValue>;
  children?: DefinitionElement[];
}

export interface DefinitionComponentVariant {
  elements: DefinitionElement[];
}

export interface DefinitionComponent {
  width?: number;
  height?: number;
  variants?: Record<string, DefinitionComponentVariant>;
}

export interface DefinitionCanvas {
  width: number;
  height: number;
  elements: DefinitionElement[];
}

export interface Definition {
  canvas: DefinitionCanvas;
  components?: Record<string, DefinitionComponent>;
  [key: string]: unknown;
}

/**
 * A single tree the optimizer works on, together with the dimensions of the box
 * it is drawn in. Definitions hold element trees in exactly two places: the
 * canvas, and every variant of every component.
 */
export interface OptimizationUnit {
  /** Human-readable location, used in error messages. */
  label: string;
  /** The object holding the tree; assign to `owner.elements` to write back. */
  owner: { elements: DefinitionElement[] };
  width: number;
  height: number;
}

/**
 * Collects every element tree in the definition. Alias components
 * (`{"extends": "other"}`) carry no elements of their own and are skipped.
 */
export function collectUnits(definition: Definition): OptimizationUnit[] {
  const units: OptimizationUnit[] = [
    {
      label: 'canvas',
      owner: definition.canvas,
      width: definition.canvas.width,
      height: definition.canvas.height,
    },
  ];

  for (const [componentName, component] of Object.entries(
    definition.components ?? {},
  )) {
    if (!component.variants) {
      continue;
    }

    for (const [variantName, variant] of Object.entries(component.variants)) {
      units.push({
        label: `components.${componentName}.variants.${variantName}`,
        owner: variant,
        // The schema requires width and height on any component that declares
        // variants; only alias components (skipped above) may omit them.
        width: component.width as number,
        height: component.height as number,
      });
    }
  }

  return units;
}

/**
 * Walks an element tree, visiting every node including the roots.
 */
export function walkElements(
  elements: readonly DefinitionElement[],
  visit: (element: DefinitionElement) => void,
): void {
  for (const element of elements) {
    visit(element);

    if (element.children) {
      walkElements(element.children, visit);
    }
  }
}
