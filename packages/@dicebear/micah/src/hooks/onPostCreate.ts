import { Prng, StyleOptions } from "@dicebear/avatars";

import { Options } from "../options";
import { ColorPickCollection, ComponentPickCollection } from "../static-types";

type Props = { prng: Prng, options: StyleOptions<Options>, components: ComponentPickCollection, colors: ColorPickCollection } 

export function onPostCreate({ prng, options, components, colors }: Props) {
  // Ensure that the mouth remains visible. #132
  if (components.facialHair && colors.facialHair.value === colors.mouth.value) {
    colors.mouth.value = 'rgba(255, 255, 255, .2)';
  }
}
