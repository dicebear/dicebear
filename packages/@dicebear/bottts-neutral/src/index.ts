/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/4nf3pyoOuM1U9Pa8M0cL6u
 */

/*!
 * Bottts Neutral (@dicebear/bottts-neutral)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2024 Florian Körner
 *
 * Design "Bottts" by Pablo Stanley licensed under Free for personal and commercial use. / Remix of the original.
 * Source: https://bottts.com/
 * Homepage: https://twitter.com/pablostanley
 * License: https://bottts.com/
 */

import type { StyleCreate, StyleMeta } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Bottts',
  creator: 'Pablo Stanley',
  source: 'https://bottts.com/',
  homepage: 'https://twitter.com/pablostanley',
  license: {
    name: 'Free for personal and commercial use',
    url: 'https://bottts.com/',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  return {
    attributes: {
      viewBox: '0 0 120 120',
      fill: 'none',
      'shape-rendering': 'auto',
    },
    body: `<g transform="translate(22 68)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="translate(8 20)">${
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
