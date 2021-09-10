import type { Style } from '@dicebear/core';
import type { Options } from './options';
import type { ComponentPickCollection, ColorPickCollection } from './static-types';

import { schema } from './schema';
import { pickComponent } from './utils/pickComponent';
import { pickColor } from './utils/pickColor';
import { onPreCreate } from './hooks/onPreCreate';
import { onPostCreate } from './hooks/onPostCreate';

export const style: Style<Options> = {
  meta: {
    title: 'Custom Avatar',
    creator: 'Ashley Seo',
    source: 'https://www.figma.com/community/file/881358461963645496',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const faceComponent = pickComponent(prng, 'face', options.face);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const hairComponent = pickComponent(prng, 'hair', options.hair);
    const accessoriesComponent = pickComponent(prng, 'accessories', options.accessories);

    const components: ComponentPickCollection = {
      face: faceComponent,
      mouth: mouthComponent,
      eyes: eyesComponent,
      hair: hairComponent,
      accessories: prng.bool(options.accessoriesProbability) ? accessoriesComponent : undefined,
    };

    const colors: ColorPickCollection = {
      skin: pickColor(prng, 'skin', options.skinColor ?? []),
      hair: pickColor(prng, 'hair', options.hairColor ?? []),
    };

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 480 480',
        fill: 'none',
      },
      body: `
  <g transform="matrix(.85775 0 0 .85427 52 47)">
    ${components.face?.value(components, colors) ?? ''}
  </g>
  <g transform="matrix(.85472 0 0 .855 19 -17)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="matrix(.85472 0 0 .855 19 -17)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="matrix(.85472 0 0 .85667 18 -15)">
    ${components.hair?.value(components, colors) ?? ''}
  </g>
  <g transform="matrix(.85472 0 0 .85667 14 -12)">
    ${components.accessories?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
