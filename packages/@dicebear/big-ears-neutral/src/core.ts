import type { Style, StyleSchema } from '@dicebear/core';
import type { Options } from './types.js';

import { schema } from './schema.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPreCreate } from './hooks/onPreCreate.js';
import { onPostCreate } from './hooks/onPostCreate.js';

export const style: Style<Options> = {
  meta: {
    title: 'Face Generator',
    creator: 'The Visual Team',
    source: 'https://www.figma.com/community/file/986078800058673824',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema: schema as StyleSchema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors });

    options.backgroundColor = [colors.background.value];

    return {
      attributes: {
        viewBox: '0 0 210 210',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `<g transform="translate(86.8 138.9) scale(.71856)">${
        components.mouth?.value(components, colors) ?? ''
      }</g><g transform="translate(2 11) scale(.71856)">${
        components.eyes?.value(components, colors) ?? ''
      }</g><g transform="translate(15 89.2) scale(.71856)">${
        components.cheek?.value(components, colors) ?? ''
      }</g><g transform="translate(80.3 79.8) scale(.71856)">${
        components.nose?.value(components, colors) ?? ''
      }</g>`,
    };
  },
};
