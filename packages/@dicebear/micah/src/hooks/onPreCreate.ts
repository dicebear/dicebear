import { Prng, StyleOptions } from '@dicebear/core';
	import { Options } from '../types.js';
	type Props = { prng: Prng; options: StyleOptions<Options> };
	export function onPreCreate({ prng, options }: Props) {
	  // Prevent baseColor from being used a second time if possible.
	  options.baseColor =
	    options.baseColor && options.baseColor.length > 0
	      ? [prng.pick(options.baseColor) ?? 'transparent']
	      : [];
	  for (const colorName of [
	    'eyebrows',
	    'hair',
	    'eyes',
	    'nose',
	    'ears',
	    'shirt',
	    'earrings',
	    'glasses',
	    'facialHair',
	  ]) {
	    // @ts-ignore
	    const colorOption = options[`${colorName}Color`] ?? [];
	    const index = colorOption.indexOf(options.baseColor[0]);
	    if (colorOption.length > 1 && index > -1) {
	      colorOption.splice(index, 1);
	    }
	  }
	}
