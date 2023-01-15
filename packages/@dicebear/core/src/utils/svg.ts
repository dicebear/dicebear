import type { BackgroundType, Prng, StyleCreateResult } from '../types.js';

import * as escape from './escape.js';
import { create as createPrng } from './prng.js';

export function getViewBox(result: StyleCreateResult) {
  let viewBox = result.attributes['viewBox'].split(' ');
  let x = parseInt(viewBox[0]);
  let y = parseInt(viewBox[1]);
  let width = parseInt(viewBox[2]);
  let height = parseInt(viewBox[3]);

  return {
    x,
    y,
    width,
    height,
  };
}

export function addBackground(
  result: StyleCreateResult,
  primaryColor: string,
  secondaryColor: string,
  type: BackgroundType,
  rotation: number
) {
  let { width, height, x, y } = getViewBox(result);

  const solidBackground = `<rect fill="${primaryColor}" width="${width}" height="${height}" x="${x}" y="${y}" />`;

  switch (type) {
    case 'solid':
      return solidBackground + result.body;

    case 'gradientLinear':
      return (
        `<rect fill="url(#backgroundLinear)" width="${width}" height="${height}" x="${x}" y="${y}" />` +
        `<defs>` +
        `<linearGradient id="backgroundLinear" gradientTransform="rotate(${rotation} 0.5 0.5)">` +
        `<stop stop-color="${primaryColor}"/>` +
        `<stop offset="1" stop-color="${secondaryColor}"/>` +
        `</linearGradient>` +
        `</defs>` +
        result.body
      );
  }
}

export function addScale(result: StyleCreateResult, scale: number) {
  let { width, height, x, y } = getViewBox(result);

  let percent = scale ? (scale - 100) / 100 : 0;

  let translateX = (width / 2 + x) * percent * -1;
  let translateY = (height / 2 + y) * percent * -1;

  return `<g transform="translate(${translateX} ${translateY}) scale(${
    scale / 100
  })">${result.body}</g>`;
}

export function addTranslate(
  result: StyleCreateResult,
  x?: number,
  y?: number
) {
  let viewBox = getViewBox(result);

  let translateX = (viewBox.width + viewBox.x * 2) * ((x ?? 0) / 100);
  let translateY = (viewBox.height + viewBox.y * 2) * ((y ?? 0) / 100);

  return `<g transform="translate(${translateX} ${translateY})">${result.body}</g>`;
}

export function addRotate(result: StyleCreateResult, rotate: number) {
  let { width, height, x, y } = getViewBox(result);

  return `<g transform="rotate(${rotate}, ${width / 2 + x}, ${
    height / 2 + y
  })">${result.body}</g>`;
}

export function addFlip(result: StyleCreateResult) {
  let { width, x } = getViewBox(result);

  return `<g transform="scale(-1 1) translate(${width * -1 - x * 2} 0)">${
    result.body
  }</g>`;
}

export function addViewboxMask(result: StyleCreateResult, radius: number) {
  let { width, height, x, y } = getViewBox(result);

  let rx = radius ? (width * radius) / 100 : 0;
  let ry = radius ? (height * radius) / 100 : 0;

  return (
    `<mask id="viewboxMask">` +
    `<rect width="${width}" height="${height}" rx="${rx}" ry="${ry}" x="${x}" y="${y}" fill="#fff" />` +
    `</mask>` +
    `<g mask="url(#viewboxMask)">${result.body}</g>`
  );
}

export function createAttrString(result: StyleCreateResult): string {
  const attributes: Record<string, string> = {
    xmlns: 'http://www.w3.org/2000/svg',
    ...result.attributes,
  };

  return Object.keys(attributes)
    .map((attr) => `${escape.xml(attr)}="${escape.xml(attributes[attr])}"`)
    .join(' ');
}

export function randomizeIds(result: StyleCreateResult, seed: string): string {
  const prng = createPrng(
    JSON.stringify({
      attributes: result.attributes,
      seed,
    })
  );

  const ids: Record<string, string> = {};

  return result.body.replace(
    /(id="|url\(#)([a-z0-9-_]+)([")])/gi,
    (match, m1, m2, m3) => {
      ids[m2] = ids[m2] || prng.string(8);

      return `${m1}${ids[m2]}${m3}`;
    }
  );
}
