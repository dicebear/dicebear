import type { Style } from '@dicebear/avatars';
import type { Options } from './options';
import type { ComponentPickCollection, ColorPickCollection } from './static-types';

import { schema } from './schema';
import { pickComponent } from './utils/pickComponent';
import { pickColor } from './utils/pickColor';
import { onPreCreate } from './hooks/onPreCreate';
import { onPostCreate } from './hooks/onPostCreate';

export const style: Style<Options> = {
  meta: {
    title: 'Adventurer Neutral',
    creator: 'Lisa Wischofsky',
    source: 'https://www.instagram.com/lischis_adventures/',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const eyebrowsComponent = pickComponent(prng, 'eyebrows', options.eyebrows);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const accessoiresComponent = pickComponent(prng, 'accessoires', options.accessoires);

    const components: ComponentPickCollection = {
      'eyes': eyesComponent,
      'eyebrows': eyebrowsComponent,
      'mouth': mouthComponent,
      'accessoires': prng.bool(options.accessoiresProbability) ? accessoiresComponent : undefined,
    }

    const colors: ColorPickCollection = {
    }

    const backgroundColor = typeof options.backgroundColor === 'string' ? [options.backgroundColor] : options.backgroundColor;
    options.backgroundColor = pickColor(prng, 'skin', backgroundColor ?? []).value;

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 400 400',
        fill: 'none',
      },
      body: `
  <g transform="translate(-279 -322)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-279 -322)">
    ${components.eyebrows?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-279 -322)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-279 -322)">
    ${components.accessoires?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
