import type { Style, StyleSchema } from '@dicebear/core';
import type { Options } from './types.js';

import { schema } from './schema.js';
import { getComponents } from './utils/getComponents.js';
import { getColors } from './utils/getColors.js';
import { onPreCreate } from './hooks/onPreCreate.js';
import { onPostCreate } from './hooks/onPostCreate.js';

export const style: Style<Options> = {
  meta: {
    title: 'Pixel Art',
    creator: 'Plastic Jam',
    license: {
      name: 'MIT',
      url: 'https://github.com/dicebear/dicebear/blob/main/packages/%40dicebear/pixel-art/LICENSE',
    },
  },
  schema: schema as StyleSchema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 20 20',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `<path d="M6 4V3h8v1h1v1h1v3h1v3h-1v2h-1v1h-1v1h-2v1h4v1h1v3H3v-3h1v-1h4v-1H6v-1H5v-1H4v-2H3V8h1V5h1V4h1Z" fill="${
        colors.skin.value
      }"/><path d="M6 3v1H5v1H4v3H3v3h1v2h1v1h1v1h8v-1h1v-1h1v-2h1V8h-1V5h-1V4h-1V3H6Z" fill="#fff" fill-opacity=".1"/>${
        components.beard?.value(components, colors) ?? ''
      }${components.eyes?.value(components, colors) ?? ''}${
        components.eyebrows?.value(components, colors) ?? ''
      }${components.mouth?.value(components, colors) ?? ''}${
        components.hair?.value(components, colors) ?? ''
      }${components.accessories?.value(components, colors) ?? ''}${
        components.glasses?.value(components, colors) ?? ''
      }${components.hat?.value(components, colors) ?? ''}${
        components.clothing?.value(components, colors) ?? ''
      }`,
    };
  },
};
