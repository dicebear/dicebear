import Random from '@dicebear/avatars/lib/random';
import Options from '../options';
import getOption from './getOption';

export default function(options: Options, random: Random) {
  let hairColor = [];

  if (getOption('hairColor', 'auburn', options)) {
    hairColor.push('Auburn');
  }

  if (getOption('hairColor', 'black', options)) {
    hairColor.push('Black');
  }

  if (getOption('hairColor', 'blonde', options)) {
    hairColor.push('Blonde', 'BlondeGolden');
  }

  if (getOption('hairColor', 'brown', options)) {
    hairColor.push('Brown', 'BrownDark');
  }

  if (getOption('hairColor', 'pastel', options)) {
    hairColor.push('PastelPink');
  }

  if (getOption('hairColor', 'platinum', options)) {
    hairColor.push('Platinum');
  }

  if (getOption('hairColor', 'red', options)) {
    hairColor.push('Red');
  }

  if (getOption('hairColor', 'gray', options)) {
    hairColor.push('SilverGray');
  }

  return random.pickone(hairColor);
}
