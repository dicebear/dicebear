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
   * Applies {@link wellFormed} to every string in a JSON-like value: object
   * keys, object values and array items, at any depth. Returns a new value and
   * leaves the input untouched; anything that is not a string, array or plain
   * object is passed through.
   */
  static wellFormedDeep<T>(value: T): T {
    if (typeof value === 'string') {
      return Text.wellFormed(value) as T;
    }

    if (Array.isArray(value)) {
      return value.map((item) => Text.wellFormedDeep(item)) as T;
    }

    if (value !== null && typeof value === 'object') {
      const prototype = Object.getPrototypeOf(value);

      if (prototype === Object.prototype || prototype === null) {
        const result: Record<string, unknown> = {};

        for (const [key, item] of Object.entries(value)) {
          // defineProperty, so an own "__proto__" key stays a plain key
          // instead of replacing the prototype of the copy.
          Object.defineProperty(result, Text.wellFormed(key), {
            value: Text.wellFormedDeep(item),
            enumerable: true,
            writable: true,
            configurable: true,
          });
        }

        return result as T;
      }
    }

    return value;
  }
}
