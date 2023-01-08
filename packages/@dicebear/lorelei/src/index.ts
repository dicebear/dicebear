/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/FCwwMBxsRND9Mbtpg5PUic
 */

/*!
 * Lorelei (@dicebear/lorelei)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Lorelei" by Lisa Wischofsky licensed under CC0 1.0. / Remix of the original.
 * Source: https://dicebear.com/
 * Homepage: https://www.instagram.com/lischi_art/
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
  title: 'Lorelei',
  creator: 'Lisa Wischofsky',
  source: 'https://dicebear.com/',
  homepage: 'https://www.instagram.com/lischi_art/',
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
      viewBox: '0 0 980 980',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="translate(10 -60)">${components.hair?.value(components, colors) ?? ''}</g><g transform="translate(10 -60)">${components.hairAccessories?.value(components, colors) ?? ''}</g>`,
  };
};

export { schema } from './schema.js';
export type { Options } from './types.js';
