/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/gpLBQuklPE2XsOskwwv7QW
 */

/*!
 * Notionists (@dicebear/notionists)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2023 Florian Körner
 *
 * Design "Notionists" by Zoish licensed under CC0 1.0. / Remix of the original.
 * Source: https://heyzoish.gumroad.com/l/notionists
 * Homepage: https://bio.link/heyzoish
 * License: https://creativecommons.org/publicdomain/zero/1.0/
 */

import type { StyleCreate, StyleMeta } from '@dicebear/core';
import { escape } from '@dicebear/core';

import type { Options } from './types.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';

export const meta: StyleMeta = {
  title: 'Notionists',
  creator: 'Zoish',
  source: 'https://heyzoish.gumroad.com/l/notionists',
  homepage: 'https://bio.link/heyzoish',
  license: {
    name: 'CC0 1.0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
  const components = getComponents({ prng, options });
  const colors = getColors({ prng, options });

  return {
    attributes: {
      viewBox: '0 0 1744 1744',
      fill: 'none',
      'shape-rendering': 'auto'
    },
    body: `<g transform="translate(531 468)">${components.base?.value(components, colors) ?? ''}</g><g transform="translate(178 1050)">${components.body?.value(components, colors) ?? ''}</g><g transform="translate(266 188)">${components.hair?.value(components, colors) ?? ''}</g><g transform="translate(791 852)">${components.lips?.value(components, colors) ?? ''}</g><g transform="translate(653 786)">${components.beard?.value(components, colors) ?? ''}</g><g transform="translate(901 649)">${components.nose?.value(components, colors) ?? ''}</g><g transform="translate(610 661)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(610 661)">${components.glasses?.value(components, colors) ?? ''}</g><g transform="translate(774 638)">${components.brows?.value(components, colors) ?? ''}</g><g transform="translate(0 540)">${components.gesture?.value(components, colors) ?? ''}</g>`,
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
