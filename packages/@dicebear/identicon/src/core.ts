import type { Style, StyleSchema } from '@dicebear/core';
import type { Options } from './types.js';

import { schema } from './schema.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPreCreate } from './hooks/onPreCreate.js';
import { onPostCreate } from './hooks/onPostCreate.js';

export const style: Style<Options> = {
  meta: {
    title: 'Identicon',
    creator: 'Florian Körner',
    license: {
      name: 'CC0 1.0',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
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
        viewBox: '0 0 5 5',
        fill: 'none',
        'shape-rendering': 'crispEdges',
      },
      body: `${components.row1?.value(components, colors) ?? ''}${
        components.row2?.value(components, colors) ?? ''
      }${components.row3?.value(components, colors) ?? ''}${
        components.row4?.value(components, colors) ?? ''
      }${components.row5?.value(components, colors) ?? ''}`,
    };
  },
};
