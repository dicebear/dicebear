import type { Prng } from '@dicebear/core';
import type { Options, ColorPickCollection } from '../types.js';
import { pickColor } from './pickColor.js';

type Props = {
  prng: Prng;
  options: Options;
};

export function getColors({ prng, options }: Props): ColorPickCollection {
  return {
    hair: pickColor({
      prng,
      group: 'hair',
      values: options.hairColor,
    }),
    mouth: pickColor({
      prng,
      group: 'mouth',
      values: options.mouthColor,
    }),
    glasses: pickColor({
      prng,
      group: 'glasses',
      values: options.glassesColor,
    }),
    background: pickColor({
      prng,
      group: 'skin',
      values: options.backgroundColor,
    }),
  };
}
