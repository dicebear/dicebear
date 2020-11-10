import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { facialHair } from '../paths';

export default function (options: Options, random: Random) {
  let facialHairType = [];

  if (getOption('facialHair', 'medium', options)) {
    facialHairType.push(facialHair.beardMedium);
  }

  if (getOption('facialHair', 'light', options)) {
    facialHairType.push(facialHair.beardLight);
  }

  if (getOption('facialHair', 'majestic', options)) {
    facialHairType.push(facialHair.beardMagestic);
  }

  if (getOption('facialHair', 'fancy', options)) {
    facialHairType.push(facialHair.moustaceFancy);
  }

  if (getOption('facialHair', 'magnum', options)) {
    facialHairType.push(facialHair.moustacheMagnum);
  }

  let pickedFacialHairType = random.pickone(facialHairType);

  if (false === random.bool(undefined !== options.facialHairChance ? options.facialHairChance : 10)) {
    return undefined;
  }

  return pickedFacialHairType;
}
