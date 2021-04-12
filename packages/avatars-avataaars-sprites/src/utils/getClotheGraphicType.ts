import { Prng } from '@dicebear/avatars';
import type { ValuesType } from 'utility-types';
import type { Options, ClotheGraphics } from '../options';
import { clothingGraphic } from '../paths';
import getOption from './getOption';

export default function (options: Options, prng: Prng): () => string {
  let selected: Array<keyof typeof clothingGraphic> = [];

  let values: ValuesType<ClotheGraphics>[] = [
    'bat',
    'bear',
    'deer',
    'diamond',
    'cumbia',
    'hola',
    'pizza',
    'resist',
    'skull',
    'skullOutline',
  ];

  values.forEach((val) => {
    if (getOption('clotheGraphics', val, options)) {
      selected.push(val);
    }
  });

  let picked = prng.pick(selected);

  return clothingGraphic[picked];
}
