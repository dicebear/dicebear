import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { top } from '../paths';
import getHatColor from './getHatColor';
import getHairColor from './getHairColor';

export default function (options: Options, random: Random) {
  let hatColor = getHatColor(options, random);
  let hairColor = getHairColor(options, random);

  let topType = [];

  if (getOption('top', 'longHair', options)) {
    topType.push(
      () => top.bigHair(hairColor),
      () => top.bob(hairColor),
      () => top.bun(hairColor),
      () => top.curly(hairColor),
      () => top.curvy(hairColor),
      () => top.dreads(hairColor),
      () => top.frida(hairColor),
      () => top.fro(hairColor),
      () => top.froAndBand(hairColor),
      () => top.miaWallace(hairColor),
      () => top.longButNotTooLong(hairColor),
      () => top.shavedSides(hairColor),
      () => top.straight01(hairColor),
      () => top.straight02(hairColor),
      () => top.straightAndStrand(hairColor)
    );
  }

  if (getOption('top', 'shortHair', options)) {
    topType.push(
      () => top.dreads01(hairColor),
      () => top.dreads02(hairColor),
      () => top.frizzle(hairColor),
      () => top.shaggy(hairColor),
      () => top.shaggyMullet(hairColor),
      () => top.shortCurly(hairColor),
      () => top.shortFlat(hairColor),
      () => top.shortRound(hairColor),
      () => top.shortWaved(hairColor),
      () => top.sides(hairColor),
      () => top.theCaesar(hairColor),
      () => top.theCaesarAndSidePart(hairColor)
    );
  }

  if (getOption('top', 'eyepatch', options)) {
    topType.push(() => top.eyepatch(hatColor));
  }

  if (getOption('top', 'hat', options)) {
    topType.push(
      () => top.hat(hatColor),
      () => top.winterHat01(hatColor),
      () => top.winterHat02(hatColor),
      () => top.winterHat03(hatColor),
      () => top.winterHat04(hatColor)
    );
  }

  if (getOption('top', 'hijab', options)) {
    topType.push(() => top.hijab(hatColor));
  }

  if (getOption('top', 'turban', options)) {
    topType.push(() => top.turban(hatColor));
  }

  let pickedTopType = random.pickone(topType);

  if (false === random.bool(undefined !== options.topChance ? options.topChance : 100)) {
    return undefined;
  }

  return pickedTopType;
}
