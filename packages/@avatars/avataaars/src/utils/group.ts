import { stringify, INode } from 'svgson';

export function create(content: string, x: number, y: number) {
  return `<g transform="translate(${x}, ${y})">${content}</g>`;
}
