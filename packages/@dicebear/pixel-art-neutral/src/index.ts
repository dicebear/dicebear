/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/WTcivb1XPf5ODtyv7ZNnU9
 */

/*!
 * Pixel Art Neutral (@dicebear/pixel-art-neutral)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Pixel Art neutral" by Florian Körner licensed under CC0 1.0. / Remix of the original.
 * Source: https://dicebear.com
 * Homepage: https://dicebear.com
 * License: https://creativecommons.org/licenses/zero/1.0/
 */

import type { StyleCreate, StyleMeta, StyleSchema } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Pixel Art neutral',
  creator: 'Florian Körner',
  source: 'https://dicebear.com',
  homepage: 'https://dicebear.com',
  license: {
    name: 'CC0 1.0',
    url: 'https://creativecommons.org/licenses/zero/1.0/',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  return {
    attributes: {
      viewBox: '0 0 14 14',
      fill: 'none',
      'shape-rendering': 'crispEdges'
    },
    body: `<g transform="translate(-1 -2)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(-1 -2)">${components.glasses?.value(components, colors) ?? ''}</g><g transform="translate(-1)">${components.mouth?.value(components, colors) ?? ''}</g>`,
    extra: () => ({
      ...Object.entries(components).reduce<Record<string, string | undefined>>(
        (acc, [key, value]) => {
          acc[key] = value?.name;
          return acc;
        },
        {}
      ),
      ...Object.entries(colors).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          acc[`${key}Color`] = value;
          return acc;
        },
        {}
      ),
    }),
  };
};

export { schema } from './schema.js';
export type { Options } from './types.js';
