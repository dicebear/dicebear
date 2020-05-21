import type { utils } from '@avatars/core';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, prng: utils.prng.IPrng) {
  let facialHairType = [];

  if (getOption('facialHair', 'medium', options)) {
    facialHairType.push('BeardMedium');
  }

  if (getOption('facialHair', 'light', options)) {
    facialHairType.push('BeardLight');
  }

  if (getOption('facialHair', 'majestic', options)) {
    facialHairType.push('BeardMajestic');
  }

  if (getOption('facialHair', 'fancy', options)) {
    facialHairType.push('MoustacheFancy');
  }

  if (getOption('facialHair', 'magnum', options)) {
    facialHairType.push('MoustacheMagnum');
  }

  let pickedFacialHairType = prng.pick(facialHairType);

  if (false === prng.bool(undefined !== options.facialHairProbability ? options.facialHairProbability : 10)) {
    return 'Blank';
  }

  return pickedFacialHairType;
}
