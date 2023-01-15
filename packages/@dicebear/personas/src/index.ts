/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/oa0iScDLrh1tVFzSud2Dwc
 */

/*!
 * Personas (@dicebear/personas)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Personas by Draftbit" by Draftbit - draftbit.com licensed under CC BY 4.0. / Remix of the original.
 * Source: https://personas.draftbit.com/
 * Homepage: https://draftbit.com/
 * License: https://creativecommons.org/licenses/by/4.0/
 */

import type { StyleCreate, StyleMeta, StyleSchema } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Personas by Draftbit',
  creator: 'Draftbit - draftbit.com',
  source: 'https://personas.draftbit.com/',
  homepage: 'https://draftbit.com/',
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
      viewBox: '0 0 64 64',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<path d="M37 46.08V52a5 5 0 0 1-10 0v-5.92A14.04 14.04 0 0 1 18.58 37h-.08a4.5 4.5 0 0 1-.5-8.97V27a14 14 0 1 1 28 0v1.03a4.5 4.5 0 0 1-.58 8.97A14.04 14.04 0 0 1 37 46.08Z" fill="${escape.xml(`${colors.skin}`)}"/><mask id="personas-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="14" y="13" width="36" height="44"><path d="M37 46.08V52a5 5 0 0 1-10 0v-5.92A14.04 14.04 0 0 1 18.58 37h-.08a4.5 4.5 0 0 1-.5-8.97V27a14 14 0 1 1 28 0v1.03a4.5 4.5 0 0 1-.58 8.97A14.04 14.04 0 0 1 37 46.08Z" fill="#fff"/></mask><g mask="url(#personas-a)"><path d="M32 13a14 14 0 0 1 14 14v6a14 14 0 1 1-28 0v-6a14 14 0 0 1 14-14Z" fill="#fff" style="mix-blend-mode:overlay" opacity=".36"/></g><g transform="translate(20 24)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(2 2)">${components.hair?.value(components, colors) ?? ''}</g><g transform="translate(11 44)">${components.body?.value(components, colors) ?? ''}</g><g transform="translate(23 36)">${components.mouth?.value(components, colors) ?? ''}</g><g transform="translate(24 28)">${components.nose?.value(components, colors) ?? ''}</g><g transform="translate(14 26)">${components.facialHair?.value(components, colors) ?? ''}</g>`,
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
