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
	    title: 'Adventurer Neutral',
	    creator: 'Lisa Wischofsky',
	    source: 'https://www.figma.com/community/file/1035815353921481031',
	    homepage: 'https://www.instagram.com/lischi_art/',
	    license: {
	      name: 'CC BY 4.0',
	      url: 'https://creativecommons.org/licenses/by/4.0/',
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
	        viewBox: '0 0 400 400',
	        fill: 'none',
	        'shape-rendering': 'auto',
	      },
	      body: `<g transform="translate(-279 -322)">${
	        components.eyes?.value(components, colors) ?? ''
	      }</g><g transform="translate(-279 -322)">${
	        components.eyebrows?.value(components, colors) ?? ''
	      }</g><g transform="translate(-279 -322)">${
	        components.mouth?.value(components, colors) ?? ''
	      }</g><g transform="translate(-279 -322)">${
	        components.glasses?.value(components, colors) ?? ''
	      }</g>`,
	    };
	  },
	};
