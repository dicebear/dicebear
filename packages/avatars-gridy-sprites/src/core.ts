// @ts-ignore
import { outer } from 'gridy-avatars/dist/avatars';
import { Style, StyleCreateResultAttributes, StyleSchema } from '@dicebear/avatars';
import Parser from '@dicebear/avatars/lib/parser';
import { Options } from './options';
import { schema } from './schema';

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
    creator: 'Jan Forst',
    source: 'https://github.com/darosh/gridy-avatars',
    license: {
      name: 'MIT',
      url: 'https://github.com/darosh/gridy-avatars/blob/master/LICENSE',
    },
  },
  schema,
  create: ({ prng, options }) => {
    let body = prng.integer(0, 7);
    let bodyColor = prng.integer(0, 7);

    let eyes = prng.integer(0, 7);
    let eyesColor = prng.integer(0, 7);

    let mouth = prng.integer(0, 7);
    let mouthColor = options.colorful ? prng.integer(0, 7) : eyesColor;

    let deterministic = options && options.deterministic;

    let svg: string = outer(`${body}${bodyColor}${eyes}${eyesColor}${mouth}${mouthColor}`);

    if (deterministic) {
      let id = prng.integer(0, 10e9);
      svg = fixDeterministic(svg, id);
    }

    let parsed = Parser.parse(svg);
    let parsedHead: Array<typeof parsed> = [];
    let parsedBody: Array<typeof parsed> = [];

    parsed.children.forEach((child) => {
      if (child.type === 'element' && ['title', 'desc', 'defs', 'metadata'].indexOf(child.name) === -1) {
        parsedBody.push(child);
      } else {
        parsedHead.push(child);
      }
    });

    return {
      attributes: parsed.attributes as StyleCreateResultAttributes,
      head: parsedHead.map((v) => Parser.stringify(v)).join(''),
      body: parsedBody.map((v) => Parser.stringify(v)).join(''),
    };
  },
};
