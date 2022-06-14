import type { Prng } from '@dicebear/core';
	import type { Options, ColorPickCollection } from '../types.js';
	type Props = { prng: Prng; options: Options };
	export function getColors({ prng, options }: Props): ColorPickCollection {
	  return {
	    accessories: prng.pick(options.accessoriesColor ?? []) ?? 'transparent',
	    clothing: prng.pick(options.clothingColor ?? []) ?? 'transparent',
	    eyes: prng.pick(options.eyesColor ?? []) ?? 'transparent',
	    glasses: prng.pick(options.glassesColor ?? []) ?? 'transparent',
	    hair: prng.pick(options.hairColor ?? []) ?? 'transparent',
	    mouth: prng.pick(options.mouthColor ?? []) ?? 'transparent',
	    skin: prng.pick(options.skinColor ?? []) ?? 'transparent',
	  };
	}
