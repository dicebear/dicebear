import type {
  StyleCreateResult,
  StyleCreateResultAttributes,
} from '../types.js';
import * as escape from './escape.js';

type CreateGroupProps = {
  children: string;
  x: number;
  y: number;
};

export function createGroup({ children, x, y }: CreateGroupProps) {
  return `<g transform="translate(${x}, ${y})">${children}</g>`;
}

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

export function addBackgroundColor(
  result: StyleCreateResult,
  backgroundColor: string
) {
  let { width, height, x, y } = getViewBox(result);

  return `<rect fill="${backgroundColor}" width="${width}" height="${height}" x="${x}" y="${y}" />${result.body}`;
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

export function createAttrString(
  attributes: StyleCreateResultAttributes
): string {
  attributes = { xmlns: 'http://www.w3.org/2000/svg', ...attributes };

  return Object.keys(attributes)
    .map((attr) => `${escape.xml(attr)}="${escape.xml(attributes[attr])}"`)
    .join(' ');
}
