import type { Style, StyleSchema } from '@dicebear/core';
import type { Options } from './options';

import schema from './schema.json';
import { getComponents } from './utils/getComponents';
import { getColors } from './utils/getColors';
import { onPreCreate } from './hooks/onPreCreate';
import { onPostCreate } from './hooks/onPostCreate';
import { dimensions } from './meta/components';

export const style: Style<Options> = {
  meta: {
    title: 'Personas by Draftbit',
    creator: 'Draftbit - draftbit.com',
    source: 'https://personas.draftbit.com/',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema: schema as StyleSchema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options, preview: false });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors, preview: false });

    return {
      attributes: {
        viewBox: '0 0 64 64',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `
  <path d="M37 46.08V52a5 5 0 0 1-10 0v-5.92A14.035 14.035 0 0 1 18.58 37h-.08a4.5 4.5 0 0 1-.5-8.973V27c0-7.732 6.268-14 14-14s14 6.268 14 14v1.027A4.5 4.5 0 0 1 45.42 37 14.035 14.035 0 0 1 37 46.081Z" fill="${
    colors.skin.value
  }"/>
  <mask id="personas-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="14" y="13" width="36" height="44">
    <path d="M37 46.08V52a5 5 0 0 1-10 0v-5.92A14.035 14.035 0 0 1 18.58 37h-.08a4.5 4.5 0 0 1-.5-8.973V27c0-7.732 6.268-14 14-14s14 6.268 14 14v1.027A4.5 4.5 0 0 1 45.42 37 14.035 14.035 0 0 1 37 46.081Z" fill="#fff"/>
  </mask>
  <g mask="url(#personas-a)">
    <path d="M32 13c7.732 0 14 6.268 14 14v6c0 7.732-6.268 14-14 14s-14-6.268-14-14v-6c0-7.732 6.268-14 14-14Z" fill="#fff" style="mix-blend-mode:overlay" opacity=".364"/>
  </g>
  <g transform="translate(20 24)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(2 2)">
    ${components.hair?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(11 44)">
    ${components.body?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(23 36)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(24 28)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(14 26)">
    ${components.facialHair?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
  preview: ({ prng, options, property }) => {
    const componentGroup = property.toString();
    const colorGroup = property.toString().replace(/Color$/, '');

    onPreCreate({ prng, options, preview: true });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors, preview: true });

    if (componentGroup in components) {
      const { width, height } = dimensions[componentGroup]!;

      return {
        attributes: {
          viewBox: `0 0 ${width} ${height}`,
          fill: 'none',
          'shape-rendering': 'auto',
        },
        body: components[componentGroup]?.value(components, colors) ?? '',
      };
    }

    if (colorGroup in colors) {
      return {
        attributes: {
          viewBox: `0 0 1 1`,
          fill: 'none',
          'shape-rendering': 'auto',
        },
        body: `<rect width="1" height="1" fill="${colors[colorGroup].value}" />`,
      };
    }

    return undefined;
  },
};
