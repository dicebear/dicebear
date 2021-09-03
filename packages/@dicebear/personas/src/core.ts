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
    title: 'Personas by Draftbit',
    creator: 'Draftbit - draftbit.com',
    source: 'https://personas.draftbit.com/',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const hairComponent = pickComponent(prng, 'hair', options.hair);
    const bodyComponent = pickComponent(prng, 'body', options.body);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const noseComponent = pickComponent(prng, 'nose', options.nose);
    const facialHairComponent = pickComponent(prng, 'facialHair', options.facialHair);

    const components: ComponentPickCollection = {
      'eyes': eyesComponent,
      'hair': hairComponent,
      'body': bodyComponent,
      'mouth': mouthComponent,
      'nose': noseComponent,
      'facialHair': facialHairComponent,
    }

    const colors: ColorPickCollection = {
      'hair': pickColor(prng, 'hair', options.hairColor ?? []),
      'clothing': pickColor(prng, 'clothing', options.clothingColor ?? []),
      'skin': pickColor(prng, 'skin', options.skinColor ?? []),
    }

    const backgroundColor = typeof options.backgroundColor === 'string' ? [options.backgroundColor] : options.backgroundColor;
    options.backgroundColor = pickColor(prng, 'background', backgroundColor ?? []).value;

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 64 64',
        fill: 'none',
      },
      body: `
  <path d="M37 46.08V52a5 5 0 0 1-10 0v-5.92A14.035 14.035 0 0 1 18.58 37h-.08a4.5 4.5 0 0 1-.5-8.973V27c0-7.732 6.268-14 14-14s14 6.268 14 14v1.027A4.5 4.5 0 0 1 45.42 37 14.035 14.035 0 0 1 37 46.081Z" fill="${colors.skin.value}"/>
  <mask id="personas-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="14" y="13" width="36" height="44">
    <path d="M37 46.08V52a5 5 0 0 1-10 0v-5.92A14.035 14.035 0 0 1 18.58 37h-.08a4.5 4.5 0 0 1-.5-8.973V27c0-7.732 6.268-14 14-14s14 6.268 14 14v1.027A4.5 4.5 0 0 1 45.42 37 14.035 14.035 0 0 1 37 46.081Z" fill="#fff"/>
  </mask>
  <g mask="url(#personas-a)">
    <path d="M32 13c7.732 0 14 6.268 14 14v6c0 7.732-6.268 14-14 14s-14-6.268-14-14v-6c0-7.732 6.268-14 14-14Z" fill="#fff" style="mix-blend-mode:overlay" opacity=".364"/>
  </g>
  <g transform="translate(20 24)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(2 2)">
    ${components.hair?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(11 44)">
    ${components.body?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(23 36)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g>
    <g transform="translate(24 28)">
      ${components.nose?.value(components, colors) ?? ''}
    </g>
  </g>
  <g>
    <g transform="translate(14 26)">
      ${components.facialHair?.value(components, colors) ?? ''}
    </g>
  </g>
`,
    };
  },
};
