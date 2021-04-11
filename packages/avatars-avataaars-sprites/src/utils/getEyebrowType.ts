import type { ValuesType } from 'utility-types';
import type Random from '@dicebear/avatars/lib/random';
import type { Options, Eyebrow } from '../options';
import getOption from './getOption';
import { eyebrows } from '../paths';
import { arrayUnique } from '../helpers/arrayUnique';

export default function (options: Options, random: Random): () => string {
  let selected: Array<keyof typeof eyebrows> = [];

  let values: Record<ValuesType<Eyebrow>, Array<keyof typeof eyebrows>> = {
    angry: ['angry'],
    angryNatural: ['angryNatural'],
    default: ['default'],
    defaultNatural: ['defaultNatural'],
    flat: ['flatNatural'],
    flatNatural: ['flatNatural'],
    raised: ['raisedExcited', 'raisedExcitedNatural'],
    raisedExcited: ['raisedExcited'],
    raisedExcitedNatural: ['raisedExcitedNatural'],
    sad: ['sadConcerned', 'sadConcernedNatural'],
    sadConcerned: ['sadConcerned'],
    sadConcernedNatural: ['sadConcernedNatural'],
    unibrow: ['unibrowNatural'],
    unibrowNatural: ['unibrowNatural'],
    up: ['upDown', 'upDownNatural'],
    upDown: ['upDown'],
    upDownNatural: ['upDownNatural'],
    frown: ['frownNatural'],
    frownNatural: ['frownNatural'],
  };

  Object.keys(values).forEach((key) => {
    let val = values[key as ValuesType<Eyebrow>];

    if (getOption('eyebrow', key, options)) {
      selected.push(...val);
    }
  });

  let picked = random.pickone(arrayUnique(selected));

  return eyebrows[picked];
}
