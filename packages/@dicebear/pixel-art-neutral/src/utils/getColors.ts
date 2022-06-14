import type { Prng } from '@dicebear/core';
	import type { Options, ColorPickCollection } from '../types.js';
	type Props = { prng: Prng; options: Options };
	export function getColors({ prng, options }: Props): ColorPickCollection {
	  return {
	    eyes: prng.pick(options.eyesColor ?? []) ?? 'transparent',
	    glasses: prng.pick(options.glassesColor ?? []) ?? 'transparent',
	    mouth: prng.pick(options.mouthColor ?? []) ?? 'transparent',
	  };
	}
