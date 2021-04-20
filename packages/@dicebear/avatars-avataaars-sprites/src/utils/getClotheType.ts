import type { ValuesType } from 'utility-types';
import type { Options, Clothes } from '../options';
import getOption from './getOption';
import { clothing } from '../paths';
import { arrayUnique } from '../helpers/arrayUnique';
import { Prng } from '@dicebear/avatars';

export default function (options: Options, prng: Prng): (color: string, clotheGraphic?: string) => string {
  let selected: Array<keyof typeof clothing> = [];

  let values: Record<ValuesType<Clothes>, Array<keyof typeof clothing>> = {
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
    let val = values[key as ValuesType<Clothes>];

    if (getOption('clothes', key, options)) {
      selected.push(...val);
    }
  });

  let picked = prng.pick(arrayUnique(selected));

  return clothing[picked];
}
