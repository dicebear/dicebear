/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/ZHPv3t2L6Asuuql9ND4q1L/%40dicebear%2Fcroodles?node-id=1%3A357
 */

import type { Prng } from '@dicebear/core';
import type { Options, ColorPickCollection } from '../types.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getColors({ prng, options }: Props): ColorPickCollection {
  return {
    'top': prng.pick(options.topColor ?? []) ?? 'transparent',
    'base': prng.pick(options.baseColor ?? []) ?? 'transparent',
  }
};
