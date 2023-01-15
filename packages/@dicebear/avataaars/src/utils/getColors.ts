/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h
 */

import type { Prng } from '@dicebear/core';
import type { Options, ColorPickCollection } from '../types.js';
import { convertColor } from './convertColor.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getColors({ prng, options }: Props): ColorPickCollection {
  return {
    'accessories': convertColor(prng.pick(options.accessoriesColor ?? [], 'transparent')),
    'clothes': convertColor(prng.pick(options.clothesColor ?? [], 'transparent')),
    'hat': convertColor(prng.pick(options.hatColor ?? [], 'transparent')),
    'hair': convertColor(prng.pick(options.hairColor ?? [], 'transparent')),
    'skin': convertColor(prng.pick(options.skinColor ?? [], 'transparent')),
    'facialHair': convertColor(prng.pick(options.facialHairColor ?? [], 'transparent')),
    'background': convertColor(prng.pick(options.backgroundColor ?? [], 'transparent')),
  }
};
