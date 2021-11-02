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
    title: 'Avatar Illustration System',
    creator: 'Micah Lanier',
    source: 'https://www.figma.com/community/file/829741575478342595',
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
        viewBox: '0 0 360 360',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `<g transform="translate(80 23)">${
        components.base?.value(components, colors) ?? ''
      }</g><g transform="translate(170 183)">${
        components.mouth?.value(components, colors) ?? ''
      }</g><g transform="translate(110 102)">${
        components.eyebrows?.value(components, colors) ?? ''
      }</g><g transform="translate(49 11)">${
        components.hair?.value(components, colors) ?? ''
      }</g><g transform="translate(142 119)">${
        components.eyes?.value(components, colors) ?? ''
      }</g><g transform="rotate(-8 1149.44 -1186.92)">${
        components.nose?.value(components, colors) ?? ''
      }</g><g transform="translate(84 154)">${
        components.ears?.value(components, colors) ?? ''
      }</g><g transform="translate(53 272)">${
        components.shirt?.value(components, colors) ?? ''
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
