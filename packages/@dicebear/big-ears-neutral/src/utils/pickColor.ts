import type { Prng } from '@dicebear/core';
import type { ColorGroupCollection, ColorPick } from '../types.js';
import * as colors from '../colors/index.js';

type Props = {
  prng: Prng;
  group: string;
  values?: string[];
};

export function pickColor({ prng, group, values = [] }: Props): ColorPick {
  const colorCollection: ColorGroupCollection = colors;

  if (values.length === 0) {
    values.push('transparent');
  }

  const key = prng.pick(values);

  return {
    name: key,
    value: colorCollection[group][key] ?? key,
  };
}
