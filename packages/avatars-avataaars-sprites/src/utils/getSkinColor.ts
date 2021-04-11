import type { ValuesType } from 'utility-types';
import type Random from '@dicebear/avatars/lib/random';
import type { Options, Skin } from '../options';
import getOption from './getOption';
import { skin } from '../colors';

export default function (options: Options, random: Random): string {
  let selected: Array<keyof typeof skin> = [];

  let values: Array<ValuesType<Skin>> = ['tanned', 'yellow', 'pale', 'light', 'brown', 'darkBrown', 'black'];

  values.forEach((val) => {
    if (getOption('skin', val, options)) {
      selected.push(val);
    }
  });

  let picked = random.pickone(selected);

  return skin[picked];
}
