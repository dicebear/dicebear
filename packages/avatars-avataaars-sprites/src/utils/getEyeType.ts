import type Random from '@dicebear/avatars/lib/random';
import type { Options, Eyes } from '../options';
import getOption from './getOption';
import { eyes } from '../paths';
import { arrayUnique } from '../helpers/arrayUnique';

export default function (options: Options, random: Random): () => string {
  let selected: Array<keyof typeof eyes> = [];

  let values: Record<Eyes, Array<keyof typeof eyes>> = {
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
    let val = values[key as Eyes];

    if (getOption('eyes', key, options)) {
      selected.push(...val);
    }
  });

  let picked = random.pickone(arrayUnique(selected));

  return eyes[picked];
}
