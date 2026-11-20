/**
 * The nesting limit for style definitions and options.
 *
 * A port may turn down a value nested deeper than {@link Depth.MAX} levels
 * before it runs the schema, and some must: their schema validators run out of
 * stack on a few thousand levels. Every port applies the same limit, so a
 * definition renders in all of them or in none. Valid options nest two levels
 * and the deepest style definition uses less than a quarter of the limit.
 */
export class Depth {
  /**
   * How many levels of objects and arrays a value may nest, counting the value
   * itself as the first.
   */
  static readonly MAX = 64;

  /**
   * What a validator reports when {@link Depth.exceeds} holds.
   */
  static readonly MESSAGE = `nesting is deeper than the ${Depth.MAX} levels this port reads`;

  /**
   * Returns whether `value` nests objects and arrays deeper than
   * {@link Depth.MAX} levels. A value that contains itself does.
   */
  static exceeds(value: unknown): boolean {
    return Depth.#exceeds(value, 1, new Map());
  }

  /**
   * `checked` holds the deepest level each object or array was searched from.
   * One met again no deeper than that needs no second search, so a part shared
   * many times is searched once, not once per reference. One met again deeper
   * is searched again, which is how a value that contains itself runs into the
   * limit.
   */
  static #exceeds(
    value: unknown,
    depth: number,
    checked: Map<object, number>,
  ): boolean {
    if (value === null || typeof value !== 'object') {
      return false;
    }

    if (depth > Depth.MAX) {
      return true;
    }

    if ((checked.get(value) ?? 0) >= depth) {
      return false;
    }

    checked.set(value, depth);

    const items = Array.isArray(value) ? value : Object.values(value);

    return items.some((item) => Depth.#exceeds(item, depth + 1, checked));
  }
}
