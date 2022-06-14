import type { Prng } from '@dicebear/core';
	import type { Options, ColorPickCollection } from '../types.js';
	type Props = { prng: Prng; options: Options };
	export function getColors({ prng, options }: Props): ColorPickCollection {
	  return {
	    eyebrows: prng.pick(options.eyebrowsColor ?? []) ?? 'transparent',
	    eyes: prng.pick(options.eyesColor ?? []) ?? 'transparent',
	    freckles: prng.pick(options.frecklesColor ?? []) ?? 'transparent',
	    glasses: prng.pick(options.glassesColor ?? []) ?? 'transparent',
	    mouth: prng.pick(options.mouthColor ?? []) ?? 'transparent',
	    nose: prng.pick(options.noseColor ?? []) ?? 'transparent',
	  };
	}
