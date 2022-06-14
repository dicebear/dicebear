import { escape } from '@dicebear/core';
	import type {
	  ComponentGroup,
	  ComponentPickCollection,
	  ColorPickCollection,
	} from '../types.js';
	export const row4: ComponentGroup = {
	  xooox: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M1 3H0v1h1V3ZM5 3H4v1h1V3Z" fill="${escape.xml(
	      `#${colors.row}`
	    )}"/>`,
	  xxoxx: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M2 3H0v1h2V3ZM5 3H3v1h2V3Z" fill="${escape.xml(
	      `#${colors.row}`
	    )}"/>`,
	  xoxox: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M0 3h1v1H0V3ZM4 3h1v1H4V3ZM3 3H2v1h1V3Z" fill="${escape.xml(
	      `#${colors.row}`
	    )}"/>`,
	  oxxxo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill="${escape.xml(`#${colors.row}`)}" d="M1 3h3v1H1z"/>`,
	  xxxxx: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill="${escape.xml(`#${colors.row}`)}" d="M0 3h5v1H0z"/>`,
	  oxoxo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M2 3H1v1h1V3ZM4 3H3v1h1V3Z" fill="${escape.xml(
	      `#${colors.row}`
	    )}"/>`,
	  ooxoo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill="${escape.xml(`#${colors.row}`)}" d="M2 3h1v1H2z"/>`,
	};
