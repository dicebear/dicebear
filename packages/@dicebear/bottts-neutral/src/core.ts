/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/4nf3pyoOuM1U9Pa8M0cL6u/%40dicebear%2Fbottts?node-id=4%3A3179
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
    title: 'Bottts',
    creator: 'Pablo Stanley',
    source: 'https://bottts.com/',
    homepage: 'https://twitter.com/pablostanley',
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
        viewBox: '0 0 120 120',
        fill: 'none',
        'shape-rendering': 'auto'
      },
      body: `<g transform="translate(22 68)">${components.mouth?.value(components, colors) ?? ''}</g><g transform="translate(8 20)">${components.eyes?.value(components, colors) ?? ''}</g>`,
    };
  },
};
