import type { Style, StyleOptions } from './types';
import * as utils from './utils';

export function createAvatar<O extends {}>(style: Style<O>, options?: StyleOptions<O>): string;
export function createAvatar<O extends {}>(
  style: Style<O>,
  options: StyleOptions<O> = {},
  previewProperty?: keyof O
): string | undefined {
  options = utils.options.merge(style, options);

  const prng = utils.prng.create(options.seed);
  const result = previewProperty
    ? style.preview?.({ prng, options, property: previewProperty })
    : style.create({ prng: prng, options });

  if (undefined === result) {
    return undefined;
  }

  if (options.size) {
    result.attributes.width = options.size.toString();
    result.attributes.height = options.size.toString();
  }

  if (options.scale !== undefined && options.scale !== 100) {
    result.body = utils.svg.addScale(result, options.scale);
  }

  if (options.flip) {
    result.body = utils.svg.addFlip(result);
  }

  if (options.rotate) {
    result.body = utils.svg.addRotate(result, options.rotate);
  }

  if (options.translateX || options.translateY) {
    result.body = utils.svg.addTranslate(result, options.translateX, options.translateY);
  }

  const backgroundColor = prng.pick(options.backgroundColor ?? []);
  const hasBackgroundColor = backgroundColor && backgroundColor !== 'transparent';
  const isBackgroundVisible = previewProperty ? previewProperty === 'backgroundColor' : true;

  if (hasBackgroundColor && isBackgroundVisible) {
    result.body = utils.svg.addBackgroundColor(result, backgroundColor);
  }

  if (options.radius || options.clip) {
    result.body = utils.svg.addViewboxMask(result, options.radius ?? 0);
  }

  let avatar = utils.svg.removeWhitespace(`
    <svg ${utils.svg.createAttrString(result.attributes)}>
      ${utils.svg.getMetadata(style)}
      ${result.body}
    </svg>
  `);

  if (options.dataUri) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`;
  }

  return avatar;
}
