import { Style, type StyleOptions } from '@dicebear/core/lite';
import type { Style as ValidatedStyle } from '@dicebear/core';

import { sweep, type SweepCase } from './sweep.js';
import type { CompareOptions, SweepResult } from './types.js';

/**
 * The seed sweep: `seed-1` to `seed-N` with default options on both sides.
 * This is what a user gets, so it catches every change that shows up in
 * practice, including a shifted PRNG draw after a component was added.
 */
export function seedCases(
  before: ValidatedStyle,
  after: ValidatedStyle,
  count: number,
): SweepCase[] {
  return Array.from({ length: count }, (_, i) => ({
    name: `seed-${i + 1}`,
    before,
    after,
    options: { seed: `seed-${i + 1}` },
  }));
}

/**
 * The names of the base components both sides define. Aliases resolve to
 * their source, so pinning the source covers every `<use>` of the alias.
 */
function commonBaseComponents(
  before: ValidatedStyle,
  after: ValidatedStyle,
): string[] {
  return Array.from(before.components().keys())
    .filter((name) => {
      const a = before.components().get(name);
      const b = after.components().get(name);

      return a && b && !a.extendsName() && !b.extendsName();
    })
    .sort();
}

function commonVariants(
  before: ValidatedStyle,
  after: ValidatedStyle,
  component: string,
): string[] {
  const a = before.components().get(component)!.variants();
  const b = after.components().get(component)!.variants();

  return Array.from(a.keys())
    .filter((name) => b.has(name))
    .sort();
}

/**
 * The base components a component's variants reference, on either side,
 * with aliases resolved to their source.
 */
function referencedComponents(
  before: ValidatedStyle,
  after: ValidatedStyle,
  component: string,
): Set<string> {
  const result = new Set<string>();

  for (const style of [before, after]) {
    const definition = style.definition();
    const entry = definition.components?.[component];

    if (!entry || 'extends' in entry) {
      continue;
    }

    const visit = (
      elements: readonly {
        type: string;
        name?: string;
        children?: readonly unknown[];
      }[],
    ) => {
      for (const element of elements) {
        if (element.type === 'component' && element.name) {
          const source = style.components().get(element.name)?.sourceName();

          if (source && source !== component) {
            result.add(source);
          }
        }

        if (element.children) {
          visit(element.children as typeof elements);
        }
      }
    };

    for (const variant of Object.values(entry.variants)) {
      visit(variant.elements);
    }
  }

  return result;
}

/**
 * Orders the components so that every component comes after the ones it
 * references. A cycle falls back to the alphabetical order.
 */
function dependencyOrder(
  components: string[],
  references: Map<string, Set<string>>,
): string[] {
  const order: string[] = [];
  const done = new Set<string>();
  const visiting = new Set<string>();

  const visit = (name: string) => {
    if (done.has(name) || visiting.has(name)) {
      return;
    }

    visiting.add(name);

    for (const child of Array.from(references.get(name) ?? []).sort()) {
      if (components.includes(child)) {
        visit(child);
      }
    }

    visiting.delete(name);
    done.add(name);
    order.push(name);
  };

  for (const name of components) {
    visit(name);
  }

  return order;
}

/**
 * Picks one hex value that both palettes contain, falling back to the first
 * value of the "after" side. Pinning colors to one explicit value keeps a
 * palette change out of the variant sweep; the palette diff reports it.
 */
function pinnedColor(
  before: ValidatedStyle,
  after: ValidatedStyle,
  name: string,
): string | undefined {
  const a = before.colors().get(name)?.values() ?? [];
  const b = after.colors().get(name)?.values() ?? [];

  return a.find((value) => b.includes(value)) ?? b[0] ?? a[0];
}

/**
 * Wraps a definition so that its canvas shows one component and nothing
 * else. Many components are only reached from inside another component's
 * variant, so hiding the rest of the avatar would hide them too. A canvas of
 * the component's own size makes the sweep independent of where the style
 * places it.
 */
function isolatedStyle(style: ValidatedStyle, component: string): Style {
  const definition = style.definition();
  const source = style.components().get(component)!;

  return new Style({
    ...definition,
    canvas: {
      width: source.width(),
      height: source.height(),
      elements: [{ type: 'component', name: component }],
    },
  });
}

/**
 * The variant sweep: every variant that exists on both sides, rendered on
 * its own with every other component and color pinned, so the variant's own
 * change is the only thing that can differ between the two renders.
 *
 * Components a variant references still render. The sweep therefore walks
 * the components children first and pins each child to a variant its own
 * sweep found identical, so a changed child does not show up again in every
 * parent that uses it. Only when every common variant of a child changed
 * does the parent carry the difference too.
 */
export async function sweepVariants(
  styleName: string,
  before: ValidatedStyle,
  after: ValidatedStyle,
  options: CompareOptions,
): Promise<SweepResult> {
  const components = commonBaseComponents(before, after);
  const references = new Map(
    components.map((name) => [name, referencedComponents(before, after, name)]),
  );
  const pinned: Record<string, unknown> = { seed: 'compare' };

  for (const component of components) {
    const [first] = commonVariants(before, after, component);

    pinned[`${component}Probability`] = 100;

    if (first) {
      pinned[`${component}Variant`] = first;
    }
  }

  const colorNames = new Set([
    ...before.colors().keys(),
    ...after.colors().keys(),
    'background',
  ]);

  for (const name of colorNames) {
    pinned[`${name}Color`] = [pinnedColor(before, after, name) ?? '#ffffff'];
  }

  const result: SweepResult = { total: 0, different: [] };

  for (const component of dependencyOrder(components, references)) {
    const beforeStyle = isolatedStyle(before, component);
    const afterStyle = isolatedStyle(after, component);
    const variants = commonVariants(before, after, component);

    const cases: SweepCase[] = variants.map((variant) => ({
      name: `${component}/${variant}`,
      before: beforeStyle,
      after: afterStyle,
      options: {
        ...pinned,
        [`${component}Variant`]: variant,
      } as StyleOptions,
    }));

    const own = await sweep(styleName, cases, options);
    const changed = new Set(own.different.map((entry) => entry.name));
    const identical = variants.find(
      (variant) => !changed.has(`${component}/${variant}`),
    );

    if (identical) {
      pinned[`${component}Variant`] = identical;
    }

    result.total += own.total;
    result.different.push(...own.different);
  }

  return result;
}
