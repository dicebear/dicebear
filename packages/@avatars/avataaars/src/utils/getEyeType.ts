import type { utils } from '@avatars/core';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, prng: utils.prng.IPrng) {
  let eyeType = [];

  if (getOption('eyes', 'close', options)) {
    eyeType.push('Close');
  }

  if (getOption('eyes', 'cry', options)) {
    eyeType.push('Cry');
  }

  if (getOption('eyes', 'default', options)) {
    eyeType.push('Default');
  }

  if (getOption('eyes', 'dizzy', options)) {
    eyeType.push('Dizzy');
  }

  if (getOption('eyes', 'roll', options)) {
    eyeType.push('EyeRoll');
  }

  if (getOption('eyes', 'happy', options)) {
    eyeType.push('Happy');
  }

  if (getOption('eyes', 'hearts', options)) {
    eyeType.push('Hearts');
  }

  if (getOption('eyes', 'side', options)) {
    eyeType.push('Side');
  }

  if (getOption('eyes', 'squint', options)) {
    eyeType.push('Squint');
  }

  if (getOption('eyes', 'surprised', options)) {
    eyeType.push('Surprised');
  }

  if (getOption('eyes', 'wink', options)) {
    eyeType.push('Wink');
  }

  if (getOption('eyes', 'winkWacky', options)) {
    eyeType.push('WinkWacky');
  }

  return prng.pick(eyeType);
}
