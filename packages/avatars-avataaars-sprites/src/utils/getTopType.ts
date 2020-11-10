import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { top } from '../paths';

export default function (options: Options, random: Random): [(color: string) => string, boolean, number] {
  let topType: Array<[(color: string) => string, boolean, number]> = [];

  if (getOption('top', 'longHair', options)) {
    topType.push(
      [top.bigHair, false, 0],
      [top.bob, false, 0],
      [top.bun, false, 1],
      [top.curly, false, 0],
      [top.curvy, false, 0],
      [top.dreads, false, 0],
      [top.frida, false, 0],
      [top.fro, false, 0],
      [top.froAndBand, false, 0],
      [top.miaWallace, false, 0],
      [top.longButNotTooLong, false, 0],
      [top.shavedSides, false, 0],
      [top.straight01, false, 0],
      [top.straight02, false, 0],
      [top.straightAndStrand, false, 0]
    );
  }

  if (getOption('top', 'shortHair', options)) {
    topType.push(
      [top.dreads01, false, 1],
      [top.dreads02, false, 1],
      [top.frizzle, false, 1],
      [top.shaggy, false, 2],
      [top.shaggyMullet, false, 0],
      [top.shortCurly, false, 1],
      [top.shortFlat, false, 1],
      [top.shortRound, false, 1],
      [top.shortWaved, false, 1],
      [top.sides, false, 1],
      [top.theCaesar, false, 1],
      [top.theCaesarAndSidePart, false, 1]
    );
  }

  if (getOption('top', 'eyepatch', options)) {
    topType.push([top.eyepatch, true, 0]);
  }

  if (getOption('top', 'hat', options)) {
    topType.push(
      [top.hat, true, 0],
      [top.winterHat01, true, 2],
      [top.winterHat02, true, 2],
      [top.winterHat03, true, 2],
      [top.winterHat04, true, 2]
    );
  }

  if (getOption('top', 'hijab', options)) {
    topType.push([top.hijab, true, 1]);
  }

  if (getOption('top', 'turban', options)) {
    topType.push([top.turban, true, 1]);
  }

  let pickedTopType = random.pickone(topType);

  if (false === random.bool(undefined !== options.topChance ? options.topChance : 100)) {
    return [() => '', false, 0];
  }

  return pickedTopType;
}
