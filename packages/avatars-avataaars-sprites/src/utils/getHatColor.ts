import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { palette } from '../colors';

export default function (options: Options, random: Random) {
  let hatColor = [];

  if (getOption('hatColor', 'black', options)) {
    hatColor.push(palette.black);
  }

  if (getOption('hatColor', 'blue', options)) {
    hatColor.push(palette.blue01, palette.blue02, palette.blue03);
  }

  if (getOption('hatColor', 'gray', options)) {
    hatColor.push(palette.gray01, palette.gray02);
  }

  if (getOption('hatColor', 'heather', options)) {
    hatColor.push(palette.heather);
  }

  if (getOption('hatColor', 'pastel', options)) {
    hatColor.push(
      palette.pastelBlue,
      palette.pastelGreen,
      palette.pastelOrange,
      palette.pastelRed,
      palette.pastelYellow
    );
  }

  if (getOption('hatColor', 'pink', options)) {
    hatColor.push(palette.pink);
  }

  if (getOption('hatColor', 'red', options)) {
    hatColor.push(palette.red);
  }

  if (getOption('hatColor', 'white', options)) {
    hatColor.push(palette.white);
  }

  return random.pickone(hatColor);
}
