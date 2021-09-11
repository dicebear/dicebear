import type { Style, StyleSchema } from '@dicebear/core';
import type { Options } from './options';

import schema from './schema.json';
import { getComponents } from './utils/getComponents';
import { getColors } from './utils/getColors';
import { onPreCreate } from './hooks/onPreCreate';
import { onPostCreate } from './hooks/onPostCreate';

export const style: Style<Options> = {
  meta: {
    title: 'Bottts',
    creator: 'Pablo Stanley',
    source: 'https://bottts.com/',
    license: {
      name: 'Free for personal and commercial use',
      url: 'https://bottts.com/',
    },
  },
  schema: schema as StyleSchema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors });

    options.backgroundColor = colors.background.value;

    return {
      attributes: {
        viewBox: '0 0 120 120',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `
  <g transform="translate(22 68)">
    ${components.mouth?.value.render(components, colors) ?? ''}
  </g>
  <g transform="translate(8 20)">
    ${components.eyes?.value.render(components, colors) ?? ''}
  </g>
`,
    };
  },
  preview: ({ prng, options, property }) => {
    onPreCreate({ prng, options });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors });

    const componentKey = property.toString();
    if (componentKey in components) {
      const width = components[componentKey]?.value.width ?? 0;
      const height = components[componentKey]?.value.height ?? 0;

      return {
        attributes: {
          viewBox: `0 0 ${width} ${height}`,
          fill: 'none',
          'shape-rendering': 'auto',
        },
        body: components[componentKey]?.value.render(components, colors) ?? '',
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
