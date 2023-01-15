/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/FCwwMBxsRND9Mbtpg5PUic
 */

/*!
 * Lorelei Neutral (@dicebear/lorelei-neutral)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Lorelei Neutral" by Lisa Wischofsky licensed under CC0 1.0. / Remix of the original.
 * Source: https://dicebear.com/
 * Homepage: https://www.instagram.com/lischi_art/
 * License: https://creativecommons.org/licenses/zero/1.0/
 */

import type { StyleCreate, StyleMeta, StyleSchema } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Lorelei Neutral',
  creator: 'Lisa Wischofsky',
  source: 'https://dicebear.com/',
  homepage: 'https://www.instagram.com/lischi_art/',
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
      viewBox: '0 0 600 600',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="translate(-246 -234)">${components.eyebrows?.value(components, colors) ?? ''}</g><g transform="translate(-246 -234)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(-246 -234)">${components.freckles?.value(components, colors) ?? ''}</g><g transform="translate(-246 -234)">${components.mouth?.value(components, colors) ?? ''}</g><g transform="translate(-246 -234)">${components.nose?.value(components, colors) ?? ''}</g><g transform="translate(-246 -234)">${components.glasses?.value(components, colors) ?? ''}</g>`,
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
