/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sNI8OuD41VSfu5Gfl3eprv/%40dicebear%2Fthumbs
 */

/*!
 * Thumbs (@dicebear/thumbs)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2024 Florian Körner
 *
 * Design "Thumbs" by Florian Körner licensed under CC0 1.0. / Remix of the original.
 * Source: https://dicebear.com
 * Homepage: https://dicebear.com
 * License: https://creativecommons.org/publicdomain/zero/1.0/
 */

import type { StyleCreate, StyleMeta } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPostCreate } from './hooks/onPostCreate.js';

export const meta: StyleMeta = {
  title: 'Thumbs',
  creator: 'Florian Körner',
  source: 'https://dicebear.com',
  homepage: 'https://dicebear.com',
  license: {
    name: 'CC0 1.0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  onPostCreate({ prng, options, components, colors });

  return {
    attributes: {
      viewBox: '0 0 100 100',
      fill: 'none',
      'shape-rendering': 'auto',
    },
    body: `${components.shape?.value(components, colors) ?? ''}`,
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
