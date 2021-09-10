import type { Style, StyleOptions } from './types';
import * as utils from './utils';

export function createAvatar<O extends {}>(
  style: Style<O>,
  options: StyleOptions<O> = {}
) {
  options = utils.options.merge(style, options);

  let prngInstance = utils.prng.create(options.seed);
  let result = style.create({ prng: prngInstance, options });

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
    result.body = utils.svg.addTranslate(
      result,
      options.translateX,
      options.translateY
    );
  }

  if (options.backgroundColor) {
    let backgroundColor = prngInstance.pick(options.backgroundColor ?? []);

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

  return avatar;
}
