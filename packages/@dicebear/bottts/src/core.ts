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
    title: 'Bottts',
    creator: 'Pablo Stanley',
    source: 'https://bottts.com/',
    license: {
      name: 'Free for personal and commercial use',
      url: 'https://bottts.com/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const sidesComponent = pickComponent(prng, 'sides', options.sides);
    const topComponent = pickComponent(prng, 'top', options.top);
    const faceComponent = pickComponent(prng, 'face', options.face);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const textureComponent = pickComponent(prng, 'texture', options.texture);

    const components: ComponentPickCollection = {
      sides: prng.bool(options.sidesProbability) ? sidesComponent : undefined,
      top: prng.bool(options.topProbability) ? topComponent : undefined,
      face: faceComponent,
      mouth: mouthComponent,
      eyes: eyesComponent,
      texture: prng.bool(options.textureProbability)
        ? textureComponent
        : undefined,
    };

    const colors: ColorPickCollection = {
      base: pickColor(prng, 'base', options.baseColor ?? []),
    };

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 180 180',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `
  <g transform="translate(0 66)">
    ${components.sides?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(41)">
    ${components.top?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(25 44)">
    ${components.face?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(52 124)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(38 76)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
