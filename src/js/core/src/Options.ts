import { OptionsValidator } from './Validator/OptionsValidator.js';
import type { Range } from './StyleDefinition.js';
import type {
  StyleOptions,
  StyleOptionsFlipValue,
  StyleOptionsColorFillValue,
  StyleOptionsColorOrderValue,
  TagFilterToken,
} from './StyleOptions.js';

/**
 * Validates the raw user-supplied options and exposes them through typed
 * accessors. Each accessor returns the user's input in a normalized form
 * (always an array for options that accept either a scalar or an array, or
 * `undefined` when the option is not set), so consumers — chiefly
 * {@link Resolver} — never have to do their own normalization.
 *
 * Resolution against the style definition and the PRNG happens in
 * {@link Resolver}; this class is purely about reading user input.
 */
export class Options<D = unknown> {
  #data: StyleOptions<D>;
  #tags?: readonly TagFilterToken[];

  constructor(data: StyleOptions<D> = {} as StyleOptions<D>) {
    OptionsValidator.validate(data);

    this.#data = structuredClone(data);
  }

  seed(): string | undefined {
    return this.#data.seed;
  }

  size(): number | undefined {
    return this.#data.size;
  }

  idRandomization(): boolean | undefined {
    return this.#data.idRandomization;
  }

  title(): string | undefined {
    return this.#data.title;
  }

  flip(): readonly StyleOptionsFlipValue[] {
    return this.#asArray(this.#data.flip);
  }

  fontFamily(): readonly string[] {
    return this.#asArray(this.#data.fontFamily);
  }

  fontWeight(): readonly number[] {
    return this.#asArray(this.#data.fontWeight);
  }

  scale(): Range | undefined {
    return this.#toRange(this.#data.scale);
  }

  borderRadius(): Range | undefined {
    return this.#toRange(this.#data.borderRadius);
  }

  rotate(): Range | undefined {
    return this.#toRange(this.#data.rotate);
  }

  translateX(): Range | undefined {
    return this.#toRange(this.#data.translateX);
  }

  translateY(): Range | undefined {
    return this.#toRange(this.#data.translateY);
  }

  animation(): boolean | undefined {
    return this.#data.animation;
  }

  /**
   * Returns the `${name}Animation` switch for one animation name, or
   * `undefined` when unset.
   */
  animationFor(name: string): boolean | undefined {
    return this.#dynamic(`${name}Animation`) as boolean | undefined;
  }

  animationSpeed(): Range | undefined {
    return this.#toRange(this.#data.animationSpeed);
  }

  /**
   * Returns the `${name}AnimationSpeed` option for one animation name as a
   * range, or `undefined` when unset.
   */
  animationSpeedFor(name: string): Range | undefined {
    return this.#toRange(
      this.#dynamic(`${name}AnimationSpeed`) as
        number | readonly number[] | undefined,
    );
  }

  animationDelay(): Range | undefined {
    return this.#toRange(this.#data.animationDelay);
  }

  /**
   * Returns the `${name}AnimationDelay` option for one animation name as a
   * range, or `undefined` when unset.
   */
  animationDelayFor(name: string): Range | undefined {
    return this.#toRange(
      this.#dynamic(`${name}AnimationDelay`) as
        number | readonly number[] | undefined,
    );
  }

  /**
   * Returns the global `tags` filter as parsed tokens, or an empty array when
   * unset. Each raw token (`category` / `category:value`, optionally
   * `!`-prefixed to disallow) is decoded into `{ category, value?, negated }` so
   * the resolver composes the filter without parsing the grammar itself. An
   * empty list means no tag filtering (classic behavior). Memoized, since the
   * resolver reads it once per component.
   */
  tags(): readonly TagFilterToken[] {
    return (this.#tags ??= this.#asArray(this.#data.tags).map((token) => {
      const negated = token.startsWith('!');
      const body = negated ? token.slice(1) : token;
      const sep = body.indexOf(':');

      return sep === -1
        ? { category: body, negated }
        : { category: body.slice(0, sep), value: body.slice(sep + 1), negated };
    }));
  }

  /**
   * Returns the user-set variant constraint for `name` as a weighted map, or
   * `undefined` when `${name}Variant` is unset. A bare string or string list
   * is normalized to a map with each entry weighted `1`.
   */
  componentVariant(name: string): Readonly<Record<string, number>> | undefined {
    const raw = this.#dynamic(`${name}Variant`);

    if (raw === undefined) {
      return undefined;
    }

    if (typeof raw === 'string') {
      return { [raw]: 1 };
    }

    if (Array.isArray(raw)) {
      return Object.fromEntries((raw as readonly string[]).map((v) => [v, 1]));
    }

    return raw as Readonly<Record<string, number>>;
  }

  componentProbability(name: string): number | undefined {
    return this.#dynamic(`${name}Probability`) as number | undefined;
  }

  /**
   * Asymmetric on purpose: returns `undefined` (rather than `[]`) when
   * `${name}Color` is unset so the resolver can fall back to the style
   * definition's color values.
   */
  color(name: string): readonly string[] | undefined {
    const raw = this.#dynamic(`${name}Color`);

    return raw === undefined
      ? undefined
      : this.#asArray(raw as string | readonly string[]);
  }

  colorFill(name: string): readonly StyleOptionsColorFillValue[] {
    return this.#asArray(
      this.#dynamic(`${name}ColorFill`) as
        | StyleOptionsColorFillValue
        | readonly StyleOptionsColorFillValue[]
        | undefined,
    );
  }

  colorAngle(name: string): Range | undefined {
    return this.#toRange(
      this.#dynamic(`${name}ColorAngle`) as
        number | readonly number[] | undefined,
    );
  }

  colorFillStops(name: string): Range | undefined {
    return this.#toRange(
      this.#dynamic(`${name}ColorFillStops`) as
        number | readonly number[] | undefined,
    );
  }

  colorOrder(name: string): StyleOptionsColorOrderValue | undefined {
    return this.#dynamic(`${name}ColorOrder`) as
      StyleOptionsColorOrderValue | undefined;
  }

  /**
   * Returns the raw value of a dynamic-key option (e.g. `${name}Color`)
   * untouched. Used for keys that are not statically declared on
   * {@link StyleOptions}.
   */
  #dynamic(key: string): unknown {
    return (this.#data as Record<string, unknown>)[key];
  }

  /** Normalizes a scalar/array/undefined value into a readonly array. */
  #asArray<T>(value: T | readonly T[] | undefined): readonly T[] {
    if (value === undefined) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [value as T];
  }

  /**
   * Normalizes a user-facing range option (bare number, `[n]`, `[min, max]`,
   * or `undefined`) into the internal {@link Range} struct. A bare number `n`
   * — or a single-element array `[n]` — becomes `{ min: n, max: n }` (a fixed
   * value). An array's smaller/larger element is taken as min/max. An empty
   * array is treated as unset so the resolver applies the option's default,
   * rather than yielding `NaN` from a missing bound. Matches every other port.
   */
  #toRange(value: number | readonly number[] | undefined): Range | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (typeof value === 'number') {
      return { min: value, max: value };
    }

    if (value.length === 0) {
      return undefined;
    }

    return { min: Math.min(...value), max: Math.max(...value) };
  }
}
