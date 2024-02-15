/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/tyuOazZuFlU6tAF9xmJTSM
 */

/*!
 * Fun Emoji (@dicebear/fun-emoji)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2024 Florian Körner
 *
 * Design "Fun Emoji Set" by Davis Uche licensed under CC BY 4.0. / Remix of the original.
 * Source: https://www.figma.com/community/file/968125295144990435
 * Homepage: https://www.instagram.com/davedirect3/
 * License: https://creativecommons.org/licenses/by/4.0/
 */

import type { StyleCreate, StyleMeta } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Fun Emoji Set',
  creator: 'Davis Uche',
  source: 'https://www.figma.com/community/file/968125295144990435',
  homepage: 'https://www.instagram.com/davedirect3/',
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
      viewBox: '0 0 200 200',
      fill: 'none',
      'shape-rendering': 'auto',
    },
    body: `<g transform="matrix(1.5625 0 0 1.5625 37.5 110.94)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="matrix(1.5625 0 0 1.5625 31.25 59.38)">${
      components.eyes?.value(components, colors) ?? ''
    }</g>`,
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
