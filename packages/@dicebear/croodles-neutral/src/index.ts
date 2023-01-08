/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/ZHPv3t2L6Asuuql9ND4q1L
 */

/*!
 * Croodles - Neutral (@dicebear/croodles-neutral)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Croodles - Doodle your face" by vijay verma licensed under CC BY 4.0. / Remix of the original.
 * Source: https://www.figma.com/community/file/966199982810283152
 * Homepage: https://vijayverma.co/
 * License: https://creativecommons.org/licenses/by/4.0/
 */

import type { StyleCreate, StyleMeta, StyleSchema } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPreCreate } from './hooks/onPreCreate.js';
import { onPostCreate } from './hooks/onPostCreate.js';

export const meta: StyleMeta = {
  title: 'Croodles - Doodle your face',
  creator: 'vijay verma',
  source: 'https://www.figma.com/community/file/966199982810283152',
  homepage: 'https://vijayverma.co/',
  license: {
    name: 'CC BY 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  onPreCreate({ prng, options });

  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  onPostCreate({ prng, options, components, colors });

  return {
    attributes: {
      viewBox: '0 0 128 128',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="translate(7 4)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(47 46)">${components.nose?.value(components, colors) ?? ''}</g><g transform="translate(30 93)">${components.mouth?.value(components, colors) ?? ''}</g>`,
  };
};

export { schema } from './schema.js';
export type { Options } from './types.js';
