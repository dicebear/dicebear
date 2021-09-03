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
    title: 'Avatar Illustration System',
    creator: 'Micah Lanier',
    source: 'https://www.figma.com/community/file/829741575478342595',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const baseComponent = pickComponent(prng, 'base', options.base);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const eyebrowsComponent = pickComponent(prng, 'eyebrows', options.eyebrows);
    const hairComponent = pickComponent(prng, 'hair', options.hair);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const noseComponent = pickComponent(prng, 'nose', options.nose);
    const earsComponent = pickComponent(prng, 'ears', options.ears);
    const shirtComponent = pickComponent(prng, 'shirt', options.shirt);
    const earringsComponent = pickComponent(prng, 'earrings', options.earrings);
    const glassesComponent = pickComponent(prng, 'glasses', options.glasses);
    const facialHairComponent = pickComponent(prng, 'facialHair', options.facialHair);

    const components: ComponentPickCollection = {
      'base': baseComponent,
      'mouth': mouthComponent,
      'eyebrows': eyebrowsComponent,
      'hair': prng.bool(options.hairProbability) ? hairComponent : undefined,
      'eyes': eyesComponent,
      'nose': noseComponent,
      'ears': earsComponent,
      'shirt': shirtComponent,
      'earrings': prng.bool(options.earringsProbability) ? earringsComponent : undefined,
      'glasses': prng.bool(options.glassesProbability) ? glassesComponent : undefined,
      'facialHair': prng.bool(options.facialHairProbability) ? facialHairComponent : undefined,
    }

    const colors: ColorPickCollection = {
      'base': pickColor(prng, 'base', options.baseColor ?? []),
      'earring': pickColor(prng, 'earring', options.earringColor ?? []),
      'eyeShadow': pickColor(prng, 'eyeShadow', options.eyeShadowColor ?? []),
      'eyebrow': pickColor(prng, 'eyebrow', options.eyebrowColor ?? []),
      'facialHair': pickColor(prng, 'facialHair', options.facialHairColor ?? []),
      'glasses': pickColor(prng, 'glasses', options.glassesColor ?? []),
      'hair': pickColor(prng, 'hair', options.hairColor ?? []),
      'mouth': pickColor(prng, 'mouth', options.mouthColor ?? []),
      'shirt': pickColor(prng, 'shirt', options.shirtColor ?? []),
    }

    const backgroundColor = typeof options.backgroundColor === 'string' ? [options.backgroundColor] : options.backgroundColor;
    options.backgroundColor = pickColor(prng, 'background', backgroundColor ?? []).value;

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 380 380',
        fill: 'none',
      },
      body: `
  <g transform="translate(90 43)">
    ${components.base?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(180 203)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(120 122)">
    ${components.eyebrows?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(59 31)">
    ${components.hair?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(152 139)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="rotate(-8 1297.445 -1248.42)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(94 174)">
    ${components.ears?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(63 292)">
    ${components.shirt?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
