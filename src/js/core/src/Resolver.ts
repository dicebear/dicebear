import { Options } from './Options.js';
import { Prng } from './Prng.js';
import type { Range } from './StyleDefinition.js';
import { Color } from './Utils/Color.js';
import { CircularColorReferenceError } from './Error/CircularColorReferenceError.js';
import type { Style } from './Style.js';
import type { Component } from './Style/Component.js';
import type { ComponentVariant } from './Style/ComponentVariant.js';
import {
  COLOR_ORDER_FIXED,
  COLOR_ORDER_RANDOM,
  type StyleOptionsFlipValue,
  type StyleOptionsColorFillValue,
  type StyleOptionsColorOrderValue,
  type StyleOptions,
} from './StyleOptions.js';

/**
 * The `tags` filter tokens grouped by role, as {@link Resolver} composes them.
 * `bareDisallows` is the subset of `disallows` carrying no value, cached so the
 * per-component narrowing can cancel the matching bare requirements.
 */
type TagFilter = {
  allowGroups: [string, string[]][];
  bares: ReadonlySet<string>;
  disallows: { category: string; value?: string }[];
  bareDisallows: ReadonlySet<string>;
};

/**
 * Bundles the three inputs needed to derive any deterministic value for an
 * avatar — the {@link Style}, the validated user {@link Options}, and a
 * seeded {@link Prng} — and exposes them as named accessors. Each accessor
 * memoizes its result so that repeated calls cannot drift. The memo also
 * serves as the informational snapshot returned by {@link resolved} — every
 * value the resolver picks during one resolution lands there, except for
 * the raw seed.
 */
export class Resolver<D = unknown> {
  #style: Style<D>;
  #options: Options<D>;
  #prng: Prng;
  #colorResolving: string[] = [];
  #result: Record<string, unknown> = {};
  #tagFilterCache?: TagFilter;

  constructor(style: Style<D>, options: Options<D>) {
    this.#style = style;
    this.#options = options;
    this.#prng = new Prng(this.seed());
  }

  seed(): string {
    // Deliberately not memoized — the seed is the only input we keep out of
    // the {@link resolved} snapshot, so a serialized avatar never leaks it.
    return this.#options.seed() ?? '';
  }

  size(): number | undefined {
    return this.#memo('size', () => this.#options.size());
  }

