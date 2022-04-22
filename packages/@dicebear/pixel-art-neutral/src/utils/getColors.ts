import type { Prng } from '@dicebear/core';
import type { Options, ColorPickCollection } from '../types.js';
import { pickColor } from './pickColor.js';

type Props = {
  prng: Prng;
  options: Options;
};

export function getColors({ prng, options }: Props): ColorPickCollection {
  return {
    eyes: pickColor({
      prng,
      group: 'eyes',
      values: options.eyesColor,
    }),
    glasses: pickColor({
      prng,
      group: 'glasses',
      values: options.glassesColor,
    }),
    mouth: pickColor({
      prng,
      group: 'mouth',
      values: options.mouthColor,
    }),
    background: pickColor({
      prng,
      group: 'skin',
      values: options.backgroundColor,
    }),
  };
}
