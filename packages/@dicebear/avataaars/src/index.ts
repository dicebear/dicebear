/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h
 */

/*!
 * Avataaars (@dicebear/avataaars)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2024 Florian Körner
 *
 * Design "Avataaars" by Pablo Stanley licensed under Free for personal and commercial use. / Remix of the original.
 * Source: https://avataaars.com/
 * Homepage: https://twitter.com/pablostanley
 * License: https://avataaars.com/
 */

import type { StyleCreate, StyleMeta } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPostCreate } from './hooks/onPostCreate.js';

export const meta: StyleMeta = {
  title: 'Avataaars',
  creator: 'Pablo Stanley',
  source: 'https://avataaars.com/',
  homepage: 'https://twitter.com/pablostanley',
  license: {
    name: 'Free for personal and commercial use',
    url: 'https://avataaars.com/',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  onPostCreate({ prng, options, components, colors });

  return {
    attributes: {
      viewBox: '0 0 280 280',
      fill: 'none',
      'shape-rendering': 'auto',
    },
    body: `<g transform="translate(8)">${
      components.style?.value(components, colors) ?? ''
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
