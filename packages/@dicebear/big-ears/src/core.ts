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

    const hairComponent = pickComponent(prng, 'hair', options.hair);
    const faceComponent = pickComponent(prng, 'face', options.face);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const earComponent = pickComponent(prng, 'ear', options.ear);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const cheekComponent = pickComponent(prng, 'cheek', options.cheek);
    const noseComponent = pickComponent(prng, 'nose', options.nose);
    const sideburnComponent = pickComponent(prng, 'sideburn', options.sideburn);
    const frontHairComponent = pickComponent(prng, 'frontHair', options.frontHair);

    const components: ComponentPickCollection = {
      hair: hairComponent,
      face: faceComponent,
      mouth: mouthComponent,
      ear: earComponent,
      eyes: eyesComponent,
      cheek: prng.bool(options.cheekProbability) ? cheekComponent : undefined,
      nose: noseComponent,
      sideburn: sideburnComponent,
      frontHair: frontHairComponent,
    };

    const colors: ColorPickCollection = {
      hair: pickColor(prng, 'hair', options.hairColor ?? []),
      skin: pickColor(prng, 'skin', options.skinColor ?? []),
    };

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 440 440',
        fill: 'none',
      },
      body: `
  <g transform="matrix(.71048 0 0 .71048 24 2)">
    ${components.hair?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(81.702 150.74) scale(.71856)">
    ${components.face?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(199.546 333.373) scale(.71856)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(280.744 235.363) scale(.71856)">
    ${components.ear?.value(components, colors) ?? ''}
  </g>
  <g transform="matrix(-.71856 0 0 .71856 161.463 235.363)">
    ${components.ear?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(114.756 215.513) scale(.71856)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(127.69 288.703) scale(.71856)">
    ${components.cheek?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(193.079 279.362) scale(.71856)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="matrix(.52237 0 0 .52237 122.898 244.766)">
    ${components.sideburn?.value(components, colors) ?? ''}
  </g>
  <g transform="matrix(-.52237 0 0 .52237 315.651 244.766)">
    ${components.sideburn?.value(components, colors) ?? ''}
  </g>
  <g transform="matrix(.52237 0 0 .52237 108.706 145.555)">
    ${components.frontHair?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
