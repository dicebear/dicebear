import type * as svgson from 'svgson';
import * as base64 from './base64';
import * as prng from './prng';
import * as svg from './svg';

export interface IOptions {
  seed?: string;
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

export function create<O = {}>(style: IStyle<O>, optionsOrSeed: string | Partial<O & IOptions> = {}) {
  let seed = Math.random().toString();
  let options: Partial<O & IOptions> = {};

  if (typeof optionsOrSeed === 'string') {
    seed = optionsOrSeed;
  } else {
    options = optionsOrSeed;
  }

  // Apply alias options
  options = {
    seed: seed,
    radius: options.r,
    width: options.w,
    height: options.h,
    margin: options.m,
    background: options.b,
    ...options,
  };

  let avatar = style(prng.create(options.seed), options);

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
