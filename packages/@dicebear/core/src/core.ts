import type {
  CreateAvatarResult,
  Style,
  StyleDefinition,
  StyleDefinitionOptions,
  StyleOptions,
} from './types.js';
import * as svgUtils from './utils/svg.js';
import { merge as mergeOptions } from './utils/options.js';
import { create as createPrng } from './utils/prng.js';
import * as license from './utils/license.js';
import { getBackgroundColors } from './utils/color.js';

export function createAvatar<T extends {}>(
  style: Style<T>,
  options: T extends StyleDefinition
    ? StyleDefinitionOptions<T>
    : StyleOptions<T>
): CreateAvatarResult {
  return createAvatarFromCallable(style, options);
}

export function createAvatarFromCallable<O extends {}>(
  style: Style<O>,
  options: StyleOptions<O> = {}
): CreateAvatarResult {
  options = mergeOptions(style, options);

  const prng = createPrng(options.seed);
  const result = style.create({ prng: prng, options });

  const backgroundType = prng.pick(options.backgroundType ?? [], 'solid');
  const {
    primary: primaryBackgroundColor,
    secondary: secondaryBackgroundColor,
  } = getBackgroundColors(prng, options.backgroundColor ?? [], backgroundType);

  const backgroundRotation = prng.integer(
    options.backgroundRotation?.length
      ? Math.min(...options.backgroundRotation)
      : 0,
    options.backgroundRotation?.length
      ? Math.max(...options.backgroundRotation)
      : 0
  );

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
    primaryBackgroundColor !== 'transparent' &&
    secondaryBackgroundColor !== 'transparent'
  ) {
    result.body = svgUtils.addBackground(
      result,
      primaryBackgroundColor,
      secondaryBackgroundColor,
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
        primaryBackgroundColor,
        secondaryBackgroundColor,
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

export function createAvatarFromDefinition(definition: any, options: any) {}
