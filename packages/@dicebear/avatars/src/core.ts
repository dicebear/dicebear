import type { Style, StyleOptions } from './types';
import * as utils from './utils';

export function createAvatar<O extends {}>(style: Style<O>, options: StyleOptions<O> = {}) {
  options = utils.options.merge(style, options);

  let prngInstance = utils.prng.create(options.seed);
  let result = style.create({ prng: prngInstance, options });

  if (options.size) {
    result.attributes.width = options.size.toString();
    result.attributes.height = options.size.toString();
  } else {
    if (options.width) {
      result.attributes.width = options.width.toString();
    }

    if (options.height) {
      result.attributes.height = options.height.toString();
    }
  }

  if (options.scale && options.scale !== 100) {
    result.body = utils.svg.addScale(result, options.scale);
  } else if (options.margin) {
    result.body = utils.svg.addMargin(result, options);
  }

  if (options.flip) {
    result.body = utils.svg.addFlip(result);
  }

  if (options.rotate) {
    result.body = utils.svg.addRotate(result, options.rotate);
  }

  if (options.backgroundColor) {
    let backgroundColor = Array.isArray(options.backgroundColor)
      ? prngInstance.pick(options.backgroundColor)
      : options.backgroundColor;

    result.body = utils.svg.addBackgroundColor(result, backgroundColor);
  }

  result.body = utils.svg.addViewboxMask(result, options.radius ?? 0);

  const hasMetadata = Boolean(result.head?.match(/<metadata([^>]*)>/));

  let avatar = utils.svg.removeWhitespace(`
    <svg ${utils.svg.createAttrString(result.attributes)}>
      ${hasMetadata ? '' : utils.svg.getMetadata(style)}
      ${result.head ?? ''}
      ${result.body}
    </svg>
  `);

  if (options.dataUri) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`;
  }

  /** @deprecated - will be removed with version 5.0 */
  if (options.base64) {
    // @see https://www.base64encoder.io/javascript/
    let encoded = encodeURIComponent(avatar).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(`0x${p1}`));
    });

    // @ts-ignore
    return `data:image/svg+xml;base64,${btoa(encoded)}`;
  }

  return avatar;
}
