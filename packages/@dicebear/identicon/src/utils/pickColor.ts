import type { Prng } from '@dicebear/avatars';
import type { ColorGroupCollection, ColorPick } from '../static-types';

import * as colors from '../colors';

export function pickColor(prng: Prng, group: string, values: string[]): ColorPick {
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
