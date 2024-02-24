/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/community/file/1198749693280469639
 */

/*!
 * Lorelei (@dicebear/lorelei)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2024 Florian Körner
 *
 * Design "Lorelei" by Lisa Wischofsky licensed under CC0 1.0. / Remix of the original.
 * Source: https://www.figma.com/community/file/1198749693280469639
 * Homepage: https://www.instagram.com/lischi_art/
 * License: https://creativecommons.org/publicdomain/zero/1.0/
 */

import type { StyleCreate, StyleMeta } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPostCreate } from './hooks/onPostCreate.js';

export const meta: StyleMeta = {
  title: 'Lorelei',
  creator: 'Lisa Wischofsky',
  source: 'https://www.figma.com/community/file/1198749693280469639',
  homepage: 'https://www.instagram.com/lischi_art/',
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
      viewBox: '0 0 980 980',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="translate(10 -60)">${components.hair?.value(components, colors) ?? ''}</g><g transform="translate(10 -60)">${components.hairAccessories?.value(components, colors) ?? ''}</g>`,
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
