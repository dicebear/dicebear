import type { Style } from '@dicebear/avatars';
import type { Options } from './options';
import type { ComponentPickCollection, ColorPickCollection } from './static-types';

import { schema } from './schema';
import { pickComponent } from './utils/pickComponent';
import { pickColor } from './utils/pickColor';

export const style: Style<Options> = {
  meta: {
    title: 'Croodles - Doodle your face',
    creator: 'vijay verma',
    source: 'https://www.figma.com/community/file/966199982810283152',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);
    const noseComponent = pickComponent(prng, 'nose', options.nose);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);

    const components: ComponentPickCollection = {
      'eyes': eyesComponent,
      'nose': noseComponent,
      'mouth': mouthComponent,
    }

    const colors: ColorPickCollection = {
    }


    return {
      attributes: {
        viewBox: '0 0 128 128',
        fill: 'none',
      },
      body: `
  <g transform="translate(7 4)">
    ${components.eyes?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(47 46)">
    ${components.nose?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(30 93)">
    ${components.mouth?.value(components, colors) ?? ''}
  </g>
`,
    };
  },
};
