import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { accessories } from '../paths';

export default function (options: Options, random: Random) {
  let accessoriesType = [];

  if (getOption('accessories', 'kurt', options)) {
    accessoriesType.push(accessories.kurt);
  }

  if (getOption('accessories', 'prescription01', options)) {
    accessoriesType.push(accessories.prescription01);
  }

  if (getOption('accessories', 'prescription02', options)) {
    accessoriesType.push(accessories.prescription02);
  }

  if (getOption('accessories', 'round', options)) {
    accessoriesType.push(accessories.round);
  }

  if (getOption('accessories', 'sunglasses', options)) {
    accessoriesType.push(accessories.sunglasses);
  }

  if (getOption('accessories', 'wayfarers', options)) {
    accessoriesType.push(accessories.wayfarers);
  }

  let pickedAccessoriesType = random.pickone(accessoriesType);

  if (false === random.bool(undefined !== options.accessoriesChance ? options.accessoriesChance : 10)) {
    return undefined;
  }

  return pickedAccessoriesType;
}
