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
    const faceComponent = pickComponent(prng, 'face', options.face);
    const noseComponent = pickComponent(prng, 'nose', options.nose);
    const beardComponent = pickComponent(prng, 'beard', options.beard);
    const mouthComponent = pickComponent(prng, 'mouth', options.mouth);
    const topComponent = pickComponent(prng, 'top', options.top);
    const mustacheComponent = pickComponent(prng, 'mustache', options.mustache);
    const eyesComponent = pickComponent(prng, 'eyes', options.eyes);

    const components: ComponentPickCollection = {
      'face': faceComponent,
      'nose': noseComponent,
      'beard': prng.bool(options.beardPropability) ? beardComponent : undefined,
      'mouth': mouthComponent,
      'top': topComponent,
      'mustache': prng.bool(options.mustachePropability) ? mustacheComponent : undefined,
      'eyes': eyesComponent,
    }

    const colors: ColorPickCollection = {
      'top': pickColor(prng, 'top', options.topColor ?? []),
    }

    return {
      attributes: {
        viewBox: '0 0 256 256',
        fill: 'none',
      },
      body: `<g>${components.face?.value(components, colors) ?? ''}</g>`,
    };
  },
};
