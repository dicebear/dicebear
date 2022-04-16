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
    skin: pickColor({
      prng,
      group: 'skin',
      values: options.skinColor,
    }),
    earrings: pickColor({
      prng,
      group: 'earrings',
      values: options.earringsColor,
    }),
    eyebrows: pickColor({
      prng,
      group: 'eyebrows',
      values: options.eyebrowsColor,
    }),
    eyes: pickColor({
      prng,
      group: 'eyes',
      values: options.eyesColor,
    }),
    freckles: pickColor({
      prng,
      group: 'freckles',
      values: options.frecklesColor,
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
    nose: pickColor({
      prng,
      group: 'nose',
      values: options.noseColor,
    }),
    hairAccessories: pickColor({
      prng,
      group: 'hairAccessories',
      values: options.hairAccessoriesColor,
    }),
  };
}
