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
    title: 'Pixel Art',
    creator: 'Plastic Jam',
    license: {
      name: 'MIT',
      url: 'https://github.com/dicebear/dicebear/blob/main/packages/%40dicebear/pixel-art/LICENSE',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const beardComponent = pickComponent(prng, 'beard', options.beard);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const eyebrowsComponent = pickComponent(prng, 'eyebrows', options.eyebrows);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const hairComponent = pickComponent(prng, 'hair', options.hair);
    const accessoriesComponent = pickComponent(prng, 'accessories', options.accessories);
    const glassesComponent = pickComponent(prng, 'glasses', options.glasses);
    const hatComponent = pickComponent(prng, 'hat', options.hat);
    const clothingComponent = pickComponent(prng, 'clothing', options.clothing);

    const components: ComponentPickCollection = {
      'beard': prng.bool(options.beardProbability) ? beardComponent : undefined,
      'eyes': eyesComponent,
      'eyebrows': eyebrowsComponent,
      'mouth': mouthComponent,
      'hair': prng.bool(options.hairProbability) ? hairComponent : undefined,
      'accessories': prng.bool(options.accessoriesProbability) ? accessoriesComponent : undefined,
      'glasses': prng.bool(options.glassesProbability) ? glassesComponent : undefined,
      'hat': prng.bool(options.hatProbability) ? hatComponent : undefined,
      'clothing': clothingComponent,
    }

    const colors: ColorPickCollection = {
      'skin': pickColor(prng, 'skin', options.skinColor ?? []),
      'hair': pickColor(prng, 'hair', options.hairColor ?? []),
      'accessories': pickColor(prng, 'accessories', options.accessoriesColor ?? []),
      'mouth': pickColor(prng, 'mouth', options.mouthColor ?? []),
      'clothes': pickColor(prng, 'clothes', options.clothesColor ?? []),
      'hat': pickColor(prng, 'hat', options.hatColor ?? []),
      'glasses': pickColor(prng, 'glasses', options.glassesColor ?? []),
    }


    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 20 20',
        fill: 'none',
      },
      body: `
  <path d="M6 4V3h8v1h1v1h1v3h1v3h-1v2h-1v1h-1v1h-2v1h4v1h1v3H3v-3h1v-1h4v-1H6v-1H5v-1H4v-2H3V8h1V5h1V4h1Z" fill="${colors.skin.value}"/>
  <path d="M6 3v1H5v1H4v3H3v3h1v2h1v1h1v1h8v-1h1v-1h1v-2h1V8h-1V5h-1V4h-1V3H6Z" fill="#fff" fill-opacity=".1"/>
  <g>
    ${components.beard?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.eyebrows?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.hair?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.accessories?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.glasses?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.hat?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.clothing?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
