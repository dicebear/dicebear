import type Random from '@dicebear/avatars/lib/random';
import type { Options, Accessories } from '../options';
import getOption from './getOption';
import { accessories } from '../paths';
import { arrayUnique } from '../helpers/arrayUnique';

export default function (options: Options, random: Random): ((color: string) => string) | undefined {
  let selected: Array<keyof typeof accessories> = [];

  let values: Accessories[] = ['kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers'];

  values.forEach((val) => {
    if (getOption('accessories', val, options)) {
      selected.push(val);
    }
  });

  let picked = random.pickone(arrayUnique(selected));

  if (false === random.bool(undefined !== options.accessoriesChance ? options.accessoriesChance : 10)) {
    return undefined;
  }

  return accessories[picked];
}
