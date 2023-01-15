/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/XXfL2r5Wylk623KpxDt7gO
 */

/*!
 * Adventurer Neutral (@dicebear/adventurer-neutral)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Adventurer Neutral" by Lisa Wischofsky licensed under CC BY 4.0. / Remix of the original.
 * Source: https://www.figma.com/community/file/1184595184137881796
 * Homepage: https://www.instagram.com/lischi_art/
 * License: https://creativecommons.org/licenses/by/4.0/
 */

import type { StyleCreate, StyleMeta, StyleSchema } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Adventurer Neutral',
  creator: 'Lisa Wischofsky',
  source: 'https://www.figma.com/community/file/1184595184137881796',
  homepage: 'https://www.instagram.com/lischi_art/',
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
      viewBox: '0 0 400 400',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="translate(-279 -322)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(-279 -322)">${components.eyebrows?.value(components, colors) ?? ''}</g><g transform="translate(-279 -322)">${components.mouth?.value(components, colors) ?? ''}</g><g transform="translate(-279 -322)">${components.glasses?.value(components, colors) ?? ''}</g>`,
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
