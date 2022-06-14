import type { Style, StyleSchema } from '@dicebear/core';
	import { escape } from '@dicebear/core';
	import type { Options } from './types.js';
	import { schema } from './schema.js';
	import { getComponents } from './utils/getComponents.js';
	import { getColors } from './utils/getColors.js';
	import { onPreCreate } from './hooks/onPreCreate.js';
	import { onPostCreate } from './hooks/onPostCreate.js';
	export const style: Style<Options> = {
	  meta: {
	    title: 'Lorelei',
	    creator: 'Lisa Wischofsky',
	    source: 'https://dicebear.com/',
	    homepage: 'https://www.instagram.com/lischi_art/',
	    license: {
	      name: 'CC0 1.0',
	      url: 'https://creativecommons.org/licenses/zero/1.0/',
	    },
	  },
	  schema: schema as StyleSchema,
	  create: ({ prng, options }) => {
	    onPreCreate({ prng, options });
	    const components = getComponents({ prng, options });
	    const colors = getColors({ prng, options });
	    onPostCreate({ prng, options, components, colors });
	    return {
	      attributes: {
	        viewBox: '0 0 980 980',
	        fill: 'none',
	        'shape-rendering': 'auto',
	      },
	      body: `<g transform="translate(10 -60)">${
	        components.hair?.value(components, colors) ?? ''
	      }</g>`,
	    };
	  },
	};
