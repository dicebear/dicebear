import type { Prng } from '@dicebear/core';
	import type { Options, ComponentPickCollection } from '../types.js';
	import { pickComponent } from './pickComponent.js';
	type Props = { prng: Prng; options: Options };
	export function getComponents({
	  prng,
	  options,
	}: Props): ComponentPickCollection {
	  const headComponent = pickComponent({
	    prng,
	    group: 'head',
	    values: options.head,
	  });
	  const bodyComponent = pickComponent({
	    prng,
	    group: 'body',
	    values: options.body,
	  });
	  const hairComponent = pickComponent({
	    prng,
	    group: 'hair',
	    values: options.hair,
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
	  const glassesComponent = pickComponent({
	    prng,
	    group: 'glasses',
	    values: options.glasses,
	  });
	  const mustacheComponent = pickComponent({
	    prng,
	    group: 'mustache',
	    values: options.mustache,
	  });
	  const blushesComponent = pickComponent({
	    prng,
	    group: 'blushes',
	    values: options.blushes,
	  });
	  return {
	    head: headComponent,
	    body: bodyComponent,
	    hair: hairComponent,
	    mouth: mouthComponent,
	    eyes: eyesComponent,
	    glasses: prng.bool(options.glassesProbability)
	      ? glassesComponent
	      : undefined,
	    mustache: prng.bool(options.mustacheProbability)
	      ? mustacheComponent
	      : undefined,
	    blushes: prng.bool(options.blushesProbability)
	      ? blushesComponent
	      : undefined,
	  };
	}
