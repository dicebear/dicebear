import type { utils } from '@avatars/core';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, prng: utils.prng.IPrng) {
  let accessoriesType = [];

  if (getOption('accessories', 'kurt', options)) {
    accessoriesType.push('Kurt');
  }

  if (getOption('accessories', 'prescription01', options)) {
    accessoriesType.push('Prescription01');
  }

  if (getOption('accessories', 'prescription02', options)) {
    accessoriesType.push('Prescription02');
  }

  if (getOption('accessories', 'round', options)) {
    accessoriesType.push('Round');
  }

  if (getOption('accessories', 'sunglasses', options)) {
    accessoriesType.push('Sunglasses');
  }

  if (getOption('accessories', 'wayfarers', options)) {
    accessoriesType.push('Wayfarers');
  }

  let pickedAccessoriesType = prng.pick(accessoriesType);

  if (false === prng.bool(undefined !== options.accessoriesProbability ? options.accessoriesProbability : 10)) {
    return 'Blank';
  }

  return pickedAccessoriesType;
}
