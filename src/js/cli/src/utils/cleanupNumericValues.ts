/*!
 * @license MIT
 * This file is adapted from SVGO's `cleanupNumericValues` plugin
 * (https://github.com/svg/svgo), extended to keep normalized 0..1 attributes
 * (opacity, gradient stop offset) at a usable minimum precision.
 *
 * Copyright (c) Kir Belevich
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import type { CustomPlugin } from 'svgo';

const regNumericValues =
  /^([-+]?\d*\.?\d+([eE][-+]?\d+)?)(px|pt|pc|mm|cm|m|in|ft|em|ex|%)?$/;

const absoluteLengths: Record<string, number> = {
  // relative to px
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  in: 96,
  pt: 4 / 3,
  pc: 16,
  px: 1,
};

// These attributes hold values normalized to the 0..1 range, so rounding them
// to the configured precision (e.g. 0) would collapse them to 0 or 1 and make
// them useless. They therefore keep at least `minNormalizedPrecision` decimals.
const normalizedAttributes = new Set([
  'opacity',
  'fill-opacity',
  'stroke-opacity',
  'stop-opacity',
  'flood-opacity',
  'offset',
]);

// Remove floating-point numbers leading zero (e.g. 0.5 -> .5, -0.5 -> -.5).
function removeLeadingZero(value: number): string {
  const strValue = value.toString();

  if (0 < value && value < 1 && strValue.startsWith('0')) {
    return strValue.slice(1);
  }

  if (-1 < value && value < 0 && strValue[1] === '0') {
    return strValue[0] + strValue.slice(2);
  }

  return strValue;
}

/**
 * Drop-in replacement for SVGO's `cleanupNumericValues` plugin that rounds
 * numeric attribute values to the configured precision, but keeps normalized
 * 0..1 attributes (opacity, gradient stop offset) at a usable minimum
 * precision so they survive precision 0.
 */
export function cleanupNumericValues(params: {
  floatPrecision: number;
  minNormalizedPrecision?: number;
}): CustomPlugin {
  const { floatPrecision, minNormalizedPrecision = 2 } = params;
  const normalizedPrecision = Math.max(floatPrecision, minNormalizedPrecision);

  return {
    name: 'cleanupNumericValues',
    fn: () => ({
      element: {
        enter: (node) => {
          if (node.attributes.viewBox != null) {
            const nums = node.attributes.viewBox.split(/\s,?\s*|,\s*/g);
            node.attributes.viewBox = nums
              .map((value) => {
                const num = Number(value);
                return Number.isNaN(num)
                  ? value
                  : Number(num.toFixed(floatPrecision));
              })
              .join(' ');
          }

          for (const [name, value] of Object.entries(node.attributes)) {
            // The `version` attribute is a text string and cannot be rounded
            if (name === 'version') {
              continue;
            }

            const match = value.match(regNumericValues);

            // if attribute value matches regNumericValues
            if (match) {
              const precision = normalizedAttributes.has(name)
                ? normalizedPrecision
                : floatPrecision;

              // round it to the fixed precision
              let num = Number(Number(match[1]).toFixed(precision));
              let units = match[3] || '';

              // convert absolute values to pixels
              if (units !== '' && units in absoluteLengths) {
                const pxNum = Number(
                  (absoluteLengths[units] * Number(match[1])).toFixed(
                    precision,
                  ),
                );
                if (pxNum.toString().length < match[0].length) {
                  num = pxNum;
                  units = 'px';
                }
              }

              // and remove leading zero
              const str = removeLeadingZero(num);

              // remove default 'px' units
              if (units === 'px') {
                units = '';
              }

              node.attributes[name] = str + units;
            }
          }
        },
      },
    }),
  };
}
