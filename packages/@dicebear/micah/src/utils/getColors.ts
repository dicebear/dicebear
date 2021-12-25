import type { Prng } from '@dicebear/core';
import type { Options, ColorPickCollection } from '../types.js';
import { pickColor } from './pickColor.js';

type Props = {
  prng: Prng;
  options: Options;
};

export function getColors({ prng, options }: Props): ColorPickCollection {
  return {
    base: pickColor({
      prng,
      group: 'base',
      values: options.baseColor,
    }),
    earring: pickColor({
      prng,
      group: 'earring',
      values: options.earringColor,
    }),
    eyeShadow: pickColor({
      prng,
      group: 'eyeShadow',
      values: options.eyeShadowColor,
    }),
    eyebrow: pickColor({
      prng,
      group: 'eyebrow',
      values: options.eyebrowColor,
    }),
    facialHair: pickColor({
      prng,
      group: 'facialHair',
      values: options.facialHairColor,
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
    shirt: pickColor({
      prng,
      group: 'shirt',
      values: options.shirtColor,
    }),
    eyes: pickColor({
      prng,
      group: 'eyes',
      values: options.eyesColor,
    }),
  };
}
