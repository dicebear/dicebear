import type { utils } from '@avatars/core';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, prng: utils.prng.IPrng) {
  let eyebrowType = [];

  if (getOption('eyebrow', 'angry', options)) {
    eyebrowType.push('Angry', 'AngryNatural');
  }

  if (getOption('eyebrow', 'default', options)) {
    eyebrowType.push('Default', 'DefaultNatural');
  }

  if (getOption('eyebrow', 'flat', options)) {
    eyebrowType.push('FlatNatural');
  }

  if (getOption('eyebrow', 'raised', options)) {
    eyebrowType.push('RaisedExcited', 'RaisedExcitedNatural');
  }

  if (getOption('eyebrow', 'sad', options)) {
    eyebrowType.push('SadConcerned', 'SadConcernedNatural');
  }

  if (getOption('eyebrow', 'unibrow', options)) {
    eyebrowType.push('UnibrowNatural');
  }

  if (getOption('eyebrow', 'up', options)) {
    eyebrowType.push('UpDown', 'UpDownNatural');
  }

  return prng.pick(eyebrowType);
}
