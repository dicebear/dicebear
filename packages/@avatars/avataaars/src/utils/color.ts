import { utils } from '@avatars/core';
import Options from '../options';
import * as filter from './filter';
import * as map from './map';

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

export function clothing(prng: utils.prng.IPrng, options: Options) {
  let colors = map.flatten(
    filter.byOptionName(options, 'clothesColor', {
      black: ['#262E33'],
      blue: ['#65C9FF', '#5199E4', '#25557C'],
      gray: ['#E5E5E5', '#929598'],
      heather: ['#3C4F5C'],
      pastel: ['#B1E2FF', '#A7FFC4', '#FFDEB5', '#FFAFB9', '#FFFFB1'],
      pink: ['#FF488E'],
      red: ['#FF5C5C'],
      white: ['#FFFFFF'],
    })
  );

  return prng.pick(colors);
}
