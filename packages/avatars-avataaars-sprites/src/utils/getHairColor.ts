import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { hair } from '../colors';

export default function (options: Options, random: Random) {
  let hairColor = [];

  if (getOption('hairColor', 'auburn', options)) {
    hairColor.push(hair.auburn);
  }

  if (getOption('hairColor', 'black', options)) {
    hairColor.push(hair.black);
  }

  if (getOption('hairColor', 'blonde', options)) {
    hairColor.push(hair.blonde, hair.blondeGolden);
  }

  if (getOption('hairColor', 'brown', options)) {
    hairColor.push(hair.brown, hair.brownDark);
  }

  if (getOption('hairColor', 'pastel', options)) {
    hairColor.push(hair.pastelPink);
  }

  if (getOption('hairColor', 'platinum', options)) {
    hairColor.push(hair.platinum);
  }

  if (getOption('hairColor', 'red', options)) {
    hairColor.push(hair.red);
  }

  if (getOption('hairColor', 'gray', options)) {
    hairColor.push(hair.silverGray);
  }

  return random.pickone(hairColor);
}
