import type Random from '@dicebear/avatars/lib/random';
import type { Options, Clothes } from '../options';
import getOption from './getOption';
import { clothing } from '../paths';
import { arrayUnique } from '../helpers/arrayUnique';

export default function (options: Options, random: Random): (color: string, clotheGraphic?: string) => string {
  let selected: Array<keyof typeof clothing> = [];

  let values: Record<Clothes, Array<keyof typeof clothing>> = {
    blazer: ['blazerAndShirt', 'blazerAndSweater'],
    blazerAndShirt: ['blazerAndShirt'],
    blazerAndSweater: ['blazerAndSweater'],
    sweater: ['collarAndSweater'],
    collarAndSweater: ['collarAndSweater'],
    shirt: ['graphicShirt', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck'],
    graphicShirt: ['graphicShirt'],
    shirtCrewNeck: ['shirtCrewNeck'],
    shirtScoopNeck: ['shirtScoopNeck'],
    shirtVNeck: ['shirtVNeck'],
    hoodie: ['hoodie'],
    overall: ['overall'],
  };

  Object.keys(values).forEach((key) => {
    let val = values[key as Clothes];

    if (getOption('clothes', key, options)) {
      selected.push(...val);
    }
  });

  let picked = random.pickone(arrayUnique(selected));

  return clothing[picked];
}
