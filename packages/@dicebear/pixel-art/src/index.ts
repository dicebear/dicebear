/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/WTcivb1XPf5ODtyv7ZNnU9
 */

/*!
 * Pixel Art (@dicebear/pixel-art)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Pixel Art" by Florian Körner licensed under CC0 1.0. / Remix of the original.
 * Source: https://dicebear.com
 * Homepage: https://dicebear.com
 * License: https://creativecommons.org/licenses/zero/1.0/
 */

import type { StyleCreate, StyleMeta, StyleSchema } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPreCreate } from './hooks/onPreCreate.js';
import { onPostCreate } from './hooks/onPostCreate.js';

export const meta: StyleMeta = {
  title: 'Pixel Art',
  creator: 'Florian Körner',
  source: 'https://dicebear.com',
  homepage: 'https://dicebear.com',
  license: {
    name: 'CC0 1.0',
    url: 'https://creativecommons.org/licenses/zero/1.0/',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  onPreCreate({ prng, options });

  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  onPostCreate({ prng, options, components, colors });

  return {
    attributes: {
      viewBox: '0 0 16 16',
      fill: 'none',
      'shape-rendering': 'crispEdges'
    },
    body: `<path d="M4 2h8v1h1v3h1v2h-1v3h-1v1H9v1h4v1h1v2H2v-2h1v-1h4v-1H4v-1H3V8H2V6h1V3h1V2Z" fill="${escape.xml(`#${colors.skin}`)}"/><path d="M4 2h8v1h1v3h1v2h-1v3h-1v1H4v-1H3V8H2V6h1V3h1V2Z" fill="#fff" fill-opacity=".1"/>${components.accessories?.value(components, colors) ?? ''}${components.clothing?.value(components, colors) ?? ''}${components.eyes?.value(components, colors) ?? ''}${components.glasses?.value(components, colors) ?? ''}${components.beard?.value(components, colors) ?? ''}${components.mouth?.value(components, colors) ?? ''}${components.hair?.value(components, colors) ?? ''}`,
  };
};

export { schema } from './schema.js';
export type { Options } from './types.js';
