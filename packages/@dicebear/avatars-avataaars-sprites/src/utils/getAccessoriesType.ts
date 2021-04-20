import type { ValuesType } from 'utility-types';
import type { Options, Accessories } from '../options';
import getOption from './getOption';
import { accessories } from '../paths';
import { arrayUnique } from '../helpers/arrayUnique';
import { Prng } from '@dicebear/avatars';

export default function (options: Options, prng: Prng): ((color: string) => string) | undefined {
  let selected: Array<keyof typeof accessories> = [];

  let values: ValuesType<Accessories>[] = ['kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers'];

  values.forEach((val) => {
    if (getOption('accessories', val, options)) {
      selected.push(val);
    }
  });

  let picked = prng.pick(arrayUnique(selected));

  if (false === prng.bool(undefined !== options.accessoriesChance ? options.accessoriesChance : 10)) {
    return undefined;
  }

  return accessories[picked];
}
