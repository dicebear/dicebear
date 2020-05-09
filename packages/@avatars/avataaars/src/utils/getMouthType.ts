import Random from '@avatars/core/lib/random';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, random: Random) {
  let mouthType = [];

  if (getOption('mouth', 'concerned', options)) {
    mouthType.push('Concerned');
  }

  if (getOption('mouth', 'default', options)) {
    mouthType.push('Default');
  }

  if (getOption('mouth', 'disbelief', options)) {
    mouthType.push('Disbelief');
  }

  if (getOption('mouth', 'eating', options)) {
    mouthType.push('Eating');
  }

  if (getOption('mouth', 'grimace', options)) {
    mouthType.push('Grimace');
  }

  if (getOption('mouth', 'sad', options)) {
    mouthType.push('Sad');
  }

  if (getOption('mouth', 'scream', options)) {
    mouthType.push('ScreamOpen');
  }

  if (getOption('mouth', 'serious', options)) {
    mouthType.push('Serious');
  }

  if (getOption('mouth', 'smile', options)) {
    mouthType.push('Smile');
  }

  if (getOption('mouth', 'tongue', options)) {
    mouthType.push('Tongue');
  }

  if (getOption('mouth', 'twinkle', options)) {
    mouthType.push('Twinkle');
  }

  if (getOption('mouth', 'vomit', options)) {
    mouthType.push('Vomit');
  }

  return random.pickone(mouthType);
}
