import { Style, StyleSchema, ColorCollection, utils } from '@dicebear/avatars';
import Color from '@dicebear/avatars/lib/color';
import { Options } from './options';
import { schema } from './schema';

// @ts-ignore
import initials from 'initials';

export const style: Style<Options> = {
  meta: {
    title: 'Initials',
    creator: 'Florian Körner',
    source: 'https://github.com/dicebear/dicebear',
    license: {
      name: 'CC0 1.0',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    let defaults = utils.schema.defaults(schema as StyleSchema);
    let backgroundColors: string[] = [];

    if (options.background && options.background !== 'transparent') {
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

          backgroundColors.push(
            colorCollection[
              options.backgroundColorLevel ?? (defaults.backgroundColorLevel as keyof typeof colorCollection)
            ]
          );
        }
      });
    }

    let backgroundColor = prng.pick(backgroundColors);
    let seedInitials = (initials(prng.seed.trim()) as string)
      .toLocaleUpperCase()
      .slice(0, options.chars ?? (defaults.chars as number));
    let fontFamily = 'Arial,sans-serif';

    let fontSize = (options.fontSize ?? (defaults.fontSize as number)) / 100;

    // prettier-ignore
    let svg = [
      `<rect width="1" height="1" fill="${backgroundColor}"></rect>`,
      options.margin ? `<g transform="translate(${options.margin / 100}, ${options.margin / 100})">` : '',
      options.margin ? `<g transform="scale(${1 - (options.margin * 2) / 100})">` : '',
      `<text x="50%" y="50%" style="${options.bold ? 'font-weight: bold;' : ''} font-family: ${fontFamily}; font-size: ${fontSize}px" fill="#FFF" text-anchor="middle" dy="${(fontSize * .356).toFixed(3)}">${seedInitials}</text>`,
      options.margin ? '</g>' : '',
      options.margin ? '</g>' : ''
    ].join('');

    options.margin = undefined;

    return {
      attributes: {
        viewBox: '0 0 1 1',
      },
      body: svg,
    };
  },
};
