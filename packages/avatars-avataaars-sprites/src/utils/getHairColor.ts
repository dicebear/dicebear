import type { ValuesType } from 'utility-types';
import type { Options, HairColor } from '../options';
import getOption from './getOption';
import { hair } from '../colors';
import { arrayUnique } from '../helpers/arrayUnique';
import { Prng } from '@dicebear/avatars';

export default function (options: Options, prng: Prng): string {
  let selected: Array<keyof typeof hair> = [];

  let values: Record<ValuesType<HairColor>, Array<keyof typeof hair>> = {
    auburn: ['auburn'],
    black: ['black'],
    blonde: ['blonde'],
    blondeGolden: ['blondeGolden'],
    brown: ['brown'],
    brownDark: ['brownDark'],
    pastel: ['pastelPink'],
    pastelPink: ['pastelPink'],
    platinum: ['platinum'],
    red: ['red'],
    gray: ['silverGray'],
    silverGray: ['silverGray'],
  };

  Object.keys(values).forEach((key) => {
    let val = values[key as ValuesType<HairColor>];

    if (getOption('hairColor', key, options)) {
      selected.push(...val);
    }
  });

  let picked = prng.pick(arrayUnique(selected));

  return hair[picked];
}
