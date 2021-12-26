import { Prng, StyleOptions } from '@dicebear/core';

import { Options } from '../types.js';

type Props = { prng: Prng; options: StyleOptions<Options>; preview: boolean };

export function onPreCreate({ prng, options, preview }: Props) {
  // Write your modifications here
}
