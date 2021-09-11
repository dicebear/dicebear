import type { Style, StyleSchema } from '@dicebear/core';
import type { Options } from './options';

import schema from './schema.json';
import { getComponents } from './utils/getComponents';
import { getColors } from './utils/getColors';
import { onPreCreate } from './hooks/onPreCreate';
import { onPostCreate } from './hooks/onPostCreate';

export const style: Style<Options> = {
  meta: {
    title: 'Bottts',
    creator: 'Pablo Stanley',
    source: 'https://bottts.com/',
    license: {
      name: 'Free for personal and commercial use',
      url: 'https://bottts.com/',
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
        viewBox: '0 0 180 180',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `
  <g transform="translate(0 66)">
    ${components.sides?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(41)">
    ${components.top?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(25 44)">
    ${components.face?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(52 124)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(38 76)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
