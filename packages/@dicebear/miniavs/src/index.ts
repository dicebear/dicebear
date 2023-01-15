/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/Vh7N9shKJTNHNo9prUzkZe
 */

/*!
 * Miniavs (@dicebear/miniavs)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Miniavs - Free Avatar Creator" by Webpixels licensed under CC BY 4.0. / Remix of the original.
 * Source: https://www.figma.com/community/file/923211396597067458
 * Homepage: https://webpixels.io/
 * License: https://creativecommons.org/licenses/by/4.0/
 */

import type { StyleCreate, StyleMeta, StyleSchema } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Miniavs - Free Avatar Creator',
  creator: 'Webpixels',
  source: 'https://www.figma.com/community/file/923211396597067458',
  homepage: 'https://webpixels.io/',
  license: {
    name: 'CC BY 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  return {
    attributes: {
      viewBox: '0 0 64 64',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `${components.head?.value(components, colors) ?? ''}${components.body?.value(components, colors) ?? ''}${components.hair?.value(components, colors) ?? ''}<g transform="translate(1)">${components.mouth?.value(components, colors) ?? ''}</g><g transform="translate(0 -1)">${components.eyes?.value(components, colors) ?? ''}</g>${components.glasses?.value(components, colors) ?? ''}${components.mustache?.value(components, colors) ?? ''}`,
    extra: () => ({
      ...Object.entries(components).reduce<Record<string, string | undefined>>(
        (acc, [key, value]) => {
          acc[key] = value?.name;
          return acc;
        },
        {}
      ),
      ...colors,
    }),
  };
};

export { schema } from './schema.js';
export type { Options } from './types.js';
