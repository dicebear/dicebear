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
    title: 'Bootstrap Icons',
    creator: 'The Bootstrap Authors',
    source: 'https://github.com/twbs/icons',
    homepage: 'https://getbootstrap.com/',
    license: {
      name: 'MIT',
      url: 'https://github.com/twbs/icons/blob/main/LICENSE.md',
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
        viewBox: '0 0 24 24',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `<g transform="translate(4 4)">${
        components.icon?.value(components, colors) ?? ''
      }</g>`,
    };
  },
};
