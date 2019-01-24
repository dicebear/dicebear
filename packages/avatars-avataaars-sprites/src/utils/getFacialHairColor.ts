import Random from '@dicebear/avatars/lib/random';
import Options from '../options';
import getOption from './getOption';

export default function(options: Options, random: Random) {
  let facialHairColor = [];

  if (getOption('facialHairColor', 'medium', options)) {
    facialHairColor.push('BeardMedium');
  }

  if (getOption('facialHairColor', 'light', options)) {
    facialHairColor.push('BeardLight');
  }

  if (getOption('facialHairColor', 'magestic', options)) {
    facialHairColor.push('BeardMagestic');
  }

  if (getOption('facialHairColor', 'fancy', options)) {
    facialHairColor.push('MoustacheFancy');
  }

  if (getOption('facialHairColor', 'magnum', options)) {
    facialHairColor.push('MoustacheMagnum');
  }

  return random.pickone(facialHairColor);
}
