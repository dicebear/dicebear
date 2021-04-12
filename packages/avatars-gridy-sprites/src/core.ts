// @ts-ignore
import { inner } from 'gridy-avatars/dist/avatars';
import { Style, StyleSchema } from '@dicebear/avatars';
import { Options } from './options';
import schema from './schema.json';

// See https://github.com/dicebear/dicebear/issues/64
let fixDeterministicClipARegExp = /clipPath id="clip-a-([0-9]*)"/;
let fixDeterministic = (svg: string, id: number): string => {
  let match = svg.match(fixDeterministicClipARegExp);
  if (!match) {
    return svg;
  }
  let [, prevId] = match;
  let clipA = new RegExp(`clip-a-${prevId}`, 'g');
  let clipB = new RegExp(`clip-b-${prevId}`, 'g');
  return svg.replace(clipA, `clip-a-${id}`).replace(clipB, `clip-b-${id}`);
};

export const style: Style<Options> = {
  meta: {
    title: 'Gridy Avatars',
    creator: '(c) 2018 Jan Forst',
    source: 'https://github.com/darosh/gridy-avatars',
    license: {
      name: 'MIT',
      link: 'https://opensource.org/licenses/MIT',
    },
  },
  schema: schema as StyleSchema,
  create: ({ prng, options }) => {
    let body = prng.integer(0, 7);
    let bodyColor = prng.integer(0, 7);

    let eyes = prng.integer(0, 7);
    let eyesColor = prng.integer(0, 7);

    let mouth = prng.integer(0, 7);
    let mouthColor = options.colorful ? prng.integer(0, 7) : eyesColor;

    let deterministic = options && options.deterministic;

    let svg = inner(`${body}${bodyColor}${eyes}${eyesColor}${mouth}${mouthColor}`);
    if (deterministic) {
      let id = prng.integer(0, 10e9);
      svg = fixDeterministic(svg, id);
    }

    return {
      attributes: {
        viewBox: '0 0 24 24',
        style: 'isolation:isolate',
      },
      body: svg,
    };
  },
};
