import { Prng, StyleOptions } from "@dicebear/avatars";

import { Options } from "../options";

type Props = { prng: Prng, options: StyleOptions<Options> } 

export function onPreCreate({ prng, options }: Props) {
  // Write your modifications here
}
