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
	    title: 'Avatar Illustration System',
	    creator: 'Micah Lanier',
	    source: 'https://www.figma.com/community/file/829741575478342595',
	    homepage: 'https://dribbble.com/micahlanier',
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
	        viewBox: '0 0 360 360',
	        fill: 'none',
	        'shape-rendering': 'auto',
	      },
	      body: `<g transform="translate(80 23)">${
	        components.base?.value(components, colors) ?? ''
	      }</g><g transform="translate(170 183)">${
	        components.mouth?.value(components, colors) ?? ''
	      }</g><g transform="translate(110 102)">${
	        components.eyebrows?.value(components, colors) ?? ''
	      }</g><g transform="translate(49 11)">${
	        components.hair?.value(components, colors) ?? ''
	      }</g><g transform="translate(142 119)">${
	        components.eyes?.value(components, colors) ?? ''
	      }</g><g transform="rotate(-8 1149.44 -1186.92)">${
	        components.nose?.value(components, colors) ?? ''
	      }</g><g transform="translate(84 154)">${
	        components.ears?.value(components, colors) ?? ''
	      }</g><g transform="translate(53 272)">${
	        components.shirt?.value(components, colors) ?? ''
	      }</g>`,
	    };
	  },
	};
