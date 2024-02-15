import type { Result, Style, Options, Definition } from './types.js';
import * as svgUtils from './utils/svg.js';
import { merge as mergeOptions } from './utils/options.js';
import { create as createPrng } from './utils/prng.js';
import * as license from './utils/license.js';
import { getBackgroundColors, getBackgroundRotation, getBackgroundType } from './utils/color.js';
import { createStyleFromDefinition } from './utils/style';

export function createStyle<T extends {}>(
  style: T extends Definition ? T : Style<T>
): Style<T> {
  return 'create' in style
    ? (style as Style<T>)
    : createStyleFromDefinition(style);
}

export function createAvatar<O extends {}>(
  style: Style<O>,
  options: Options<O> = {}
): Result {
  options = mergeOptions(style, options);

  const prng = createPrng(options.seed);
  const result = style.create({ prng: prng, options });

  const backgroundType = getBackgroundType(prng, options.backgroundType ?? []);
  const backgroundColor = getBackgroundColors(prng, options.backgroundColor ?? [], backgroundType);
  const backgroundRotation = getBackgroundRotation(prng, options.backgroundRotation ?? []);

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

  if (
    backgroundColor.primary !== 'transparent' &&
    backgroundColor.secondary !== 'transparent'
  ) {
    result.body = svgUtils.addBackground(
      result,
      backgroundColor.primary,
      backgroundColor.secondary,
      backgroundType,
      backgroundRotation
    );
  }

  if (options.radius || options.clip) {
    result.body = svgUtils.addViewboxMask(result, options.radius ?? 0);
  }

  if (options.randomizeIds) {
    // Reduces the occurrence of ID collisions when rendering multiple avatars on one HTML page.
    result.body = svgUtils.randomizeIds(result);
  }

  const attributes = svgUtils.createAttrString(result);
  const metadata = license.xml(style) ?? '';

  const svg = `<svg ${attributes}>${metadata}${result.body}</svg>`;

  return {
    toString: () => svg,
    toJson: () => ({
      svg: svg,
      extra: {
        backgroundColorPrimary: backgroundColor.primary,
        backgroundColorSecondary: backgroundColor.secondary,
        backgroundType,
        backgroundRotation,
        ...result.extra?.(),
      },
    }),
    toDataUri: () => {
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    },
  };
}
