import * as base64 from './base64';
import * as svg from './svg';
import * as options from './options';
import type * as style from './style';

export function create<O = {}>(
  styleObject: style.IStyle<O>,
  optionsOrSeed: string | Partial<style.IStyleOptions<O>> = {}
) {
  let seed = Math.random().toString();
  let optionsObject: Partial<style.IStyleOptions<O>> = {};

  if (typeof optionsOrSeed === 'string') {
    seed = optionsOrSeed;
  } else {
    optionsObject = optionsOrSeed;
  }

  // Apply defaults and alias options and process config
  let processedOptions = options.process<style.IStyleOptions<O>>({
    ...styleObject.options,
    seed: seed,
    radius: optionsObject.r,
    width: optionsObject.w,
    height: optionsObject.h,
    margin: optionsObject.m,
    background: optionsObject.b,
    ...optionsObject,
  });

  let avatar = styleObject.generator(processedOptions);

  if (Object.keys(options).length > 0) {
    avatar = svg.parse(avatar);

    if (typeof processedOptions.width === 'number') {
      svg.addWidth(avatar, processedOptions.width as number);
    }

    if (typeof processedOptions.height === 'number') {
      svg.addHeight(avatar, processedOptions.height as number);
    }

    if (typeof processedOptions.margin === 'number') {
      svg.addMargin(avatar, processedOptions.margin as number);
    }

    if (typeof processedOptions.background === 'string') {
      svg.addBackground(avatar, processedOptions.background as string);
    }

    if (typeof processedOptions.radius === 'number') {
      svg.addRadius(avatar, processedOptions.radius as number);
    }
  }

  avatar = svg.stringify(avatar);

  return processedOptions.base64 ? `data:image/svg+xml;base64,${base64.encode(avatar)}` : avatar;
}
