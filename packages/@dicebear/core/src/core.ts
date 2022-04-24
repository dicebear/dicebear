import type {
  Result,
  ResultConvertOptions,
  Style,
  StyleOptions,
} from './types.js';
import * as svgUtils from './utils/svg.js';
import { merge as mergeOptions } from './utils/options.js';
import { create as createPrng } from './utils/prng.js';
import * as license from './utils/license.js';
import { toFormat } from '@dicebear/converter';

export function createAvatar<O extends {}>(
  style: Style<O>,
  options: StyleOptions<O> = {}
): Result {
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
    result.body = svgUtils.addTranslate(
      result,
      options.translateX,
      options.translateY
    );
  }

  if (backgroundColor && backgroundColor !== 'transparent') {
    result.body = svgUtils.addBackgroundColor(result, backgroundColor);
  }

  if (options.radius || options.clip) {
    result.body = svgUtils.addViewboxMask(result, options.radius ?? 0);
  }

  const attributes = svgUtils.createAttrString(result.attributes);
  const description = '<desc>Created with dicebear.com</desc>';
  const metadata = license.xml(style);
  const exif = license.exif(style);

  const avatar = `<svg ${attributes}>${description}${metadata}${result.body}</svg>`;

  return {
    toString: () => avatar,
    ...toFormat(avatar, 'svg'),
    png: ({ includeExif = false }: ResultConvertOptions = {}) => {
      return toFormat(avatar, 'png', includeExif ? exif : undefined);
    },
    jpeg: ({ includeExif = false }: ResultConvertOptions = {}) => {
      return toFormat(avatar, 'jpeg', includeExif ? exif : undefined);
    },
  };
}
