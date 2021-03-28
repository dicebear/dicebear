import type Random from '@dicebear/avatars/lib/random';
import type { Options, HairColor } from '../options';
import getOption from './getOption';
import { hair } from '../colors';
import { arrayUnique } from '../helpers/arrayUnique';

export default function (options: Options, random: Random): string {
  let selected: Array<keyof typeof hair> = [];

  let values: Record<HairColor, Array<keyof typeof hair>> = {
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
    let val = values[key as HairColor];

    if (getOption('hairColor', key, options)) {
      selected.push(...val);
    }
  });

  let picked = random.pickone(arrayUnique(selected));

  return hair[picked];
}
