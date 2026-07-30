import type { StyleDefinition } from '@dicebear/core';
import { isAlias, resolveBase } from './combinationCount';
import { toTagTokens } from './tags';

type MutableDefinition = StyleDefinition & {
  components?: Record<string, any>;
  colors?: Record<string, any>;
};

/**
 * Produces a deep clone of `definition` with the user's playground option
 * choices applied — restricting variant lists, probability, and color
 * palettes so that `computeCount` reflects the narrowed space.
 *
 * Only options whose key appears in `options` (i.e. that the user actually
 * set) are applied. Canvas-level transforms (flip, rotate, scale,
 * borderRadius, translateX/Y) and presentation options (fontFamily, *Fill,
 * *FillStops, *Angle, seed, size, …) do not change the cardinality and are
 * therefore ignored here, matching what `combinationCount` already counts.
 */
export function narrowDefinition(
  definition: StyleDefinition,
  options: Record<string, unknown>,
): StyleDefinition {
  const next = structuredClone(definition) as MutableDefinition;
  const entries = Object.entries(options).filter(([, v]) => v !== undefined);

  // Probability first, then variants — so an empty-variant override can
  // unconditionally pin probability = 0 (component always invisible)
  // without being clobbered by a separately-set probability.
  for (const [key, value] of entries) {
    if (key.endsWith('Probability')) {
      applyProbability(next, key.slice(0, -'Probability'.length), value);
    }
  }

  // Track the base components an explicit `${name}Variant` governs — the
  // global `tags` filter must skip those, mirroring the resolver's precedence
  // (Resolver.#variantWeights: a set `${name}Variant` fully governs the pool).
  const explicitVariantBases = new Set<string>();

  for (const [key, value] of entries) {
    if (key.endsWith('Variant')) {
      const base = applyVariantNarrowing(
        next,
        key.slice(0, -'Variant'.length),
        value,
      );

      if (base) {
        explicitVariantBases.add(base);
      }
    } else if (key.endsWith('Color')) {
      applyColorPalette(next, key.slice(0, -'Color'.length), value);
    }
  }

  if (options.tags !== undefined) {
    applyTagFilter(next, options.tags, explicitVariantBases);
  }

  return next;
}

/**
 * Applies a `${name}Variant` override and returns the resolved base component
 * name it governs (or `undefined` when the option resolves to nothing). The
 * caller records that name so the global `tags` filter skips this component,
 * matching the resolver's precedence (a set `${name}Variant` fully governs the
 * pool — see {@link applyTagFilter}).
 */
function applyVariantNarrowing(
  definition: MutableDefinition,
  componentName: string,
  value: unknown,
): string | undefined {
  const base = resolveBase(definition, componentName);

  if (!base || !base.component.variants) {
    return base?.name;
  }

  const baseComponent = definition.components?.[base.name];

  if (!baseComponent || isAlias(baseComponent)) {
    return base.name;
  }

  let active: Map<string, number> | undefined;

  if (typeof value === 'string') {
    // `Options.componentVariant` normalizes a bare string to `{ [value]: 1 }`,
    // so a single name narrows the pool exactly like a one-element list. Left
    // unhandled, the component would keep its full pool in the count while
    // still counting as explicitly pinned, inflating the total twice over.
    active = new Map();

    if (value in (base.component.variants ?? {})) {
      active.set(value, 1);
    }
  } else if (Array.isArray(value)) {
    active = new Map();

    for (const entry of value) {
      if (typeof entry !== 'string') continue;

      // Strip optional weight prefix like "2:variantName" (Prng.weightedPick syntax).
      const colon = entry.indexOf(':');
      const name = colon >= 0 ? entry.slice(colon + 1) : entry;
      const weight = colon >= 0 ? Number(entry.slice(0, colon)) : 1;

      if (name in (base.component.variants ?? {})) {
        active.set(name, Number.isFinite(weight) ? Math.max(weight, 0) : 1);
      }
    }
  } else if (value && typeof value === 'object') {
    active = new Map();

    for (const [name, weight] of Object.entries(
      value as Record<string, unknown>,
    )) {
      if (name in (base.component.variants ?? {})) {
        const w = typeof weight === 'number' ? weight : 1;
        active.set(name, Math.max(w, 0));
      }
    }
  }

  if (!active) {
    return base.name;
  }

  // Empty selection: renderer's weightedPick returns undefined for `[]`
  // (Prng.ts:57-59), so the component renders nothing — exactly one outcome.
  // Force probability = 0 so `outcomes()` collapses to 1n regardless of any
  // user-set probability.
  if (active.size === 0) {
    baseComponent.probability = 0;
    return base.name;
  }

  const narrowed: Record<string, any> = {};

  for (const [name, weight] of active) {
    const original = base.component.variants![name];
    narrowed[name] = { ...original, weight };
  }

  baseComponent.variants = narrowed;

  return base.name;
}

type TagToken = { category: string; value?: string; negated: boolean };

/**
 * Mirrors `ComponentVariant.hasTag` over a raw tag list. With no `value`, it
 * matches a whole category (the bare `category` tag or any `category:value`);
 * with a `value`, only the exact `category:value` tag.
 */
