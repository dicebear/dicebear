/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/3Te9c70BX2Aj4IUP35sWhF
 */

/*!
 * Big Smile (@dicebear/big-smile)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Custom Avatar" by Ashley Seo licensed under CC BY 4.0. / Remix of the original.
 * Source: https://www.figma.com/community/file/881358461963645496
 * Homepage: http://www.ashleyseo.com/
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
  title: 'Custom Avatar',
  creator: 'Ashley Seo',
  source: 'https://www.figma.com/community/file/881358461963645496',
  homepage: 'http://www.ashleyseo.com/',
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
      viewBox: '0 0 480 480',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="matrix(.85775 0 0 .85427 52 47)">${components.face?.value(components, colors) ?? ''}</g><g transform="matrix(.85472 0 0 .855 19 -17)">${components.mouth?.value(components, colors) ?? ''}</g><g transform="matrix(.85472 0 0 .855 19 -17)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="matrix(.85472 0 0 .85667 18 -15)">${components.hair?.value(components, colors) ?? ''}</g><g transform="matrix(.85472 0 0 .85667 14 -12)">${components.accessories?.value(components, colors) ?? ''}</g>`,
  };
};

export { schema } from './schema.js';
export type { Options } from './types.js';
