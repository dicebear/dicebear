import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { skin } from '../colors';

export default function (options: Options, random: Random) {
  let skinColor = [];

  if (getOption('skin', 'tanned', options)) {
    skinColor.push(skin.tanned);
  }

  if (getOption('skin', 'yellow', options)) {
    skinColor.push(skin.yellow);
  }

  if (getOption('skin', 'pale', options)) {
    skinColor.push(skin.pale);
  }

  if (getOption('skin', 'light', options)) {
    skinColor.push(skin.light);
  }

  if (getOption('skin', 'brown', options)) {
    skinColor.push(skin.brown);
  }

  if (getOption('skin', 'darkBrown', options)) {
    skinColor.push(skin.darkBrown);
  }

  if (getOption('skin', 'black', options)) {
    skinColor.push(skin.black);
  }

  return random.pickone(skinColor);
}