function variantHasTag(
  tags: readonly string[],
  category: string,
  value?: string,
): boolean {
  if (value === undefined) {
    return tags.some(
      (tag) => tag === category || tag.startsWith(`${category}:`),
    );
  }

  return tags.includes(`${category}:${value}`);
}

/**
 * Parses the raw `tags` option into filter tokens, mirroring `Options.tags`.
 * A single string is wrapped to an array; each `category` / `category:value`
 * token (optionally `!`-prefixed to disallow) becomes
 * `{ category, value?, negated }`.
 */
function parseTagTokens(value: unknown): TagToken[] {
  const tokens: TagToken[] = [];

  for (const entry of toTagTokens(value)) {
    const negated = entry.startsWith('!');
    const body = negated ? entry.slice(1) : entry;
    const sep = body.indexOf(':');

    tokens.push(
      sep === -1
        ? { category: body, negated }
        : { category: body.slice(0, sep), value: body.slice(sep + 1), negated },
    );
  }

  return tokens;
}

/**
 * Applies the global `tags` filter to every base component lacking an explicit
 * `${name}Variant` override, mirroring `Resolver.#tagFilteredNames`. Within a
 * category some allow mentions, a variant survives if it carries no tag in
 * that category or matches one of the allowed values (OR within a category,
 * AND across categories). A bare `category` token requires the category and
 * drops variants without a tag in it, but only in components where the
 * category is in use. A `!category[:value]` token drops matching variants
 * and always wins. A component narrowed to no variants renders nothing — one
 * outcome — so its probability is pinned to 0 (matching the empty-selection
 * branch in {@link applyVariantNarrowing}).
 */
function applyTagFilter(
  definition: MutableDefinition,
  tagsOption: unknown,
  explicitVariantBases: ReadonlySet<string>,
): void {
  const tokens = parseTagTokens(tagsOption);
  const allows = new Map<string, string[]>();
  const bares = new Set<string>();
  const disallows: { category: string; value?: string }[] = [];

  for (const { category, value, negated } of tokens) {
    if (negated) {
      disallows.push({ category, value });
    } else if (value !== undefined) {
      const values = allows.get(category) ?? [];

      values.push(value);
      allows.set(category, values);
    } else {
      bares.add(category);
    }
  }

  const allowGroups = [...allows];
  const bareList = [...bares];

  if (
    allowGroups.length === 0 &&
    bareList.length === 0 &&
    disallows.length === 0
  ) {
    return;
  }

  for (const [name, component] of Object.entries(definition.components ?? {})) {
    if (isAlias(component) || !component.variants) {
      continue;
    }

    if (explicitVariantBases.has(name)) {
      continue;
    }

    // A bare token only binds where its category is in use.
    const variantList = Object.values(component.variants);
    const required = bareList.filter((category) =>
      variantList.some((variant) =>
        variantHasTag(
          Array.isArray(variant.tags) ? variant.tags : [],
          category,
        ),
      ),
    );

    const narrowed: Record<string, any> = {};

    for (const [variantName, variant] of Object.entries(component.variants)) {
      const tags: readonly string[] = Array.isArray(variant.tags)
        ? variant.tags
        : [];

      const allowed =
        allowGroups.every(
          ([category, values]) =>
            !variantHasTag(tags, category) ||
            values.some((value) => variantHasTag(tags, category, value)),
        ) && required.every((category) => variantHasTag(tags, category));
      const disallowed = disallows.some(({ category, value }) =>
        variantHasTag(tags, category, value),
      );

      if (allowed && !disallowed) {
        narrowed[variantName] = variant;
      }
    }

    if (Object.keys(narrowed).length === 0) {
      component.probability = 0;
    } else {
      component.variants = narrowed;
    }
  }
}

function applyProbability(
  definition: MutableDefinition,
  componentName: string,
  value: unknown,
): void {
  const base = resolveBase(definition, componentName);

  if (!base) {
    return;
  }

  const baseComponent = definition.components?.[base.name];

  if (!baseComponent || isAlias(baseComponent)) {
    return;
  }

  let probability: number | undefined;

  if (typeof value === 'number') {
    probability = value;
  } else if (Array.isArray(value) && value.length === 2) {
    const [a, b] = value;

    if (typeof a === 'number' && typeof b === 'number') {
      // For counting purposes only the "can be invisible" bit matters:
      // if both endpoints hit the same extreme, honor it; otherwise the
      // range straddles non-100 so the +1-invisible branch applies.
      if (a === 100 && b === 100) probability = 100;
      else if (a === 0 && b === 0) probability = 0;
      else probability = 99;
    }
  }

  if (probability === undefined) {
    return;
  }

  baseComponent.probability = Math.max(0, Math.min(100, probability));
}

function applyColorPalette(
  definition: MutableDefinition,
  colorName: string,
  value: unknown,
): void {
  const group = definition.colors?.[colorName];

  if (!group) {
    return;
  }

  let values: string[] | undefined;

  if (Array.isArray(value)) {
    values = value.filter((v): v is string => typeof v === 'string');
  } else if (typeof value === 'string') {
    values = [value];
  }

  if (!values || values.length === 0) {
    return;
  }

  group.values = values;
}
