import { Prng, StyleOptions } from '@dicebear/core';

import {
  Options,
  ColorPickCollection,
  ComponentPickCollection,
} from '../types.js';

type Props = {
  prng: Prng;
  options: StyleOptions<Options>;
  components: ComponentPickCollection;
  colors: ColorPickCollection;
};

export function onPostCreate({ prng, options, components, colors }: Props) {
  const invisibleEarringsHair = [
    'long01',
    'long04',
    'long05',
    'long06',
    'long20',
    'long22',
    'long24',
    'long26',
  ];

  if (
    components.hair?.name &&
    invisibleEarringsHair.includes(components.hair.name)
  ) {
    components.earrings = undefined;
  }
}
