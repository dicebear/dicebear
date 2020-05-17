import type { utils } from '@avatars/core';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, prng: utils.prng.IPrng) {
  let skinColor = [];

  if (getOption('skin', 'tanned', options)) {
    skinColor.push('Tanned');
  }

  if (getOption('skin', 'yellow', options)) {
    skinColor.push('Yellow');
  }

  if (getOption('skin', 'pale', options)) {
    skinColor.push('Pale');
  }

  if (getOption('skin', 'light', options)) {
    skinColor.push('Light');
  }

  if (getOption('skin', 'brown', options)) {
    skinColor.push('Brown');
  }

  if (getOption('skin', 'darkBrown', options)) {
    skinColor.push('DarkBrown');
  }

  if (getOption('skin', 'black', options)) {
    skinColor.push('Black');
  }

  return prng.pick(skinColor);
}
