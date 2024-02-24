/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/KhTfMFWWniVgZmGVFL0KK6
 */

/*!
 * Big Ears (@dicebear/big-ears)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2024 Florian Körner
 *
 * Design "Face Generator" by The Visual Team licensed under CC BY 4.0. / Remix of the original.
 * Source: https://www.figma.com/community/file/986078800058673824
 * Homepage: https://thevisual.team/
 * License: https://creativecommons.org/licenses/by/4.0/
 */

import type { StyleCreate, StyleMeta } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Face Generator',
  creator: 'The Visual Team',
  source: 'https://www.figma.com/community/file/986078800058673824',
  homepage: 'https://thevisual.team/',
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
      viewBox: '0 0 440 440',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="matrix(.71048 0 0 .71048 24 2)">${components.hair?.value(components, colors) ?? ''}</g><g transform="translate(81.7 150.7) scale(.71856)">${components.face?.value(components, colors) ?? ''}</g><g transform="translate(199.5 333.4) scale(.71856)">${components.mouth?.value(components, colors) ?? ''}</g><g transform="translate(280.7 235.4) scale(.71856)">${components.ear?.value(components, colors) ?? ''}</g><g transform="matrix(-.71856 0 0 .71856 161.5 235.4)">${components.ear?.value(components, colors) ?? ''}</g><g transform="translate(114.8 215.5) scale(.71856)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(127.7 288.7) scale(.71856)">${components.cheek?.value(components, colors) ?? ''}</g><g transform="translate(193 279.4) scale(.71856)">${components.nose?.value(components, colors) ?? ''}</g><g transform="matrix(.52237 0 0 .52237 122.9 244.8)">${components.sideburn?.value(components, colors) ?? ''}</g><g transform="matrix(-.52237 0 0 .52237 315.7 244.8)">${components.sideburn?.value(components, colors) ?? ''}</g><g transform="matrix(.52237 0 0 .52237 108.7 145.6)">${components.frontHair?.value(components, colors) ?? ''}</g>`,
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
