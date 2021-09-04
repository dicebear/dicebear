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
    title: 'Miniavs - Free Avatar Creator',
    creator: 'Webpixels',
    source: 'https://www.figma.com/community/file/923211396597067458',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const headComponent = pickComponent(prng, 'head', options.head);
    const bodyComponent = pickComponent(prng, 'body', options.body);
    const hairComponent = pickComponent(prng, 'hair', options.hair);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const glassesComponent = pickComponent(prng, 'glasses', options.glasses);
    const mustacheComponent = pickComponent(prng, 'mustache', options.mustache);
    const blushesComponent = pickComponent(prng, 'blushes', options.blushes);

    const components: ComponentPickCollection = {
      'head': headComponent,
      'body': bodyComponent,
      'hair': hairComponent,
      'mouth': mouthComponent,
      'eyes': eyesComponent,
      'glasses': prng.bool(options.glassesProbability) ? glassesComponent : undefined,
      'mustache': prng.bool(options.mustacheProbability) ? mustacheComponent : undefined,
      'blushes': prng.bool(options.blushesProbability) ? blushesComponent : undefined,
    }

    const colors: ColorPickCollection = {
      'skin': pickColor(prng, 'skin', options.skinColor ?? []),
      'hair': pickColor(prng, 'hair', options.hairColor ?? []),
      'body': pickColor(prng, 'body', options.bodyColor ?? []),
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
  <g>
    ${components.head?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.body?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.hair?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(1)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(0 -1)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.glasses?.value(components, colors) ?? ''}
  </g>
  <g>
    ${components.mustache?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
