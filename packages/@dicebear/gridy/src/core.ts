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
    title: 'Gridy',
    creator: 'Jan Forst',
    contributor: 'Franck Gabriel',
    source:
      'https://github.com/darosh/gridys/tree/master/packages/gridy-app-avatars',
    license: {
      name: 'MIT',
      url: 'https://github.com/darosh/gridys/blob/master/packages/gridy-app-avatars/LICENSE',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const bodyComponent = pickComponent(prng, 'body', options.body);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);

    const components: ComponentPickCollection = {
      body: bodyComponent,
      eyes: eyesComponent,
      mouth: mouthComponent,
    };

    const colors: ColorPickCollection = {
      body: pickColor(prng, 'body', options.bodyColor ?? []),
      eyes: pickColor(prng, 'eyes', options.eyesColor ?? []),
      mouth: pickColor(prng, 'mouth', options.mouthColor ?? []),
    };

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 24 24',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `
  ${components.body?.value(components, colors) ?? ''}
  <g transform="translate(4 7)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(5 14)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <mask id="gridy-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="105" height="114">
    ${components.body?.value(components, colors) ?? ''}
    <g transform="translate(4 7)">
      ${components.eyes?.value(components, colors) ?? ''}
    </g>
    <g transform="translate(5 14)">
      ${components.mouth?.value(components, colors) ?? ''}
    </g>
  </mask>
  <g mask="url(#gridy-a)">
    <path fill="#fff" fill-opacity=".15" d="M0 0h12v24H0z"/>
  </g>
`,
    };
  },
};
