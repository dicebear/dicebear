import type { utils } from '@avatars/core';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, prng: utils.prng.IPrng) {
  let clotheColor = [];

  if (getOption('clothesColor', 'black', options)) {
    clotheColor.push('black');
  }

  if (getOption('clothesColor', 'blue', options)) {
    clotheColor.push('Blue01', 'Blue02', 'Blue03');
  }

  if (getOption('clothesColor', 'gray', options)) {
    clotheColor.push('Gray01', 'Gray02');
  }

  if (getOption('clothesColor', 'heather', options)) {
    clotheColor.push('Heather');
  }

  if (getOption('clothesColor', 'pastel', options)) {
    clotheColor.push('PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow');
  }

  if (getOption('clothesColor', 'pink', options)) {
    clotheColor.push('Pink');
  }

  if (getOption('clothesColor', 'red', options)) {
    clotheColor.push('Red');
  }

  if (getOption('clothesColor', 'white', options)) {
    clotheColor.push('White');
  }

  return prng.pick(clotheColor);
}
