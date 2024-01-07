/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/gpLBQuklPE2XsOskwwv7QW
 */

/*!
 * Notionists Natural (@dicebear/notionists-neutral)
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
      viewBox: '0 0 560 560',
      fill: 'none',
      'shape-rendering': 'auto',
    },
    body: `<g transform="translate(136 328)">${
      components.lips?.value(components, colors) ?? ''
    }</g><g transform="translate(246 125)">${
      components.nose?.value(components, colors) ?? ''
    }</g><g transform="translate(-45 137)">${
      components.eyes?.value(components, colors) ?? ''
    }</g><g transform="translate(-45 137)">${
      components.glasses?.value(components, colors) ?? ''
    }</g><g transform="translate(119 114)">${
      components.brows?.value(components, colors) ?? ''
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
