/**
 * Finds a number in the options that is not finite.
 *
 * JSON cannot carry Infinity or NaN, so every other port turns such a value
 * down before or during validation. The compiled JS validator lets one
 * through where the schema sets no maximum, a variant weight for example, and
 * the avatar then rendered here but nowhere else.
 */
export class Finite {
  static readonly MESSAGE = 'must be a finite number';

  /**
   * Returns the JSON pointer of the first non-finite number in `value`, or
   * `undefined` if there is none. Runs after the depth check, so the value
   * nests at most a few levels.
   */
  static find(value: unknown, path = ''): string | undefined {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? undefined : path;
    }

    if (value === null || typeof value !== 'object') {
      return undefined;
    }

    for (const [key, inner] of Object.entries(value)) {
      const pointer = `${path}/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`;
      const found = Finite.find(inner, pointer);

      if (found !== undefined) {
        return found;
      }
    }

    return undefined;
  }
}
