import { Prng, StyleOptions } from '@dicebear/core';
	import {
	  Options,
	  ColorPickCollection,
	  ComponentPickCollection,
	} from '../types.js';
	type Props = {
	  prng: Prng;
	  options: StyleOptions<Options>;
	  components: ComponentPickCollection;
	  colors: ColorPickCollection;
	};
	export function onPostCreate({ prng, options, components, colors }: Props) {
	  // Write your modifications here
	}
