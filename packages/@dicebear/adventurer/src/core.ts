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
    title: 'Adventurer',
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
    const hairComponent = pickComponent(prng, 'hair', options.hair);

    const components: ComponentPickCollection = {
      'eyes': eyesComponent,
      'eyebrows': eyebrowsComponent,
      'mouth': mouthComponent,
      'accessoires': prng.bool(options.accessoiresProbability) ? accessoiresComponent : undefined,
      'hair': hairComponent,
    }

    const colors: ColorPickCollection = {
      'skin': pickColor(prng, 'skin', options.skinColor ?? []),
      'hair': pickColor(prng, 'hair', options.hairColor ?? []),
    }


    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 762 762',
        fill: 'none',
      },
      body: `
  <path d="M396.01 164.85c37.82 4.9 74.21 19.64 104.8 42.39 6.15 4.84 12.48 9.33 18.02 14.92 23.77 21.98 42.73 49.02 55.13 78.95 9.35 22.31 14.72 46.04 16.64 70.14 6.62.81 13.05 2.14 19.12 5 15.54 6.93 27.08 20.94 31.78 37.21 2.63 9.56 3.56 19.75 1.72 29.55-2.96 18.76-13.72 36.13-29.37 46.92-10.94 7.65-24.49 12.03-37.86 11.68-5.13-.05-10.04-1.6-15.13-1.79-1.85 2.17-3.23 4.84-4.76 7.25-18.66 29.62-44.57 54.51-74.64 72.4-28.1 16.73-59.9 27.16-92.46 30.32-11.08.7-21.87 2.05-32.98.74-51.69-2.3-102.07-23.44-140.15-58.43-29.03-26.55-50.84-60.83-62.54-98.39-7.09-22.85-10.62-46.78-10.07-70.71.52-40.34 12.53-80.58 33.94-114.76 19.1-30.81 45.91-56.58 77.2-74.83 29.63-17.28 63.35-27.68 97.59-29.87 14.66-1.47 29.44-.37 44.02 1.31Z" fill="#000"/>
  <path d="M363 169.06c48.47-1.39 97.32 14.7 135.81 44.12 6.55 4.06 11.72 9.49 17.36 14.64 24.33 22.63 43.2 50.95 54.93 82.02 7.43 19.61 11.86 40.2 13.56 61.09-8.89.74-17.34 2.34-25.38 6.38-2.19 1.03-1.89 4.95.68 5.23 2.35.23 4.98-1.51 7.24-2.2 14.62-5.37 31.32-4.35 44.78 3.68 11.69 6.78 20.09 18.16 23.89 31.06 2.6 8.25 2.68 17.41 1.76 25.95-2.5 17.35-12.35 33.73-26.73 43.81-15.71 11.33-37.17 14.64-54.93 6.2-3.17-1.43-5.94-3.58-9.08-5.05-2.95-1.09-4.88 2.79-2.7 4.75 3.17 2.76 7.34 4.52 11 6.56-20.14 34.15-49.45 62.7-84.41 81.47-30.2 16.31-64.44 25.53-98.78 26.15-27.63.72-55.33-4.04-81.21-13.72-30.32-11.24-57.84-29.43-80.37-52.6-22.67-23.37-39.92-51.88-50.2-82.77-14.96-44.64-14.91-94.01.27-138.59 11.05-33.06 30.28-63.21 55.37-87.39 29.67-28.73 67.65-48.54 108.13-56.67 12.8-2.52 25.94-4.24 39.01-4.12Z" fill="${colors.skin.value}"/>
  <path d="M605.03 404.4c2.63-.1 3.44 3.8 1.36 4.98-3.69 1.83-7.82 2.77-11.64 4.35-5.82 2.04-11.28 4.76-16.68 7.72 4.29 2.34 8.86 4.74 12.71 7.76 2.58 2.09 4.85 4.35 5.33 7.8-.26 3.59-2.73 6.55-5.45 8.69-5.86 4.66-13.92 7.18-20.79 10.26-1.75.62-4.43 1.99-5.59-.26-1.02-1.74-.06-3.11 1.57-3.87 6.65-3.3 14.86-5.62 20.79-10.16 1.37-1.14 3.39-2.74 3.61-4.62-4.07-5.63-12.42-8.59-18.23-12.09-2.34-1.72-2.29-4.24-.16-6.13 7.27-5.64 16.98-9.26 25.57-12.38 2.42-.83 5.03-1.95 7.6-2.05Z" fill="#000"/>
  <g transform="translate(-161 -83)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-161 -83)">
    ${components.eyebrows?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-161 -83)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-161 -83)">
    ${components.accessoires?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(-161 -83)">
    ${components.hair?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
