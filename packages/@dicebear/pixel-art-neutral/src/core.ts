/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/WTcivb1XPf5ODtyv7ZNnU9/%40dicebear%2Fpixel-art?node-id=5%3A1419
 */

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
    title: 'Pixel Art neutral',
    creator: 'Florian Körner',
    source: 'https://dicebear.com',
    homepage: 'https://dicebear.com',
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
        viewBox: '0 0 14 14',
        fill: 'none',
        'shape-rendering': 'crispEdges'
      },
      body: `<g transform="translate(-1 -2)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(-1 -2)">${components.glasses?.value(components, colors) ?? ''}</g><g transform="translate(-1)">${components.mouth?.value(components, colors) ?? ''}</g>`,
    };
  },
};
