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
    title: 'Identicon',
    creator: 'Florian Körner',
    license: {
      name: 'CC0 1.0',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
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
        viewBox: '0 0 5 5',
        fill: 'none',
        'shape-rendering': 'crispEdges',
      },
      body: `
  ${components.row1?.value(components, colors) ?? ''}
  ${components.row2?.value(components, colors) ?? ''}
  ${components.row3?.value(components, colors) ?? ''}
  ${components.row4?.value(components, colors) ?? ''}
  ${components.row5?.value(components, colors) ?? ''}
`,
    };
  },
  preview: ({ prng, options, property }) => {
    onPreCreate({ prng, options, preview: true });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors, preview: true });

    const componentKey = property.toString();
    if (componentKey in components) {
      const width = dimensions[componentKey].width;
      const height = dimensions[componentKey].height;

      return {
        attributes: {
          viewBox: `0 0 ${width} ${height}`,
          fill: 'none',
          'shape-rendering': 'auto',
        },
        body: components[componentKey]?.value(components, colors) ?? '',
      };
    }

    const colorKey = property.toString().replace(/Color$/, '');
    if (colorKey !== property && colorKey in colors) {
      return {
        attributes: {
          viewBox: '0 0 1 1',
          fill: 'none',
          'shape-rendering': 'auto',
        },
        body: `<rect width="1" height="1" fill="${colors[colorKey].value}" />`,
      };
    }

    return undefined;
  },
};
