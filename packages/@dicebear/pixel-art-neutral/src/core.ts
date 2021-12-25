import type { Style, StyleSchema } from '@dicebear/core';
import type { Options } from './types.js';

import { schema } from './schema.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPreCreate } from './hooks/onPreCreate.js';
import { onPostCreate } from './hooks/onPostCreate.js';
import { dimensions } from './meta/components.js';

export const style: Style<Options> = {
  meta: {
    title: 'Pixel Art - Neutral',
    creator: 'Plastic Jam',
    license: {
      name: 'MIT',
      url: 'https://github.com/dicebear/dicebear/blob/main/packages/%40dicebear/pixel-art-neutral/LICENSE',
    },
  },
  schema: schema as StyleSchema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options, preview: false });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors, preview: false });

    options.backgroundColor = [colors.background.value];

    return {
      attributes: {
        viewBox: '0 0 14 14',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `<g transform="translate(-3 -3)">${
        components.eyes?.value(components, colors) ?? ''
      }</g><g transform="translate(-3 -3)">${
        components.eyebrows?.value(components, colors) ?? ''
      }</g><g transform="translate(-3 -2)">${
        components.mouth?.value(components, colors) ?? ''
      }</g><g transform="translate(-3 -3)">${
        components.glasses?.value(components, colors) ?? ''
      }</g>`,
    };
  },
  preview: ({ prng, options, property }) => {
    const componentGroup = property.toString();
    const colorGroup = property.toString().replace(/Color$/, '');

    onPreCreate({ prng, options, preview: true });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors, preview: true });

    options.backgroundColor = [colors.background.value];

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
