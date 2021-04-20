import type { ValuesType } from 'utility-types';
import type { Options, Top } from '../options';
import getOption from './getOption';
import { top } from '../paths';
import { Prng } from '@dicebear/avatars';

export default function (
  options: Options,
  prng: Prng
): { path: (color: string) => string; isHat: boolean; zIndex: number } {
  let selected: Array<keyof typeof top> = [];

  let values: Record<ValuesType<Top>, Array<keyof typeof top>> = {
    longHair: [
      'bigHair',
      'bob',
      'bun',
      'curly',
      'curvy',
      'dreads',
      'frida',
      'fro',
      'froAndBand',
      'miaWallace',
      'longButNotTooLong',
      'shavedSides',
      'straight01',
      'straight02',
      'straightAndStrand',
    ],
    bigHair: ['bigHair'],
    bob: ['bob'],
    bun: ['bun'],
    curly: ['curly'],
    curvy: ['curvy'],
    dreads: ['dreads'],
    frida: ['frida'],
    fro: ['fro'],
    froAndBand: ['froAndBand'],
    miaWallace: ['miaWallace'],
    longButNotTooLong: ['longButNotTooLong'],
    shavedSides: ['shavedSides'],
    straight01: ['straight01'],
    straight02: ['straight02'],
    straightAndStrand: ['straightAndStrand'],
    shortHair: [
      'dreads01',
      'dreads02',
      'frizzle',
      'shaggy',
      'shaggyMullet',
      'shortCurly',
      'shortFlat',
      'shortRound',
      'shortWaved',
      'sides',
      'theCaesar',
      'theCaesarAndSidePart',
    ],
    dreads01: ['dreads01'],
    dreads02: ['dreads02'],
    frizzle: ['frizzle'],
    shaggy: ['shaggy'],
    shaggyMullet: ['shaggyMullet'],
    shortCurly: ['shortCurly'],
    shortFlat: ['shortFlat'],
    shortRound: ['shortRound'],
    shortWaved: ['shortWaved'],
    sides: ['sides'],
    theCaesar: ['theCaesar'],
    theCaesarAndSidePart: ['theCaesarAndSidePart'],
    eyepatch: ['eyepatch'],
    hat: ['hat'],
    winterHat01: ['winterHat01'],
    winterHat02: ['winterHat02'],
    winterHat03: ['winterHat03'],
    winterHat04: ['winterHat04'],
    hijab: ['hijab'],
    turban: ['turban'],
  };

  Object.keys(values).forEach((key) => {
    let val = values[key as ValuesType<Top>];

    if (getOption('top', key, options)) {
      selected.push(...val);
    }
  });

  let picked = prng.pick(selected);

  if (false === prng.bool(undefined !== options.topChance ? options.topChance : 100)) {
    return { path: () => '', isHat: false, zIndex: 0 };
  }

  return top[picked];
}
