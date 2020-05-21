import type { utils } from '@avatars/core';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, prng: utils.prng.IPrng) {
  let topType = [];

  if (getOption('top', 'longHair', options)) {
    topType.push(
      'LongHairBigHair',
      'LongHairBob',
      'LongHairBun',
      'LongHairCurly',
      'LongHairCurvy',
      'LongHairDreads',
      'LongHairFrida',
      'LongHairFro',
      'LongHairFroBand',
      'LongHairMiaWallace',
      'LongHairNotTooLong',
      'LongHairShavedSides',
      'LongHairStraight',
      'LongHairStraight2',
      'LongHairStraightStrand'
    );
  }

  if (getOption('top', 'shortHair', options)) {
    topType.push(
      'ShortHairDreads01',
      'ShortHairDreads02',
      'ShortHairFrizzle',
      'ShortHairShaggy',
      'ShortHairShaggyMullet',
      'ShortHairShortCurly',
      'ShortHairShortFlat',
      'ShortHairShortRound',
      'ShortHairShortWaved',
      'ShortHairSides',
      'ShortHairTheCaesar',
      'ShortHairTheCaesarSidePart'
    );
  }

  if (getOption('top', 'eyepatch', options)) {
    topType.push('Eyepatch');
  }

  if (getOption('top', 'hat', options)) {
    topType.push('Hat', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4');
  }

  if (getOption('top', 'hijab', options)) {
    topType.push('Hijab');
  }

  if (getOption('top', 'turban', options)) {
    topType.push('Turban');
  }

  let pickedTopType = prng.pick(topType);

  if (false === prng.bool(undefined !== options.topProbability ? options.topProbability : 100)) {
    return 'NoHair';
  }

  return pickedTopType;
}
