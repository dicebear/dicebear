/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/TArMPV7hXUhdCbfEFs3Pfm
 */

import type { Prng } from '@dicebear/core';
import type { Options, ColorPickCollection } from '../types.js';
import { convertColor } from './convertColor.js';

type Props = {
  prng: Prng;
  options: Options;
};

export function getColors({ prng, options }: Props): ColorPickCollection {
  return {
    skin: convertColor(prng.pick(options.skinColor ?? [], 'transparent')),
    clothing: convertColor(
      prng.pick(options.clothingColor ?? [], 'transparent')
    ),
    headContrast: convertColor(
      prng.pick(options.headContrastColor ?? [], 'transparent')
    ),
  };
}
