import type { Prng } from '@dicebear/core';
import type { Options, ColorPickCollection } from '../types.js';
import { pickColor } from './pickColor.js';

type Props = {
  prng: Prng;
  options: Options;
};

export function getColors({ prng, options }: Props): ColorPickCollection {
  return {
    accessories: pickColor({
      prng,
      group: 'accessories',
      values: options.accessoriesColor,
    }),
    clothing: pickColor({
      prng,
      group: 'clothing',
      values: options.clothingColor,
    }),
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
    skin: pickColor({
      prng,
      group: 'skin',
      values: options.skinColor,
    }),
  };
}
