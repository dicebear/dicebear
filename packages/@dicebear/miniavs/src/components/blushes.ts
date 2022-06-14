import { escape } from '@dicebear/core';
	import type {
	  ComponentGroup,
	  ComponentPickCollection,
	  ColorPickCollection,
	} from '../types.js';
	export const blushes: ComponentGroup = {
	  default: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<g fill="#FF859B"><rect x="24" y="39" width="5" height="3" rx="1.5"/><rect x="43" y="39" width="4" height="3" rx="1.5"/></g>`,
	};
