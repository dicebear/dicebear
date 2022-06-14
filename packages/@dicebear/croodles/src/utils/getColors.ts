import type { Prng } from '@dicebear/core';
	import type { Options, ColorPickCollection } from '../types.js';
	type Props = { prng: Prng; options: Options };
	export function getColors({ prng, options }: Props): ColorPickCollection {
	  return {
	    top: prng.pick(options.topColor ?? []) ?? 'transparent',
	    base: prng.pick(options.baseColor ?? []) ?? 'transparent',
	  };
	}
