import type { Prng } from '@dicebear/core';
	import type { Options, ColorPickCollection } from '../types.js';
	type Props = { prng: Prng; options: Options };
	export function getColors({ prng, options }: Props): ColorPickCollection {
	  return {
	    accessories: prng.pick(options.accessoriesColor ?? []) ?? 'transparent',
	    clothes: prng.pick(options.clothesColor ?? []) ?? 'transparent',
	    hat: prng.pick(options.hatColor ?? []) ?? 'transparent',
	    hair: prng.pick(options.hairColor ?? []) ?? 'transparent',
	    skin: prng.pick(options.skinColor ?? []) ?? 'transparent',
	    facialHair: prng.pick(options.facialHairColor ?? []) ?? 'transparent',
	    background: prng.pick(options.backgroundColor ?? []) ?? 'transparent',
	  };
	}
