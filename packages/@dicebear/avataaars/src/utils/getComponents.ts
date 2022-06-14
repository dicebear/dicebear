import type { Prng } from '@dicebear/core';
	import type { Options, ComponentPickCollection } from '../types.js';
	import { pickComponent } from './pickComponent.js';
	type Props = { prng: Prng; options: Options };
	export function getComponents({
	  prng,
	  options,
	}: Props): ComponentPickCollection {
	  const styleComponent = pickComponent({
	    prng,
	    group: 'style',
	    values: options.style,
	  });
	  const clothingComponent = pickComponent({
	    prng,
	    group: 'clothing',
	    values: options.clothing,
	  });
	  const mouthComponent = pickComponent({
	    prng,
	    group: 'mouth',
	    values: options.mouth,
	  });
	  const noseComponent = pickComponent({
	    prng,
	    group: 'nose',
	    values: options.nose,
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
	  const topComponent = pickComponent({
	    prng,
	    group: 'top',
	    values: options.top,
	  });
	  const facialHairComponent = pickComponent({
	    prng,
	    group: 'facialHair',
	    values: options.facialHair,
	  });
	  const accessoriesComponent = pickComponent({
	    prng,
	    group: 'accessories',
	    values: options.accessories,
	  });
	  const clothingGraphicComponent = pickComponent({
	    prng,
	    group: 'clothingGraphic',
	    values: options.clothingGraphic,
	  });
	  return {
	    style: styleComponent,
	    clothing: clothingComponent,
	    mouth: mouthComponent,
	    nose: noseComponent,
	    eyes: eyesComponent,
	    eyebrows: eyebrowsComponent,
	    top: prng.bool(options.topProbability) ? topComponent : undefined,
	    facialHair: prng.bool(options.facialHairProbability)
	      ? facialHairComponent
	      : undefined,
	    accessories: prng.bool(options.accessoriesProbability)
	      ? accessoriesComponent
	      : undefined,
	    clothingGraphic: clothingGraphicComponent,
	  };
	}
