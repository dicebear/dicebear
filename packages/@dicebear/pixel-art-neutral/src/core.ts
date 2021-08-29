import type { Style } from '@dicebear/avatars';
import type { Options } from './options';
import type { ComponentPickCollection, ColorPickCollection } from './static-types';

import { schema } from './schema';
import { pickComponent } from './utils/pickComponent';
import { pickColor } from './utils/pickColor';

export const style: Style<Options> = {
  meta: {
    title: 'Pixel Art - Neutral',
    creator: 'Plastic Jam',
    license: {
      name: 'MIT',
      url: 'https://github.com/dicebear/dicebear/blob/main/packages/%40dicebear/pixel-art-neutral/LICENSE',
    },
  },
  schema,
  create: ({ prng, options }) => {
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const eyebrowsComponent = pickComponent(prng, 'eyebrows', options.eyebrows);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const glassesComponent = pickComponent(prng, 'glasses', options.glasses);

    const components: ComponentPickCollection = {
      'eyes': eyesComponent,
      'eyebrows': eyebrowsComponent,
      'mouth': mouthComponent,
      'glasses': prng.bool(options.glassesProbability) ? glassesComponent : undefined,
    }

    const colors: ColorPickCollection = {
      'hair': pickColor(prng, 'hair', options.hairColor ?? []),
      'mouth': pickColor(prng, 'mouth', options.mouthColor ?? []),
      'glasses': pickColor(prng, 'glasses', options.glassesColor ?? []),
    }

    const backgroundColor = typeof options.backgroundColor === 'string' ? [options.backgroundColor] : options.backgroundColor;
    options.backgroundColor = pickColor(prng, 'skin', backgroundColor ?? []).value;

    return {
      attributes: {
        viewBox: '0 0 14 14',
        fill: 'none',
      },
      body: `
  <g transform="translate(-3 -3)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-3 -3)">
    ${components.eyebrows?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-3 -2)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-3 -3)">
    ${components.glasses?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
