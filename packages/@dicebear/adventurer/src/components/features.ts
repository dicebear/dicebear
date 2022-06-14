import { escape } from '@dicebear/core';
	import type {
	  ComponentGroup,
	  ComponentPickCollection,
	  ColorPickCollection,
	} from '../types.js';
	export const features: ComponentGroup = {
	  mustache: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<path d="M489.1 525.9c6.3 4.7 7.6 15 14 20s14.5 7.3 22.2 3.6c1 1.3 2.3 2.3 1.3 4.1-4 7-11.2 10.4-18.7 12.5a40.6 40.6 0 0 1-29.4-2.6c-6.3-3.5-9.9-9.1-14.4-14.5a59.5 59.5 0 0 1-20.4 18.8c-5.8 3-13.3 5-19.8 3.3-6.3-1.8-12-6.1-12.2-13.1-.2-2.4 1.2-2.7 3.1-3.1 1.3 1.3 2.3 2.7 4.2 3 3.5.7 7-1.2 9.1-3.8 5.4-6.4 4.5-17 10.4-22.6 6.2-5.9 16.9-8.1 24.5-4 7.7-5.2 18-6.9 26.1-1.6Z" fill="#000"/>`,
	  blush: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M630.4 552.4a40.8 40.8 0 0 1 39.5 66.6 40.8 40.8 0 1 1-39.6-66.6ZM373.1 564.9a37.7 37.7 0 0 1 3 61.5 213 213 0 0 1-35-43.6c-3.3-5.9-6.7-11.2-8.8-17.6a38 38 0 0 1 40.8-.3Z" fill="#CA8D87"/>`,
	  birthmark: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<path d="M604.4 568.4c4-2.4 9.4 0 11 4.2 1.8 4.4-1.8 9.9-6.5 10.2a7.8 7.8 0 0 1-8-4.8 7.8 7.8 0 0 1 3.5-9.6Z" fill="#000"/>`,
	  freckles: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<path d="M611.4 569.4c4.5-2.8 10.3 1.4 8.7 6.6-1.2 4.5-7.3 5.3-10 1.9a6 6 0 0 1 1.3-8.5ZM337.1 571c2.3-1.3 5.7-.6 7.4 1.4 3 3 1 9.6-3.6 9.3-2.1-1.8-3.5-4.4-4.6-7-.6-1.6-.8-2.6.8-3.7ZM650.5 571.6c1.3-.7 3-.5 4.4-.3 3.4.8 5.4 5.1 3.5 8.2-1.6 2.9-5.1 4-8 2.2-3.9-2.2-3.7-8 0-10.1ZM372.2 574.1c4-2.2 9.5 1.2 8.7 5.9-.4 4.7-6.1 6.3-9.5 3.6-3-2.5-2.5-7.4.8-9.5ZM632.5 591.6c4.2-1.5 8.9 1.8 8 6.4-.7 5-7.1 6.3-10.1 2.6-2.6-3-1.3-7.3 2.1-9ZM358 593.8c3.7.4 6.4 4.5 4.8 8-1.2 2.5-3.3 3-5.8 3.8-1.6-2.2-3.7-4.3-4.9-6.8-.8-3.2 3-5.6 6-5Z" fill="#7A624E"/>`,
	};
