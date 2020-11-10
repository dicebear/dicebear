import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { palette } from '../colors';

export default function (options: Options, random: Random) {
  let clotheColor = [];

  if (getOption('clothesColor', 'black', options)) {
    clotheColor.push(palette.black);
  }

  if (getOption('clothesColor', 'blue', options)) {
    clotheColor.push(palette.blue01, palette.blue02, palette.blue03);
  }

  if (getOption('clothesColor', 'gray', options)) {
    clotheColor.push(palette.gray01, palette.gray02);
  }

  if (getOption('clothesColor', 'heather', options)) {
    clotheColor.push(palette.heather);
  }

  if (getOption('clothesColor', 'pastel', options)) {
    clotheColor.push(
      palette.pastelBlue,
      palette.pastelGreen,
      palette.pastelOrange,
      palette.pastelRed,
      palette.pastelYellow
    );
  }

  if (getOption('clothesColor', 'pink', options)) {
    clotheColor.push(palette.pink);
  }

  if (getOption('clothesColor', 'red', options)) {
    clotheColor.push(palette.red);
  }

  if (getOption('clothesColor', 'white', options)) {
    clotheColor.push(palette.white);
  }

  return random.pickone(clotheColor);
}
