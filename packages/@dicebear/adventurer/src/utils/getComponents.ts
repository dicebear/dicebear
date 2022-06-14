import type { Prng } from '@dicebear/core';
	import type { Options, ComponentPickCollection } from '../types.js';
	import { pickComponent } from './pickComponent.js';
	type Props = { prng: Prng; options: Options };
	export function getComponents({
	  prng,
	  options,
	}: Props): ComponentPickCollection {
	  const baseComponent = pickComponent({
	    prng,
	    group: 'base',
	    values: options.base,
	  });
	  const eyesComponent = pickComponent({
	    prng,
	    group: 'eyes',
	    values: options.eyes,
	  });
	  const eyebrowsComponent = pickComponent({
	    prng,
	    group: 'eyebrows',
	    values: options.eyebrows,
	  });
	  const mouthComponent = pickComponent({
	    prng,
	    group: 'mouth',
	    values: options.mouth,
	  });
	  const featuresComponent = pickComponent({
	    prng,
	    group: 'features',
	    values: options.features,
	  });
	  const glassesComponent = pickComponent({
	    prng,
	    group: 'glasses',
	    values: options.glasses,
	  });
	  const hairComponent = pickComponent({
	    prng,
	    group: 'hair',
	    values: options.hair,
	  });
	  const earringsComponent = pickComponent({
	    prng,
	    group: 'earrings',
	    values: options.earrings,
	  });
	  return {
	    base: baseComponent,
	    eyes: eyesComponent,
	    eyebrows: eyebrowsComponent,
	    mouth: mouthComponent,
	    features: prng.bool(options.featuresProbability)
	      ? featuresComponent
	      : undefined,
	    glasses: prng.bool(options.glassesProbability)
	      ? glassesComponent
	      : undefined,
	    hair: prng.bool(options.hairProbability) ? hairComponent : undefined,
	    earrings: prng.bool(options.earringsProbability)
	      ? earringsComponent
	      : undefined,
	  };
	}
