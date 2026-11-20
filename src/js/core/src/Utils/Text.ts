/**
 * Makes user text well-formed before the core reads it.
 *
 * A JS string can hold a lone UTF-16 surrogate, for example half of an emoji
 * cut off by a slice. Ports that keep strings as UTF-8 can hold ill-formed
 * bytes instead. Neither has a meaning another port could reproduce, so every
 * port replaces them with U+FFFD first. Here that is each lone surrogate, the
 * same as `String.prototype.toWellFormed()`.
 */
export class Text {
  /**
   * Returns `value` with every lone surrogate replaced by U+FFFD. A
   * well-formed string comes back unchanged.
   */
  static wellFormed(value: string): string {
    let result = '';
    let start = 0;

    for (let i = 0; i < value.length; i++) {
      const unit = value.charCodeAt(i);

      if (unit < 0xd800 || unit > 0xdfff) {
        continue;
      }

      const next = i + 1 < value.length ? value.charCodeAt(i + 1) : 0;

      if (unit <= 0xdbff && next >= 0xdc00 && next <= 0xdfff) {
        // A valid pair: keep both units.
        i++;
        continue;
      }

      result += value.slice(start, i) + '�';
      start = i + 1;
    }

    return start === 0 ? value : result + value.slice(start);
  }

  /**
   * How many levels of objects and arrays {@link wellFormedDeep} walks. No
   * valid options nest anywhere near this deep.
   */
  static readonly MAX_DEPTH = 64;

  /**
   * Applies {@link wellFormed} to every string in a JSON-like value: object
   * keys, object values and array items. Returns a new value and leaves the
   * input untouched; anything that is not a string, array or plain object is
   * passed through.
   *
   * So is an object or array nested deeper than {@link MAX_DEPTH} levels, or
   * one that contains itself. The walk must not be what fails on such input:
   * the validator turns it down with its own error, and without a validator
   * nothing reads that far.
   */
  static wellFormedDeep<T>(value: T): T {
    return Text.#deep(value, new Set(), 0) as T;
  }

  /**
   * `path` holds the objects and arrays between the root and `value`. A depth
   * limit alone would not stop a cycle in time: a value that contains itself
   * twice doubles the work on every level.
   */
  static #deep(value: unknown, path: Set<object>, depth: number): unknown {
    if (typeof value === 'string') {
      return Text.wellFormed(value);
    }

    if (value === null || typeof value !== 'object') {
      return value;
    }

    const isArray = Array.isArray(value);

    if (!isArray) {
      const prototype = Object.getPrototypeOf(value);

      if (prototype !== Object.prototype && prototype !== null) {
        return value;
      }
    }

    if (depth >= Text.MAX_DEPTH || path.has(value)) {
      return value;
    }

    path.add(value);

    let result: unknown;

    if (isArray) {
      result = value.map((item) => Text.#deep(item, path, depth + 1));
    } else {
      const copy: Record<string, unknown> = {};

      for (const [key, item] of Object.entries(value)) {
        // defineProperty, so an own "__proto__" key stays a plain key
        // instead of replacing the prototype of the copy.
        Object.defineProperty(copy, Text.wellFormed(key), {
          value: Text.#deep(item, path, depth + 1),
          enumerable: true,
          writable: true,
          configurable: true,
        });
      }

      result = copy;
    }

    path.delete(value);

    return result;
  }
}
