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

    const styleComponent = pickComponent(prng, 'style', options.style);
    const clothingComponent = pickComponent(prng, 'clothing', options.clothing);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const noseComponent = pickComponent(prng, 'nose', options.nose);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const eyebrowsComponent = pickComponent(prng, 'eyebrows', options.eyebrows);
    const topComponent = pickComponent(prng, 'top', options.top);
    const facialHairComponent = pickComponent(prng, 'facialHair', options.facialHair);
    const accessoriesComponent = pickComponent(prng, 'accessories', options.accessories);
    const clothingGraphicComponent = pickComponent(prng, 'clothingGraphic', options.clothingGraphic);

    const components: ComponentPickCollection = {
      'style': styleComponent,
      'clothing': clothingComponent,
      'mouth': mouthComponent,
      'nose': noseComponent,
      'eyes': eyesComponent,
      'eyebrows': eyebrowsComponent,
      'top': prng.bool(options.topProbability) ? topComponent : undefined,
      'facialHair': prng.bool(options.facialHairProbability) ? facialHairComponent : undefined,
      'accessories': prng.bool(options.accessoriesProbability) ? accessoriesComponent : undefined,
      'clothingGraphic': clothingGraphicComponent,
    }

    const colors: ColorPickCollection = {
      'accessories': pickColor(prng, 'accessories', options.accessoriesColor ?? []),
      'clothes': pickColor(prng, 'clothes', options.clothesColor ?? []),
      'hat': pickColor(prng, 'hat', options.hatColor ?? []),
      'hair': pickColor(prng, 'hair', options.hairColor ?? []),
      'skin': pickColor(prng, 'skin', options.skinColor ?? []),
      'facialHair': pickColor(prng, 'facialHair', options.facialHairColor ?? []),
    }


    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 280 280',
        fill: 'none',
        'shape-rendering': 'auto'
      },
      body: `
  <g transform="translate(8)">
    ${components.style?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
