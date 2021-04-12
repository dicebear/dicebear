import type { ValuesType } from 'utility-types';
import type { Options, Eyes } from '../options';
import getOption from './getOption';
import { eyes } from '../paths';
import { arrayUnique } from '../helpers/arrayUnique';
import { Prng } from '@dicebear/avatars';

export default function (options: Options, prng: Prng): () => string {
  let selected: Array<keyof typeof eyes> = [];

  let values: Record<ValuesType<Eyes>, Array<keyof typeof eyes>> = {
    close: ['closed'],
    closed: ['closed'],
    cry: ['cry'],
    default: ['default'],
    dizzy: ['xDizzy'],
    xDizzy: ['xDizzy'],
    roll: ['eyeRoll'],
    eyeRoll: ['eyeRoll'],
    happy: ['happy'],
    hearts: ['hearts'],
    side: ['side'],
    squint: ['squint'],
    surprised: ['surprised'],
    wink: ['wink'],
    winkWacky: ['winkWacky'],
  };

  Object.keys(values).forEach((key) => {
    let val = values[key as ValuesType<Eyes>];

    if (getOption('eyes', key, options)) {
      selected.push(...val);
    }
  });

  let picked = prng.pick(arrayUnique(selected));

  return eyes[picked];
}
