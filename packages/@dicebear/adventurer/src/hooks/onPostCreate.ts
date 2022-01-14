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
  preview: boolean;
};

export function onPostCreate({
  prng,
  options,
  components,
  colors,
  preview,
}: Props) {
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
    false === preview &&
    components.hair?.name &&
    invisibleEarringsHair.includes(components.hair.name)
  ) {
    components.earrings = undefined;
  }
}
