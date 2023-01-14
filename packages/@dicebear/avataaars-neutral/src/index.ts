/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h
 */

/*!
 * Avataaars Neutral (@dicebear/avataaars-neutral)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Avataaars" by Pablo Stanley licensed under Free for personal and commercial use.. / Remix of the original.
 * Source: https://avataaars.com/
 * Homepage: https://twitter.com/pablostanley
 * License: https://avataaars.com/
 */

import type { StyleCreate, StyleMeta, StyleSchema } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Avataaars',
  creator: 'Pablo Stanley',
  source: 'https://avataaars.com/',
  homepage: 'https://twitter.com/pablostanley',
  license: {
    name: 'Free for personal and commercial use.',
    url: 'https://avataaars.com/',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  return {
    attributes: {
      viewBox: '0 0 112 112',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="translate(2 63)">${components.mouth?.value(components, colors) ?? ''}</g><g transform="translate(28 51)">${components.nose?.value(components, colors) ?? ''}</g><g transform="translate(0 19)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(0 11)">${components.eyebrows?.value(components, colors) ?? ''}</g>`,
  };
};

export { schema } from './schema.js';
export type { Options } from './types.js';
