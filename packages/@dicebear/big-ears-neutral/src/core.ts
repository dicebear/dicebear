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
    title: 'Face Generator',
    creator: 'The Visual Team',
    source: 'https://www.figma.com/community/file/986078800058673824',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const cheekComponent = pickComponent(prng, 'cheek', options.cheek);
    const noseComponent = pickComponent(prng, 'nose', options.nose);

    const components: ComponentPickCollection = {
      mouth: mouthComponent,
      eyes: eyesComponent,
      cheek: prng.bool(options.cheekProbability) ? cheekComponent : undefined,
      nose: noseComponent,
    };

    const colors: ColorPickCollection = {};

    const backgroundColor =
      typeof options.backgroundColor === 'string' ? [options.backgroundColor] : options.backgroundColor;
    options.backgroundColor = pickColor(prng, 'skin', backgroundColor ?? []).value;

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 210 210',
        fill: 'none',
      },
      body: `
  <g transform="translate(86.79 138.86) scale(.71856)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(2 11) scale(.71856)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(14.934 89.19) scale(.71856)">
    ${components.cheek?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(80.323 79.849) scale(.71856)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
