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
  // Ensure that the mouth remains visible. #132
  if (components.facialHair && colors.facialHair.value === colors.mouth.value) {
    colors.mouth.value = 'rgba(255, 255, 255, .2)';
  }
}
