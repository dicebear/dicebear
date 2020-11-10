import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { mouth } from '../paths';

export default function (options: Options, random: Random) {
  let mouthType = [];

  if (getOption('mouth', 'concerned', options)) {
    mouthType.push(mouth.concerned);
  }

  if (getOption('mouth', 'default', options)) {
    mouthType.push(mouth.default);
  }

  if (getOption('mouth', 'disbelief', options)) {
    mouthType.push(mouth.disbelief);
  }

  if (getOption('mouth', 'eating', options)) {
    mouthType.push(mouth.eating);
  }

  if (getOption('mouth', 'grimace', options)) {
    mouthType.push(mouth.grimace);
  }

  if (getOption('mouth', 'sad', options)) {
    mouthType.push(mouth.sad);
  }

  if (getOption('mouth', 'scream', options)) {
    mouthType.push(mouth.screamOpen);
  }

  if (getOption('mouth', 'serious', options)) {
    mouthType.push(mouth.serious);
  }

  if (getOption('mouth', 'smile', options)) {
    mouthType.push(mouth.smile);
  }

  if (getOption('mouth', 'tongue', options)) {
    mouthType.push(mouth.tongue);
  }

  if (getOption('mouth', 'twinkle', options)) {
    mouthType.push(mouth.twinkle);
  }

  if (getOption('mouth', 'vomit', options)) {
    mouthType.push(mouth.vomit);
  }

  return random.pickone(mouthType);
}
