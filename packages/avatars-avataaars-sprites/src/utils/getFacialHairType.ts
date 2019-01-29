import Random from '@dicebear/avatars/lib/random';
import Options from '../options';
import getOption from './getOption';

export default function(options: Options, random: Random) {
  if (false === random.bool(undefined !== options.facialHair ? options.facialHairChance : 10)) {
    return 'Blank';
  }

  let facialHairType = [];

  if (getOption('facialHair', 'medium', options)) {
    facialHairType.push('BeardMedium');
  }

  if (getOption('facialHair', 'light', options)) {
    facialHairType.push('BeardLight');
  }

  if (getOption('facialHair', 'magestic', options)) {
    facialHairType.push('BeardMagestic');
  }

  if (getOption('facialHair', 'fancy', options)) {
    facialHairType.push('MoustacheFancy');
  }

  if (getOption('facialHair', 'magnum', options)) {
    facialHairType.push('MoustacheMagnum');
  }

  return random.pickone(facialHairType);
}
