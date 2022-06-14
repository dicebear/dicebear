import type { Prng } from '@dicebear/core';
	import type { Options, ComponentPickCollection } from '../types.js';
	import { pickComponent } from './pickComponent.js';
	type Props = { prng: Prng; options: Options };
	export function getComponents({
	  prng,
	  options,
	}: Props): ComponentPickCollection {
	  const iconComponent = pickComponent({
	    prng,
	    group: 'icon',
	    values: options.icon,
	  });
	  return { icon: iconComponent };
	}
