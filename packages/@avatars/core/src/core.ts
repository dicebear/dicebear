import * as svgson from 'svgson';
import * as base64 from './utils/base64';
import * as prng from './utils/prng';
import * as svg from './utils/svg';

export interface IOptions {
  radius?: number;
  r?: number;
  base64?: boolean;
  width?: number;
  w?: number;
  height?: number;
  h?: number;
  margin?: number;
  m?: number;
  background?: string;
  b?: number;
}

export interface IStyle<O = {}> {
  (prng: prng.IPrng, options: Partial<O & IOptions>): string | svgson.INode;
}

export function create<O = {}>(
  style: IStyle<O>,
  seed: string = Math.random().toString(),
  options: Partial<O & IOptions> = {}
) {
  // Apply alias options
  options = {
    radius: options.r,
    width: options.w,
    height: options.h,
    margin: options.m,
    background: options.b,
    ...options,
  };

  let avatar = style(prng.create(seed), options);

  if (Object.keys(options).length > 0) {
    avatar = svg.parse(avatar);

    if (options.width) {
      svg.addWidth(avatar, options.width);
    }

    if (options.height) {
      svg.addHeight(avatar, options.height);
    }

    if (options.margin) {
      svg.addMargin(avatar, options.margin);
    }

    if (options.background) {
      svg.addBackground(avatar, options.background);
    }

    if (options.radius) {
      svg.addRadius(avatar, options.radius);
    }
  }

  avatar = svg.stringify(avatar);

  return options.base64 ? `data:image/svg+xml;base64,${base64.encode(avatar)}` : avatar;
}
