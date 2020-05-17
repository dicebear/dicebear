import type { utils } from '@avatars/core';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, prng: utils.prng.IPrng) {
  let facialHairColor = [];

  if (getOption('facialHairColor', 'auburn', options)) {
    facialHairColor.push('Auburn');
  }

  if (getOption('facialHairColor', 'black', options)) {
    facialHairColor.push('Black');
  }

  if (getOption('facialHairColor', 'blonde', options)) {
    facialHairColor.push('Blonde', 'BlondeGolden');
  }

  if (getOption('facialHairColor', 'brown', options)) {
    facialHairColor.push('Brown', 'BrownDark');
  }

  if (getOption('facialHairColor', 'platinum', options)) {
    facialHairColor.push('Platinum');
  }

  if (getOption('facialHairColor', 'red', options)) {
    facialHairColor.push('Red');
  }

  return prng.pick(facialHairColor);
}
