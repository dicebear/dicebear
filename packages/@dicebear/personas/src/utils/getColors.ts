import type { Prng } from '@dicebear/core';
	import type { Options, ColorPickCollection } from '../types.js';
	type Props = { prng: Prng; options: Options };
	export function getColors({ prng, options }: Props): ColorPickCollection {
	  return {
	    hair: prng.pick(options.hairColor ?? []) ?? 'transparent',
	    clothing: prng.pick(options.clothingColor ?? []) ?? 'transparent',
	    skin: prng.pick(options.skinColor ?? []) ?? 'transparent',
	  };
	}
