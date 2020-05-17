// @ts-ignore
import { inner } from 'gridy-avatars/dist/avatars';
import { IStyle } from '@avatars/core';

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

const style: IStyle<Options> = function (prng, options = {}) {
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

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" version="1.1">',
    svg,
    '</svg>',
  ].join('');
};

export default style;
