import type Random from '@dicebear/avatars/lib/random';
import type { Options, Color } from '../options';
import getOption from './getOption';
import { palette } from '../colors';
import { arrayUnique } from '../helpers/arrayUnique';

export default function (options: Options, random: Random): string {
  let selected: Array<keyof typeof palette> = [];

  let values: Record<Color, Array<keyof typeof palette>> = {
    black: ['black'],
    blue: ['blue01', 'blue02', 'blue03'],
    blue01: ['blue01'],
    blue02: ['blue02'],
    blue03: ['blue03'],
    gray: ['gray01', 'gray02'],
    gray01: ['gray01'],
    gray02: ['gray02'],
    heather: ['heather'],
    pastel: ['pastelBlue', 'pastelGreen', 'pastelOrange', 'pastelRed', 'pastelYellow'],
    pastelBlue: ['pastelBlue'],
    pastelGreen: ['pastelGreen'],
    pastelOrange: ['pastelOrange'],
    pastelRed: ['pastelRed'],
    pastelYellow: ['pastelYellow'],
    pink: ['pink'],
    red: ['red'],
    white: ['white'],
  };

  Object.keys(values).forEach((key) => {
    let val = values[key as Color];

    if (getOption('accessoriesColor', key, options)) {
      selected.push(...val);
    }
  });

  let picked = random.pickone(arrayUnique(selected));

  return palette[picked];
}
