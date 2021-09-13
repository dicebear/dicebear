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
    title: 'Gridy',
    creator: 'Jan Forst',
    contributor: 'FRANCK Gabriel',
    source:
      'https://github.com/darosh/gridys/tree/master/packages/gridy-app-avatars',
    license: {
      name: 'MIT',
      url: 'https://github.com/darosh/gridys/blob/master/packages/gridy-app-avatars/LICENSE',
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
        viewBox: '0 0 24 24',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `
  ${components.body?.value(components, colors) ?? ''}
  <g transform="translate(4 7)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(5 14)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <mask id="gridy-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="105" height="114">
    ${components.body?.value(components, colors) ?? ''}
    <g transform="translate(4 7)">
      ${components.eyes?.value(components, colors) ?? ''}
    </g>
    <g transform="translate(5 14)">
      ${components.mouth?.value(components, colors) ?? ''}
    </g>
  </mask>
  <g mask="url(#gridy-a)">
    <path fill="#fff" fill-opacity=".15" d="M0 0h12v24H0z"/>
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
