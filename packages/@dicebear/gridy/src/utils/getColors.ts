import type { Prng } from '@dicebear/core';
import type { Options } from '../options';
import type { ColorPickCollection } from '../static-types';
import { pickColor } from './pickColor';

type Props = {
  prng: Prng;
  options: Options;
};

export function getColors({ prng, options }: Props): ColorPickCollection {
  return {
    body: pickColor({
      prng,
      group: 'body',
      values: options.bodyColor,
    }),
    eyes: pickColor({
      prng,
      group: 'eyes',
      values: options.eyesColor,
    }),
    mouth: pickColor({
      prng,
      group: 'mouth',
      values: options.mouthColor,
    }),
  };
}
