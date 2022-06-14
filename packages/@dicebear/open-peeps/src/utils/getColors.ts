import type { Prng } from '@dicebear/core';
	import type { Options, ColorPickCollection } from '../types.js';
	type Props = { prng: Prng; options: Options };
	export function getColors({ prng, options }: Props): ColorPickCollection {
	  return {
	    skin: prng.pick(options.skinColor ?? []) ?? 'transparent',
	    clothing: prng.pick(options.clothingColor ?? []) ?? 'transparent',
	    hair: prng.pick(options.hairColor ?? []) ?? 'transparent',
	  };
	}
