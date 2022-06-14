import type { Prng } from '@dicebear/core';
	import type { Options, ColorPickCollection } from '../types.js';
	type Props = { prng: Prng; options: Options };
	export function getColors({ prng, options }: Props): ColorPickCollection {
	  return {
	    base: prng.pick(options.baseColor ?? []) ?? 'transparent',
	    earring: prng.pick(options.earringColor ?? []) ?? 'transparent',
	    eyeShadow: prng.pick(options.eyeShadowColor ?? []) ?? 'transparent',
	    eyebrows: prng.pick(options.eyebrowsColor ?? []) ?? 'transparent',
	    facialHair: prng.pick(options.facialHairColor ?? []) ?? 'transparent',
	    glasses: prng.pick(options.glassesColor ?? []) ?? 'transparent',
	    hair: prng.pick(options.hairColor ?? []) ?? 'transparent',
	    mouth: prng.pick(options.mouthColor ?? []) ?? 'transparent',
	    shirt: prng.pick(options.shirtColor ?? []) ?? 'transparent',
	    eyes: prng.pick(options.eyesColor ?? []) ?? 'transparent',
	  };
	}