  idRandomization(): boolean {
    return this.#memo(
      'idRandomization',
      () => this.#options.idRandomization() ?? false,
    );
  }

  title(): string | undefined {
    return this.#memo('title', () => this.#options.title());
  }

  flip(): StyleOptionsFlipValue {
    return this.#memo(
      'flip',
      () => this.#prng.pick('flip', this.#options.flip()) ?? 'none',
    );
  }

  fontFamily(): string {
    return this.#memo(
      'fontFamily',
      () =>
        this.#prng.pick('fontFamily', this.#options.fontFamily()) ??
        'system-ui',
    );
  }

  fontWeight(): number {
    return this.#memo(
      'fontWeight',
      () => this.#prng.pick('fontWeight', this.#options.fontWeight()) ?? 400,
    );
  }

  scale(): number {
    return this.#memoFloat('scale', this.#options.scale(), 1);
  }

  borderRadius(): number {
    return this.#memoFloat('borderRadius', this.#options.borderRadius(), 0);
  }

  rotate(): number {
    return this.#memoFloat('rotate', this.#options.rotate(), 0);
  }

  translateX(): number {
    return this.#memoFloat('translateX', this.#options.translateX(), 0);
  }

  translateY(): number {
    return this.#memoFloat('translateY', this.#options.translateY(), 0);
  }

  /**
   * Selects a variant for the given component. The pool the PRNG draws from is
   * built from the per-component `${name}Variant` option and the global `tags`
   * filter (see {@link #variantWeights}). Only variants that exist in the style
   * definition are considered.
   */
  variant(name: string): string | undefined {
    return this.#memo(`${name}Variant`, () => {
      const component = this.#style.components().get(name);

      if (!component || !this.#isVisible(name, component)) {
        return undefined;
      }

      return this.#prng.weightedPick(
        `${name}Variant`,
        this.#variantWeights(component),
      );
    });
  }

  color(name: string): readonly string[] {
    return this.#memo(`${name}Color`, () => this.#resolveColor(name));
  }

  colorFill(name: string): StyleOptionsColorFillValue {
    return this.#memo(
      `${name}ColorFill`,
      () =>
        this.#prng.pick(`${name}ColorFill`, this.#options.colorFill(name)) ??
        'solid',
    );
  }

  colorAngle(name: string): number {
    return this.#memoFloat(
      `${name}ColorAngle`,
      this.#options.colorAngle(name),
      0,
    );
  }

  colorOrder(name: string): StyleOptionsColorOrderValue {
    // Deliberately not memoized: unlike colorFill this is no PRNG pick, so it
    // stays out of the {@link resolved} snapshot.
    return this.#options.colorOrder(name) ?? COLOR_ORDER_RANDOM;
  }

  /**
   * Picks the rotate/translateX/translateY/scale values for a single
   * component. Memoized per `name`, so the four values land in
   * {@link resolved} as `${name}Rotate` / `${name}TranslateX` /
   * `${name}TranslateY` / `${name}Scale` for downstream introspection.
   */
  componentTransform(name: string): {
    rotate: number;
    translateX: number;
    translateY: number;
    scale: number;
  } {
    const component = this.#style.components().get(name);

    return {
      rotate: this.#memoFloat(`${name}Rotate`, component?.rotate(), 0),
      translateX: this.#memoFloat(
        `${name}TranslateX`,
        component?.translate().x(),
        0,
      ),
      translateY: this.#memoFloat(
        `${name}TranslateY`,
        component?.translate().y(),
        0,
      ),
      scale: this.#memoFloat(`${name}Scale`, component?.scale(), 1),
    };
  }

  /**
   * Returns an informational snapshot of every value the resolver picked.
   * Includes top-level options (scale/rotate/translate/…), per-component
   * variants/probabilities/colors, and per-component transform picks. The
   * raw seed is deliberately excluded.
   *
   * The snapshot is NOT a round-trip-able options object — extra keys like
   * `${name}Rotate` are not part of {@link StyleOptions} and feeding the
   * snapshot back into a new {@link Avatar} is not supported. Callers that
   * need to reproduce an avatar should pass the original `seed` and
   * user-supplied options.
   *
   * The returned object aliases the internal cache; callers that need
   * isolation (e.g. {@link Avatar.toJSON}) clone it themselves.
   */
  resolved(): StyleOptions<D> {
    return this.#result as StyleOptions<D>;
  }

  /**
   * Returns the visibility probability (0–100) for the given component.
   * Aliases read the source component's user-set probability so a single
   * `<source>Probability` option propagates to every alias of the source.
   */
  #probability(component: Component): number {
    const raw = this.#options.componentProbability(component.sourceName());

    return raw ?? component.probability();
  }

  #isVisible(name: string, component: Component): boolean {
    return this.#prng.bool(`${name}Probability`, this.#probability(component));
  }

  /**
   * Builds the name → weight map the PRNG draws a variant from. The
   * per-component `${name}Variant` option is more specific than the global
   * `tags` filter, so it takes precedence: when set, it fully governs the
   * component's pool (its named variants, weighted by the option) and the tags
   * filter is ignored for that component. The tags filter applies only where
   * the user gave no explicit `${name}Variant` (see {@link #tagFilteredNames}),
   * and falls back to every variant when neither is set.
   *
   * Names the style does not define are dropped, and an empty `${name}Variant`
   * (or an empty tag result) yields no variant. The weight read only ever
   * touches the option's own keys, never Object.prototype.
   */
  #variantWeights(component: Component): Record<string, number> {
    const variants = component.variants();
    const named = this.#options.componentVariant(component.sourceName());
    const weights: Record<string, number> = {};

    const names = named
      ? Object.keys(named)
      : this.#options.tags().length > 0
        ? this.#tagFilteredNames(variants)
        : variants.keys();

    for (const name of names) {
      const variant = variants.get(name);

      if (variant !== undefined) {
        weights[name] = named ? named[name] : variant.weight();
      }
    }

    return weights;
  }

  /**
   * Classifies the parsed {@link Options.tags} tokens into the allow groups,
   * bare requirements and disallows the filter is composed from. The result
   * depends only on the options, never on a component, so it is computed once
   * per avatar rather than rebuilt for each of a style's components.
   */
  #tagFilter(): TagFilter {
    if (this.#tagFilterCache) {
      return this.#tagFilterCache;
    }

    const allows = new Map<string, string[]>();
    const bares = new Set<string>();
    const disallows: { category: string; value?: string }[] = [];
    const bareDisallows = new Set<string>();

    for (const { category, value, negated } of this.#options.tags()) {
      if (negated) {
        disallows.push({ category, value });

        if (value === undefined) {
          bareDisallows.add(category);
        }
      } else if (value !== undefined) {
        const values = allows.get(category) ?? [];

        values.push(value);
        allows.set(category, values);
      } else {
        bares.add(category);
      }
    }

    this.#tagFilterCache = {
      // Materialize the allow groups once, not on every variant.
      allowGroups: [...allows],
      bares,
      disallows,
      bareDisallows,
    };

    return this.#tagFilterCache;
  }

  /**
   * Narrows a component's variants to the names satisfying the global `tags`
   * filter, applying the parsed {@link Options.tags} tokens in one pass over
   * the pool:
   *
   * - A positive `cat:value` token is an axis-scoped allow. Within each
   *   category some allow mentions, a variant is kept only if it carries no
   *   tag in that category (untouched) or matches one of the allowed values
   *   (OR within the category). Distinct allowed categories combine with AND,
   *   and a category no allow mentions is left unconstrained.
   * - A bare positive `cat` token requires the category: it drops variants
   *   that carry no tag in `cat`. It only binds where the category is in use —
   *   a component with no `cat` tag on any variant is left untouched, so
   *   `animation` turns on a style's opt-in animation without erasing the
   *   components that know nothing about it.
   * - A negative `!cat`/`!cat:value` token disallows, dropping every variant
   *   carrying any tag in `cat` (bare) or the exact `cat:value` tag. Disallows
   *   are checked alongside allows but always win.
   *
   * Returns the surviving variant names in definition order.
   */
  #tagFilteredNames(variants: ReadonlyMap<string, ComponentVariant>): string[] {
    const { allowGroups, bares, disallows, bareDisallows } = this.#tagFilter();

    // A bare token only binds where its category is in use, so this narrowing
    // — unlike the classification above — is genuinely per-component.
    const required = [...bares].filter((category) => {
      if (bareDisallows.has(category)) {
        return false;
      }

      for (const variant of variants.values()) {
        if (variant.hasTag(category)) {
          return true;
        }
      }

      return false;
    });

    const names: string[] = [];

    for (const [name, variant] of variants) {
      const allowed =
        allowGroups.every(
          ([category, values]) =>
            !variant.hasTag(category) ||
            values.some((value) => variant.hasTag(category, value)),
        ) && required.every((category) => variant.hasTag(category));
      const disallowed = disallows.some(({ category, value }) =>
        variant.hasTag(category, value),
      );

      if (allowed && !disallowed) {
        names.push(name);
      }
    }

    return names;
  }

  /**
   * Resolves a named color to its final stop list, applying contrast sorting
   * and `notEqualTo` filtering from the style definition. Detects circular
   * references between colors and throws {@link CircularColorReferenceError}.
   *
   * A user-set `${name}ColorOrder: 'fixed'` pins user-supplied colors to
   * their verbatim order: the shuffle and the contrast sort are skipped
   * (`notEqualTo` filtering still applies), and the gradient stop count
   * defaults to the number of supplied colors instead of 2. A style palette
   * carries no order contract, so with `fixed` it is still deduplicated,
   * code-point sorted, and contrast sorted; only the shuffle is skipped.
   */
  #resolveColor(name: string): readonly string[] {
    const userColors = this.#options.color(name);
    const styleColor = this.#style.colors().get(name);
    const source = userColors ?? styleColor?.values() ?? [];

    let candidates = source.map((c) => Color.toHex(c));
    const fixed = this.colorOrder(name) === COLOR_ORDER_FIXED;
    const verbatim = userColors !== undefined && fixed;
    const fill = this.colorFill(name);
    const stops =
      fill === 'solid'
        ? 1
        : this.#colorFillStops(name, verbatim ? candidates.length : 2);

    if (!styleColor) {
      return this.#order(name, candidates, fixed, verbatim).slice(0, stops);
    }

    // Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a)
    if (this.#colorResolving.includes(name)) {
      throw new CircularColorReferenceError(this.#colorResolving.concat(name));
    }

    this.#colorResolving.push(name);
    const contrastTo = styleColor.contrastTo();
    const notEqualTo = styleColor.notEqualTo();

    try {
      if (contrastTo && !verbatim) {
        const refColor = this.color(contrastTo)[0];

        if (refColor) {
          candidates = Color.sortByContrast(candidates, refColor);
        }
      }

      if (notEqualTo.length > 0) {
        const excluded: string[] = [];

        for (const ref of notEqualTo) {
          for (const color of this.color(ref)) {
            excluded.push(color);
          }
        }

        candidates = Color.filterNotEqualTo(candidates, excluded);
      }
    } finally {
      this.#colorResolving.pop();
    }

    // Skip shuffle when sorted by contrast to preserve the ordering
    const ordered = contrastTo
      ? candidates
      : this.#order(name, candidates, fixed, verbatim);

    return ordered.slice(0, stops);
  }

  /**
   * Applies `${name}ColorOrder` to the candidate list. `random` shuffles via
   * the PRNG. `fixed` skips the shuffle: user-supplied colors (`verbatim`)
   * keep exactly the given order, while a style palette is still deduplicated
   * and sorted by UTF-16 code units, matching the canonicalization the
   * shuffle applies before drawing.
   */
  #order(
    name: string,
    candidates: string[],
    fixed: boolean,
    verbatim: boolean,
  ): string[] {
    if (!fixed) {
      return this.#prng.shuffle(`${name}Color`, candidates);
    }

    if (verbatim) {
      return candidates;
    }

    // Deprecated: DiceBear 11 will take the palette in its definition order
    // here, the same verbatim rule as user-supplied colors, and drop this
    // sort (see CHANGELOG.md, "Deprecated").
    return Array.from(new Set(candidates)).sort();
  }

  #colorFillStops(name: string, fallback: number): number {
    const range = this.#options.colorFillStops(name);

    return range
      ? this.#prng.integer(`${name}ColorFillStops`, range)
      : fallback;
  }

  #memoFloat(key: string, range: Range | undefined, fallback: number): number {
    return this.#memo(key, () =>
      range ? this.#prng.float(key, range) : fallback,
    );
  }

  #memo<T>(key: string, compute: () => T): T {
    if (key in this.#result) {
      return this.#result[key] as T;
    }

    const value = compute();

    this.#result[key] = value;

    return value;
  }
}
