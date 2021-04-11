import type { ValuesType } from 'utility-types';
import type Random from '@dicebear/avatars/lib/random';
import type { Options, Mouth } from '../options';
import getOption from './getOption';
import { mouth } from '../paths';
import { arrayUnique } from '../helpers/arrayUnique';

export default function (options: Options, random: Random): () => string {
  let selected: Array<keyof typeof mouth> = [];

  let values: Record<ValuesType<Mouth>, Array<keyof typeof mouth>> = {
    concerned: ['concerned'],
    default: ['default'],
    disbelief: ['disbelief'],
    eating: ['eating'],
    grimace: ['grimace'],
    sad: ['sad'],
    scream: ['screamOpen'],
    screamOpen: ['screamOpen'],
    serious: ['serious'],
    smile: ['smile'],
    tongue: ['tongue'],
    twinkle: ['twinkle'],
    vomit: ['vomit'],
  };

  Object.keys(values).forEach((key) => {
    let val = values[key as ValuesType<Mouth>];

    if (getOption('mouth', key, options)) {
      selected.push(...val);
    }
  });

  let picked = random.pickone(arrayUnique(selected));

  return mouth[picked];
}
