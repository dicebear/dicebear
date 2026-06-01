/**
 * Formats a number for SVG output, rounded to at most 5 decimal places.
 *
 * Rounding to a fixed precision keeps the output bounded and identical across
 * the JS, PHP, and Python ports: every value becomes a multiple of 1e-5 in the
 * SVG coordinate range, which has no exponential form, so the result is built
 * from integer arithmetic (no locale- or language-specific float stringifying).
 * Five decimals is far below sub-pixel precision for any realistic canvas.
 */
export class Number {
  static format(value: number): string {
    // `value !== value` and the Infinity literals avoid referencing the global
    // `Number`, which this class shadows within the module.
    if (value !== value) {
      return 'NaN';
    }

    if (value === Infinity) {
      return 'Infinity';
    }

    if (value === -Infinity) {
      return '-Infinity';
    }

    let scaled = Math.round(value * 100000);
    const sign = scaled < 0 ? '-' : '';
    scaled = Math.abs(scaled);

    const integerPart = Math.floor(scaled / 100000);
    const fraction = String(scaled % 100000)
      .padStart(5, '0')
      .replace(/0+$/, '');

    return `${sign}${integerPart}${fraction ? `.${fraction}` : ''}`;
  }
}
