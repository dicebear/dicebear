import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { eyes } from '../paths';

export default function (options: Options, random: Random) {
  let eyeType = [];

  if (getOption('eyes', 'close', options)) {
    eyeType.push(eyes.closed);
  }

  if (getOption('eyes', 'cry', options)) {
    eyeType.push(eyes.cry);
  }

  if (getOption('eyes', 'default', options)) {
    eyeType.push(eyes.default);
  }

  if (getOption('eyes', 'dizzy', options)) {
    eyeType.push(eyes.xDizzy);
  }

  if (getOption('eyes', 'roll', options)) {
    eyeType.push(eyes.eyeRoll);
  }

  if (getOption('eyes', 'happy', options)) {
    eyeType.push(eyes.happy);
  }

  if (getOption('eyes', 'hearts', options)) {
    eyeType.push(eyes.hearts);
  }

  if (getOption('eyes', 'side', options)) {
    eyeType.push(eyes.side);
  }

  if (getOption('eyes', 'squint', options)) {
    eyeType.push(eyes.squint);
  }

  if (getOption('eyes', 'surprised', options)) {
    eyeType.push(eyes.surprised);
  }

  if (getOption('eyes', 'wink', options)) {
    eyeType.push(eyes.wink);
  }

  if (getOption('eyes', 'winkWacky', options)) {
    eyeType.push(eyes.winkWacky);
  }

  return random.pickone(eyeType);
}
