import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { eyebrows } from '../paths';

export default function (options: Options, random: Random) {
  let eyebrowType = [];

  if (getOption('eyebrow', 'angry', options)) {
    eyebrowType.push(eyebrows.angry, eyebrows.angryNatural);
  }

  if (getOption('eyebrow', 'default', options)) {
    eyebrowType.push(eyebrows.default, eyebrows.defaultNatural);
  }

  if (getOption('eyebrow', 'flat', options)) {
    eyebrowType.push(eyebrows.flatNatural);
  }

  if (getOption('eyebrow', 'raised', options)) {
    eyebrowType.push(eyebrows.raisedExcited, eyebrows.raisedExcitedNatural);
  }

  if (getOption('eyebrow', 'sad', options)) {
    eyebrowType.push(eyebrows.sadConcerned, eyebrows.sadConcernedNatural);
  }

  if (getOption('eyebrow', 'unibrow', options)) {
    eyebrowType.push(eyebrows.unibrowNatural);
  }

  if (getOption('eyebrow', 'up', options)) {
    eyebrowType.push(eyebrows.upDown, eyebrows.upDownNatural);
  }

  if (getOption('eyebrow', 'frown', options)) {
    eyebrowType.push(eyebrows.frownNatural);
  }

  return random.pickone(eyebrowType);
}
