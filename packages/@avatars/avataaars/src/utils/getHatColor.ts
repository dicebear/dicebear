import type { utils } from '@avatars/core';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, prng: utils.prng.IPrng) {
  let hatColor = [];

  if (getOption('hatColor', 'black', options)) {
    hatColor.push('black');
  }

  if (getOption('hatColor', 'blue', options)) {
    hatColor.push('Blue01', 'Blue02', 'Blue03');
  }

  if (getOption('hatColor', 'gray', options)) {
    hatColor.push('Gray01', 'Gray02');
  }

  if (getOption('hatColor', 'heather', options)) {
    hatColor.push('Heather');
  }

  if (getOption('hatColor', 'pastel', options)) {
    hatColor.push('PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow');
  }

  if (getOption('hatColor', 'pink', options)) {
    hatColor.push('Pink');
  }

  if (getOption('hatColor', 'red', options)) {
    hatColor.push('Red');
  }

  if (getOption('hatColor', 'white', options)) {
    hatColor.push('White');
  }

  return prng.pick(hatColor);
}
