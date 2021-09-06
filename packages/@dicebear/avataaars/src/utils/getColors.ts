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
    clothes: pickColor({
      prng,
      group: 'clothes',
      values: options.clothesColor,
    }),
    hat: pickColor({
      prng,
      group: 'hat',
      values: options.hatColor,
    }),
    hair: pickColor({
      prng,
      group: 'hair',
      values: options.hairColor,
    }),
    skin: pickColor({
      prng,
      group: 'skin',
      values: options.skinColor,
    }),
    facialHair: pickColor({
      prng,
      group: 'facialHair',
      values: options.facialHairColor,
    }),
    background: pickColor({
      prng,
      group: 'background',
      values: options.backgroundColor,
    }),
  };
}
