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
    title: 'Fun Emoji Set',
    creator: 'Davis Uche',
    source: 'https://www.figma.com/community/file/968125295144990435',
    homepage: 'https://www.instagram.com/davedirect3/',
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
        viewBox: '0 0 200 200',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `<g transform="matrix(1.5625 0 0 1.5625 37.5 110.94)">${
        components.mouth?.value(components, colors) ?? ''
      }</g><g transform="matrix(1.5625 0 0 1.5625 31.25 59.38)">${
        components.eyes?.value(components, colors) ?? ''
      }</g>`,
    };
  },
};
