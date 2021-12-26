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
    'hair01',
    'hair04',
    'hair05',
    'hair20',
    'hair22',
    'hair24',
  ];

  if (
    false === preview &&
    components.hair?.name &&
    invisibleEarringsHair.includes(components.hair.name)
  ) {
    components.earrings = undefined;
  }
}
