import type Random from '@dicebear/avatars/lib/random';
import type Options from '../options';
import getOption from './getOption';
import { clothing } from '../paths';

export default function (options: Options, random: Random) {
  let clotheType = [];

  if (getOption('clothes', 'blazer', options)) {
    clotheType.push(clothing.blazerAndShirt, clothing.blazerAndSweater);
  }

  if (getOption('clothes', 'sweater', options)) {
    clotheType.push(clothing.collarAndSweater);
  }

  if (getOption('clothes', 'shirt', options)) {
    clotheType.push(clothing.graphicShirt, clothing.shirtCrewNeck, clothing.shirtScoopNeck, clothing.shirtVNeck);
  }

  if (getOption('clothes', 'hoodie', options)) {
    clotheType.push(clothing.hoodie);
  }

  if (getOption('clothes', 'overall', options)) {
    clotheType.push(clothing.overall);
  }

  return random.pickone(clotheType);
}
