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
    title: 'Bottts',
    creator: 'Pablo Stanley',
    source: 'https://bottts.com/',
    license: {
      name: 'Free for personal and commercial use.',
      url: 'https://bottts.com/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);

    const components: ComponentPickCollection = {
      'mouth': mouthComponent,
      'eyes': eyesComponent,
    }

    const colors: ColorPickCollection = {
    }

    const backgroundColor = typeof options.backgroundColor === 'string' ? [options.backgroundColor] : options.backgroundColor;
    options.backgroundColor = pickColor(prng, 'base', backgroundColor ?? []).value;

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 120 120',
        fill: 'none',
        'shape-rendering': 'auto'
      },
      body: `
  <g transform="translate(22 68)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(8 20)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
