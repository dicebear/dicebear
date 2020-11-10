import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { hair } from '../colors';

export default function (options: Options, random: Random) {
  let facialHairColor = [];

  if (getOption('facialHairColor', 'auburn', options)) {
    facialHairColor.push(hair.auburn);
  }

  if (getOption('facialHairColor', 'black', options)) {
    facialHairColor.push(hair.black);
  }

  if (getOption('facialHairColor', 'blonde', options)) {
    facialHairColor.push(hair.blonde, hair.blondeGolden);
  }

  if (getOption('facialHairColor', 'brown', options)) {
    facialHairColor.push(hair.brown, hair.brownDark);
  }

  if (getOption('facialHairColor', 'pastel', options)) {
    facialHairColor.push(hair.pastelPink);
  }

  if (getOption('facialHairColor', 'platinum', options)) {
    facialHairColor.push(hair.platinum);
  }

  if (getOption('facialHairColor', 'red', options)) {
    facialHairColor.push(hair.red);
  }

  if (getOption('facialHairColor', 'gray', options)) {
    facialHairColor.push(hair.silverGray);
  }

  return random.pickone(facialHairColor);
}
