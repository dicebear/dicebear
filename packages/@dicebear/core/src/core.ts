import type { Style, StyleOptions } from './types.js';
import * as svgUtils from './utils/svg.js';
import { merge as mergeOptions } from './utils/options.js';
import { create as createPrng } from './utils/prng.js';
import { convertToDataUri } from './utils/svg.js';

export function createAvatar<O extends {}>(style: Style<O>, options: StyleOptions<O> = {}): string {
  options = mergeOptions(style, options);

  const prng = createPrng(options.seed);
  const result = style.create({ prng: prng, options });
  const backgroundColor = prng.pick(options.backgroundColor ?? []);

  if (options.size) {
    result.attributes.width = options.size.toString();
    result.attributes.height = options.size.toString();
  }

  if (options.scale !== undefined && options.scale !== 100) {
    result.body = svgUtils.addScale(result, options.scale);
  }

  if (options.flip) {
    result.body = svgUtils.addFlip(result);
  }

  if (options.rotate) {
    result.body = svgUtils.addRotate(result, options.rotate);
  }

  if (options.translateX || options.translateY) {
    result.body = svgUtils.addTranslate(result, options.translateX, options.translateY);
  }

  if (backgroundColor && backgroundColor !== 'transparent') {
    result.body = svgUtils.addBackgroundColor(result, backgroundColor);
  }

  if (options.radius || options.clip) {
    result.body = svgUtils.addViewboxMask(result, options.radius ?? 0);
  }

  let avatar =
    `<svg ${svgUtils.createAttrString(result.attributes)}>` +
    `${svgUtils.getMetadata(style)}` +
    `${result.body}` +
    `</svg>`;

  return options.dataUri ? convertToDataUri(avatar) : avatar;
}
