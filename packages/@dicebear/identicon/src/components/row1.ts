import { escape } from '@dicebear/core';
	import type {
	  ComponentGroup,
	  ComponentPickCollection,
	  ColorPickCollection,
	} from '../types.js';
	export const row1: ComponentGroup = {
	  xooox: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M1 0H0v1h1V0ZM5 0H4v1h1V0Z" fill="${escape.xml(
	      `#${colors.row}`
	    )}"/>`,
	  xxoxx: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M2 0H0v1h2V0ZM5 0H3v1h2V0Z" fill="${escape.xml(
	      `#${colors.row}`
	    )}"/>`,
	  xoxox: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M0 0h1v1H0V0ZM4 0h1v1H4V0ZM3 0H2v1h1V0Z" fill="${escape.xml(
	      `#${colors.row}`
	    )}"/>`,
	  oxxxo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill="${escape.xml(`#${colors.row}`)}" d="M1 0h3v1H1z"/>`,
	  xxxxx: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill="${escape.xml(`#${colors.row}`)}" d="M0 0h5v1H0z"/>`,
	  oxoxo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M2 0H1v1h1V0ZM4 0H3v1h1V0Z" fill="${escape.xml(
	      `#${colors.row}`
	    )}"/>`,
	  ooxoo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill="${escape.xml(`#${colors.row}`)}" d="M2 0h1v1H2z"/>`,
	};
