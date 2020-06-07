import { utils } from '@avatars/core';
import Options from '../options';
import * as filter from './filter';

export function skin(prng: utils.prng.IPrng, options: Options) {
  let colors = filter.byOptionName(options, 'skinColor', {
    tanned: '#FD9841',
    yellow: '#F9D562',
    pale: '#FFDBB4',
    light: '#EDB98A',
    brown: '#D08B5B',
    darkBrown: '#AE5D29',
    black: '#614335',
  });

  return prng.pick(Object.values(colors));
}
