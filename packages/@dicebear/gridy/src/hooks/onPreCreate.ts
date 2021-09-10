import { Prng, StyleOptions } from '@dicebear/core';

import { Options } from '../options';

type Props = { prng: Prng; options: StyleOptions<Options> };

export function onPreCreate({ prng, options }: Props) {
  // Prevent bodyColor from being used a second time if possible.
  options.bodyColor =
    options.bodyColor && options.bodyColor.length > 0
      ? [prng.pick(options.bodyColor)]
      : [];

  for (const colorName of ['eyes', 'mouth']) {
    // @ts-ignore
    const colorOption = options[`${colorName}Color`] ?? [];
    const index = colorOption.indexOf(options.bodyColor[0]);

    if (colorOption.length > 1 && index > -1) {
      colorOption.splice(index, 1);
    }
  }
}
