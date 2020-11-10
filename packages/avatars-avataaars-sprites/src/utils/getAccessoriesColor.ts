import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { palette } from '../colors';

export default function (options: Options, random: Random) {
  let accessoriesColor = [];

  if (getOption('accessoriesColor', 'black', options)) {
    accessoriesColor.push(palette.black);
  }

  if (getOption('accessoriesColor', 'blue', options)) {
    accessoriesColor.push(palette.blue01, palette.blue02, palette.blue03);
  }

  if (getOption('accessoriesColor', 'gray', options)) {
    accessoriesColor.push(palette.gray01, palette.gray02);
  }

  if (getOption('accessoriesColor', 'heather', options)) {
    accessoriesColor.push(palette.heather);
  }

  if (getOption('accessoriesColor', 'pastel', options)) {
    accessoriesColor.push(
      palette.pastelBlue,
      palette.pastelGreen,
      palette.pastelOrange,
      palette.pastelRed,
      palette.pastelYellow
    );
  }

  if (getOption('accessoriesColor', 'pink', options)) {
    accessoriesColor.push(palette.pink);
  }

  if (getOption('accessoriesColor', 'red', options)) {
    accessoriesColor.push(palette.red);
  }

  if (getOption('accessoriesColor', 'white', options)) {
    accessoriesColor.push(palette.white);
  }

  return random.pickone(accessoriesColor);
}
