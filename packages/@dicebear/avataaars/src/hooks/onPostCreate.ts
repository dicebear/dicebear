import { Prng, StyleOptions } from '@dicebear/core';

import { Options } from '../options';
import { ColorPickCollection, ComponentPickCollection } from '../static-types';

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
  if (components.style?.name === 'circle') {
    options.backgroundColor = [];
  }
}
