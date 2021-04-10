import { utils, ColorCollection, StyleSchema  } from '@dicebear/avatars';
import Color from '@dicebear/avatars/lib/color';
import Random from '@dicebear/avatars/lib/random';
import type { Options } from './options';
import schema from './schema.json';

// @ts-ignore
import initials from 'initials';

export function create(random: Random, options: Options = {}) {
  let defaults = utils.schema.defaults(schema as StyleSchema);
  let backgroundColors: string[] = [];

  if (options.background) {
    backgroundColors.push(options.background);

    options.background = undefined;
  } else {
    Object.keys(Color.collection).forEach((backgroundColor) => {
      if (
        options.backgroundColors === undefined ||
        options.backgroundColors.length === 0 ||
        options.backgroundColors.indexOf(backgroundColor as keyof ColorCollection) !== -1
      ) {
        let colorCollection = Color.collection[backgroundColor as keyof ColorCollection];

        backgroundColors.push(colorCollection[options.backgroundColorLevel ?? defaults.backgroundColorLevel as keyof typeof colorCollection]);
      }
    });
  }

  let backgroundColor = random.pickone(backgroundColors);
  let seedInitials = (initials(random.seed.trim()) as string).toLocaleUpperCase().slice(0, options.chars ?? defaults.chars as number);
  let fontFamily = 'Arial,sans-serif';

  let fontSize = (options.fontSize ?? defaults.fontSize as number) / 100;

  // prettier-ignore
  let svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate;" viewBox="0 0 1 1" version="1.1">`,
    `<rect width="1" height="1" fill="${backgroundColor}"></rect>`,
    options.margin ? `<g transform="translate(${options.margin / 100}, ${options.margin / 100})">` : '',
    options.margin ? `<g transform="scale(${1 - (options.margin * 2) / 100})">` : '',
    `<text x="50%" y="50%" style="${options.bold ? 'font-weight: bold;' : ''} font-family: ${fontFamily}; font-size: ${fontSize}px" fill="#FFF" text-anchor="middle" dy="${(fontSize * .356).toFixed(3)}">${seedInitials}</text>`,
    options.margin ? '</g>' : '',
    options.margin ? '</g>' : '',
    '</svg>'
  ].join('');

  options.margin = undefined;

  return svg;
}

export default create;
