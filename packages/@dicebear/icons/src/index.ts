/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/BRj9eonsORJ7GIUdm8gnu5
 */

/*!
 * Icons (@dicebear/icons)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
* Copyright (c) 2023 The Bootstrap Authors
 *
 * Design "Bootstrap Icons" by The Bootstrap Authors licensed under MIT. / Remix of the original.
 * Source: https://github.com/twbs/icons
 * Homepage: https://getbootstrap.com/
 * License: https://github.com/twbs/icons/blob/main/LICENSE.md
 */

import type { StyleCreate, StyleMeta, StyleSchema } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Bootstrap Icons',
  creator: 'The Bootstrap Authors',
  source: 'https://github.com/twbs/icons',
  homepage: 'https://getbootstrap.com/',
  license: {
    name: 'MIT',
    url: 'https://github.com/twbs/icons/blob/main/LICENSE.md',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  return {
    attributes: {
      viewBox: '0 0 24 24',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="translate(4 4)">${components.icon?.value(components, colors) ?? ''}</g>`,
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
