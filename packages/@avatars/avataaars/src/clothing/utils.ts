import type Options from '../options';
import { utils } from '@avatars/core';
import * as filter from '../utils/filter';

export function color(prng: utils.prng.IPrng, options: Options) {
  let colors = filter.byOptionName(options, 'clothesColor', {
    black: ['#262E33'],
    blue: ['#65C9FF', '#5199E4', '#25557C'],
    gray: ['#E5E5E5', '#929598'],
    heather: ['#3C4F5C'],
    pastel: ['#B1E2FF', '#A7FFC4', '#FFDEB5', '#FFAFB9', '#FFFFB1'],
    pink: ['#FF488E'],
    red: ['#FF5C5C'],
    white: ['#FFFFFF'],
  });

  return prng.pick(prng.pick(Object.values(colors)));
}
