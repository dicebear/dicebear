/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/bX8ZT8jK2fo5Uy8G6j2Qic/%40dicebear%2Fshapes
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
    'shape1': convertColor(prng.pick(options.shape1Color ?? [], 'transparent')),
    'shape2': convertColor(prng.pick(options.shape2Color ?? [], 'transparent')),
    'shape3': convertColor(prng.pick(options.shape3Color ?? [], 'transparent')),
  }
};
