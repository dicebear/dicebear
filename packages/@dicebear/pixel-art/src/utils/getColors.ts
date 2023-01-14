/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/WTcivb1XPf5ODtyv7ZNnU9
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
    'accessories': convertColor(prng.pick(options.accessoriesColor ?? []) ?? 'transparent'),
    'clothing': convertColor(prng.pick(options.clothingColor ?? []) ?? 'transparent'),
    'eyes': convertColor(prng.pick(options.eyesColor ?? []) ?? 'transparent'),
    'glasses': convertColor(prng.pick(options.glassesColor ?? []) ?? 'transparent'),
    'hair': convertColor(prng.pick(options.hairColor ?? []) ?? 'transparent'),
    'mouth': convertColor(prng.pick(options.mouthColor ?? []) ?? 'transparent'),
    'skin': convertColor(prng.pick(options.skinColor ?? []) ?? 'transparent'),
  }
};
