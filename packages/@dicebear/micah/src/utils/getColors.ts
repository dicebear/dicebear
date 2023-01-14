/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/YHb4ShTgmO8Lqhkz1plLfL
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
    'base': convertColor(prng.pick(options.baseColor ?? []) ?? 'transparent'),
    'earring': convertColor(prng.pick(options.earringColor ?? []) ?? 'transparent'),
    'eyeShadow': convertColor(prng.pick(options.eyeShadowColor ?? []) ?? 'transparent'),
    'eyebrows': convertColor(prng.pick(options.eyebrowsColor ?? []) ?? 'transparent'),
    'facialHair': convertColor(prng.pick(options.facialHairColor ?? []) ?? 'transparent'),
    'glasses': convertColor(prng.pick(options.glassesColor ?? []) ?? 'transparent'),
    'hair': convertColor(prng.pick(options.hairColor ?? []) ?? 'transparent'),
    'mouth': convertColor(prng.pick(options.mouthColor ?? []) ?? 'transparent'),
    'shirt': convertColor(prng.pick(options.shirtColor ?? []) ?? 'transparent'),
    'eyes': convertColor(prng.pick(options.eyesColor ?? []) ?? 'transparent'),
  }
};
