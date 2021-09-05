import { Prng, StyleOptions } from "@dicebear/avatars";

import { Options } from "../options";
import { ColorPickCollection, ComponentPickCollection } from "../static-types";

type Props = { prng: Prng, options: StyleOptions<Options>, components: ComponentPickCollection, colors: ColorPickCollection } 

export function onPostCreate({ prng, options, components, colors }: Props) {
  // Write your modifications here
}
