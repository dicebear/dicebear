import type { ValuesType } from 'utility-types';
import type Random from '@dicebear/avatars/lib/random';
import type { Options, ClotheGraphics } from '../options';
import { clothingGraphic } from '../paths';
import getOption from './getOption';

export default function (options: Options, random: Random): () => string {
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

  let picked = random.pickone(selected);

  return clothingGraphic[picked];
}
