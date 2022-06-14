import type { Prng } from '@dicebear/core';
	import type { Options, ComponentPickCollection } from '../types.js';
	import { pickComponent } from './pickComponent.js';
	type Props = { prng: Prng; options: Options };
	export function getComponents({
	  prng,
	  options,
	}: Props): ComponentPickCollection {
	  const sidesComponent = pickComponent({
	    prng,
	    group: 'sides',
	    values: options.sides,
	  });
	  const topComponent = pickComponent({
	    prng,
	    group: 'top',
	    values: options.top,
	  });
	  const faceComponent = pickComponent({
	    prng,
	    group: 'face',
	    values: options.face,
	  });
	  const mouthComponent = pickComponent({
	    prng,
	    group: 'mouth',
	    values: options.mouth,
	  });
	  const eyesComponent = pickComponent({
	    prng,
	    group: 'eyes',
	    values: options.eyes,
	  });
	  const textureComponent = pickComponent({
	    prng,
	    group: 'texture',
	    values: options.texture,
	  });
	  return {
	    sides: prng.bool(options.sidesProbability) ? sidesComponent : undefined,
	    top: prng.bool(options.topProbability) ? topComponent : undefined,
	    face: faceComponent,
	    mouth: prng.bool(options.mouthProbability) ? mouthComponent : undefined,
	    eyes: eyesComponent,
	    texture: prng.bool(options.textureProbability)
	      ? textureComponent
	      : undefined,
	  };
	}
