import type { ValuesType } from 'utility-types';
import type { Options, ClothesColor } from '../options';
import getOption from './getOption';
import { palette } from '../colors';
import { arrayUnique } from '../helpers/arrayUnique';
import { Prng } from '@dicebear/avatars';

export default function (options: Options, prng: Prng): string {
  let selected: Array<keyof typeof palette> = [];

  let values: Record<ValuesType<ClothesColor>, Array<keyof typeof palette>> = {
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
    let val = values[key as ValuesType<ClothesColor>];

    if (getOption('clothesColor', key, options)) {
      selected.push(...val);
    }
  });

  let picked = prng.pick(arrayUnique(selected));

  return palette[picked];
}
