import type { Style } from '@dicebear/core';
import type { Options } from './options';
import type {
  ComponentPickCollection,
  ColorPickCollection,
} from './static-types';

import { schema } from './schema';
import { pickComponent } from './utils/pickComponent';
import { pickColor } from './utils/pickColor';
import { onPreCreate } from './hooks/onPreCreate';
import { onPostCreate } from './hooks/onPostCreate';

export const style: Style<Options> = {
  meta: {
    title: 'Avataaars',
    creator: 'Pablo Stanley',
    source: 'https://avataaars.com/',
    license: {
      name: 'Free for personal and commercial use.',
      url: 'https://avataaars.com/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const noseComponent = pickComponent(prng, 'nose', options.nose);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const eyebrowsComponent = pickComponent(prng, 'eyebrows', options.eyebrows);

    const components: ComponentPickCollection = {
      mouth: mouthComponent,
      nose: noseComponent,
      eyes: eyesComponent,
      eyebrows: eyebrowsComponent,
    };

    const colors: ColorPickCollection = {};

    const backgroundColor =
      typeof options.backgroundColor === 'string'
        ? [options.backgroundColor]
        : options.backgroundColor;
    options.backgroundColor = pickColor(
      prng,
      'skin',
      backgroundColor ?? []
    ).value;

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 112 112',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `
  <g transform="translate(2 63)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(28 51)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(0 19)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(0 11)">
    ${components.eyebrows?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
