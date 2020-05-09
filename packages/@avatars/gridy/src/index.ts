// @ts-ignore
import { inner } from 'gridy-avatars/dist/avatars';
import Random from '@avatars/core/lib/random';

type Options = {
  colorful?: boolean;
  deterministic?: boolean;
};

// See https://github.com/DiceBear/avatars/issues/64
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

export default function (random: Random, options: Options = {}) {
  let body = random.integer(0, 7);
  let bodyColor = random.integer(0, 7);

  let eyes = random.integer(0, 7);
  let eyesColor = random.integer(0, 7);

  let mouth = random.integer(0, 7);
  let mouthColor = options.colorful ? random.integer(0, 7) : eyesColor;

  let deterministic = options && options.deterministic;

  let svg = inner(`${body}${bodyColor}${eyes}${eyesColor}${mouth}${mouthColor}`);
  if (deterministic) {
    let id = random.integer(0, 10e9);
    svg = fixDeterministic(svg, id);
  }

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" version="1.1">',
    svg,
    '</svg>',
  ].join('');
}
