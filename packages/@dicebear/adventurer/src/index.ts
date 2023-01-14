/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/XXfL2r5Wylk623KpxDt7gO
 */

/*!
 * Adventurer (@dicebear/adventurer)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Adventurer" by Lisa Wischofsky licensed under CC BY 4.0. / Remix of the original.
 * Source: https://www.figma.com/community/file/1184595184137881796
 * Homepage: https://www.instagram.com/lischi_art/
 * License: https://creativecommons.org/licenses/by/4.0/
 */

import type { StyleCreate, StyleMeta, StyleSchema } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPostCreate } from './hooks/onPostCreate.js';

export const meta: StyleMeta = {
  title: 'Adventurer',
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

  onPostCreate({ prng, options, components, colors });

  return {
    attributes: {
      viewBox: '0 0 762 762',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `${components.base?.value(components, colors) ?? ''}<g transform="translate(-161 -83)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(-161 -83)">${components.eyebrows?.value(components, colors) ?? ''}</g><g transform="translate(-161 -83)">${components.mouth?.value(components, colors) ?? ''}</g><g transform="translate(-161 -83)">${components.features?.value(components, colors) ?? ''}</g><g transform="translate(-161 -83)">${components.glasses?.value(components, colors) ?? ''}</g><g transform="translate(-161 -83)">${components.hair?.value(components, colors) ?? ''}</g><g transform="translate(-161 -83)">${components.earrings?.value(components, colors) ?? ''}</g>`,
  };
};

export { schema } from './schema.js';
export type { Options } from './types.js';
