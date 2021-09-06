import { Prng, StyleOptions } from '@dicebear/core';

import { Options } from '../types.js';

type Props = { prng: Prng; options: StyleOptions<Options> };

export function onPreCreate({ prng, options }: Props) {
  // Write your modifications here
}
