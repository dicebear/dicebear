import type { ValuesType } from 'utility-types';
import type { Options, Skin } from '../options';
import getOption from './getOption';
import { skin } from '../colors';
import { Prng } from '@dicebear/avatars';

export default function (options: Options, prng: Prng): string {
  let selected: Array<keyof typeof skin> = [];

  let values: Array<ValuesType<Skin>> = ['tanned', 'yellow', 'pale', 'light', 'brown', 'darkBrown', 'black'];

  values.forEach((val) => {
    if (getOption('skin', val, options)) {
      selected.push(val);
    }
  });

  let picked = prng.pick(selected);

  return skin[picked];
}
