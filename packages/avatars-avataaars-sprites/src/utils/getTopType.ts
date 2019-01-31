import Random from '@dicebear/avatars/lib/random';
import Options from '../options';
import getOption from './getOption';

export default function(options: Options, random: Random) {
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

  let pickedTopType = random.pickone(topType);

  if (false === random.bool(undefined !== options.topChance ? options.topChance : 100)) {
    return 'NoHair';
  }

  return pickedTopType;
}
