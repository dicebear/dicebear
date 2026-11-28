import { StyleValidationError } from '../Error/StyleValidationError.js';
import type {
  StyleDefinition,
  StyleDefinitionComponent,
  StyleDefinitionElement,
} from '../StyleDefinition.js';
import { Depth } from '../Utils/Depth.js';
import { StyleSchemaValidator } from './StyleSchemaValidator.js';

/**
 * Validates a style definition: the nesting depth, the `definition.json`
 * schema, and what the schema cannot express, namely that every alias points
 * at a base component, that no component renders itself and that keyframes
 * are listed in order. Throws a {@link StyleValidationError} on the first
 * check that fails.
 *
 * The package root runs it before a {@link Style} is built. The lite entry
 * skips it, as it skips every validator.
 */
export class StyleValidator {
  static validate(data: unknown): void {
    if (Depth.exceeds(data)) {
      throw new StyleValidationError([{ message: Depth.MESSAGE }]);
    }

    StyleSchemaValidator.validate(data);

    const definition = data as StyleDefinition;

    StyleValidator.#validateAliases(definition);
    StyleValidator.#validateComponentCycles(definition);
    StyleValidator.#validateAnimations(definition);
  }

  /**
   * Verifies that every component declared via `extends` references an
   * existing, non-alias component in the same `components` map. The schema
   * itself cannot enforce cross-references between sibling keys.
   */
  static #validateAliases(definition: StyleDefinition): void {
    const components = definition.components;

    if (!components) {
      return;
    }

    const errors: { instancePath: string; message: string }[] = [];

    for (const [name, data] of Object.entries(components)) {
      if (!StyleValidator.#isAlias(data)) {
        continue;
      }

      const target = data.extends;

      // Own keys only: a plain lookup would find "constructor" or "toString"
      // on Object.prototype and take them for base components.
      const targetData = Object.prototype.hasOwnProperty.call(
        components,
        target,
      )
        ? components[target]
        : undefined;

      if (!targetData) {
        errors.push({
          instancePath: `/components/${name}/extends`,
          message: `references unknown component "${target}"`,
        });

        continue;
      }

      if (StyleValidator.#isAlias(targetData)) {
        errors.push({
          instancePath: `/components/${name}/extends`,
          message: `references alias "${target}" — alias chains are not allowed`,
        });
      }
    }

    if (errors.length > 0) {
      throw new StyleValidationError(errors);
    }
  }

  /**
   * Verifies that no component renders itself, directly or through other
   * components. The renderer registers a variant's `<defs>` entry only after
   * its body has rendered, so a cycle would recurse until the stack runs out.
   * A reference to an alias counts as a reference to its source, since the
   * alias renders the source's variants. Unknown names render nothing and
   * close no cycle. Runs after {@link #validateAliases}, so every alias points
   * at a base component here.
   */
  static #validateComponentCycles(definition: StyleDefinition): void {
    const components = definition.components;

    if (!components) {
      return;
    }

    type Reference = { name: string; source: string; path: string };

    const references = new Map<string, Reference[]>();

    for (const [name, data] of Object.entries(components)) {
      if (StyleValidator.#isAlias(data)) {
        continue;
      }

      const found: Reference[] = [];
      const walk = (
        elements: readonly StyleDefinitionElement[],
        path: string,
      ): void => {
        elements.forEach((element, index) => {
          const elementPath = `${path}/${index}`;
          const referenced = element.name;

          if (element.type === 'component' && referenced !== undefined) {
            const target = Object.prototype.hasOwnProperty.call(
              components,
              referenced,
            )
              ? components[referenced]
              : undefined;

            if (target) {
              found.push({
                name: referenced,
                source: StyleValidator.#isAlias(target)
                  ? target.extends
                  : referenced,
                path: elementPath,
              });
            }
          }

          if (element.children) {
            walk(element.children, `${elementPath}/children`);
          }
        });
      };

      for (const [variantName, variant] of Object.entries(data.variants)) {
        walk(
          variant.elements,
          `/components/${name}/variants/${variantName}/elements`,
        );
      }

      references.set(name, found);
    }

    // Depth-first search: a reference to a component that is still on the
    // stack closes a cycle. The depth is bounded by the number of components.
    const onStack = new Set<string>();
    const done = new Set<string>();
    const errors: { instancePath: string; message: string }[] = [];

    const visit = (name: string): void => {
      onStack.add(name);

      for (const reference of references.get(name) ?? []) {
        if (onStack.has(reference.source)) {
          errors.push({
            instancePath: reference.path,
            message: `references component "${reference.name}", which leads back to "${reference.source}" — component cycles are not allowed`,
          });
        } else if (!done.has(reference.source)) {
          visit(reference.source);
        }
      }

      onStack.delete(name);
      done.add(name);
    };

    for (const name of references.keys()) {
      if (!done.has(name)) {
        visit(name);
      }
    }

    if (errors.length > 0) {
      throw new StyleValidationError(errors);
    }
  }

  /**
   * Verifies that every animation track lists its keyframes in strictly
   * ascending `at` order. The schema cannot express ordering between array
   * items. Step jumps are expressed with the `hold` easing rather than
   * duplicate positions.
   */
  static #validateAnimations(definition: StyleDefinition): void {
    const errors: { instancePath: string; message: string }[] = [];

    StyleValidator.#visitElements(definition, (element, path) => {
      element.animations?.forEach((animation, animationIndex) => {
        for (const [trackName, track] of Object.entries(animation.tracks)) {
          const keyframes = track.keyframes;

          for (let i = 1; i < keyframes.length; i++) {
            if (keyframes[i].at <= keyframes[i - 1].at) {
              errors.push({
                instancePath: `${path}/animations/${animationIndex}/tracks/${trackName}/keyframes/${i}/at`,
                message: 'must be greater than the previous keyframe',
              });
            }
          }
        }
      });
    });

    if (errors.length > 0) {
      throw new StyleValidationError(errors);
    }
  }

  /**
   * Walks every element in the definition — the canvas tree and every
   * component variant tree — and invokes `visit` with the element and its
   * JSON pointer path.
   */
  static #visitElements(
    definition: StyleDefinition,
    visit: (element: StyleDefinitionElement, path: string) => void,
  ): void {
    const walk = (
      elements: readonly StyleDefinitionElement[],
      path: string,
    ): void => {
      elements.forEach((element, index) => {
        const elementPath = `${path}/${index}`;

        visit(element, elementPath);

        if (element.children) {
          walk(element.children, `${elementPath}/children`);
        }
      });
    };

    walk(definition.canvas.elements, '/canvas/elements');

    for (const [name, component] of Object.entries(
      definition.components ?? {},
    )) {
      if (StyleValidator.#isAlias(component)) {
        continue;
      }

      for (const [variantName, variant] of Object.entries(component.variants)) {
        walk(
          variant.elements,
          `/components/${name}/variants/${variantName}/elements`,
        );
      }
    }
  }

  static #isAlias(
    data: StyleDefinitionComponent,
  ): data is Extract<StyleDefinitionComponent, { extends: string }> {
    return 'extends' in data;
  }
}
