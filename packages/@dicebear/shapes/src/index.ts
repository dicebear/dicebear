/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/bX8ZT8jK2fo5Uy8G6j2Qic
 */

/*!
 * Shapes (@dicebear/shapes)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2024 Florian Körner
 *
 * Design "Shapes" by DiceBear licensed under CC0 1.0.
 * Source: https://www.dicebear.com
 * Homepage: https://www.dicebear.com
 * License: https://creativecommons.org/publicdomain/zero/1.0/
 */

import type { StyleCreate, StyleMeta } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPreCreate } from './hooks/onPreCreate.js';

export const meta: StyleMeta = {
  title: 'Shapes',
  creator: 'DiceBear',
  source: 'https://www.dicebear.com',
  homepage: 'https://www.dicebear.com',
  license: {
    name: 'CC0 1.0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  onPreCreate({ prng, options });

  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  return {
    attributes: {
      viewBox: '0 0 100 100',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="matrix(1.2 0 0 1.2 -10 -10)">${components.shape1?.value(components, colors) ?? ''}</g><g transform="matrix(.8 0 0 .8 10 10)">${components.shape2?.value(components, colors) ?? ''}</g><g transform="matrix(.4 0 0 .4 30 30)">${components.shape3?.value(components, colors) ?? ''}</g>`,
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
