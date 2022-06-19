/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/FCwwMBxsRND9Mbtpg5PUic/%40dicebear%2Florelei?node-id=23%3A4304
 */

import type { Prng } from '@dicebear/core';
import type { Options, ColorPickCollection } from '../types.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getColors({ prng, options }: Props): ColorPickCollection {
  return {
    'eyebrows': prng.pick(options.eyebrowsColor ?? []) ?? 'transparent',
    'eyes': prng.pick(options.eyesColor ?? []) ?? 'transparent',
    'freckles': prng.pick(options.frecklesColor ?? []) ?? 'transparent',
    'glasses': prng.pick(options.glassesColor ?? []) ?? 'transparent',
    'mouth': prng.pick(options.mouthColor ?? []) ?? 'transparent',
    'nose': prng.pick(options.noseColor ?? []) ?? 'transparent',
  }
};
