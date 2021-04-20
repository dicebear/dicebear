import { Style, StyleSchema, ColorCollection, utils } from '@dicebear/avatars';
import Color from '@dicebear/avatars/lib/color';
import { Options } from './options';
import { schema } from './schema';

export const style: Style<Options> = {
  meta: {
    title: 'Identicon',
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

    let colors: string[] = [];

    Object.keys(Color.collection).forEach((color) => {
      if (
        options.colors === undefined ||
        options.colors.length === 0 ||
        options.colors.indexOf(color as keyof ColorCollection) !== -1
      ) {
        let colorCollection = Color.collection[color as keyof ColorCollection];

        colors.push(colorCollection[options.colorLevel || (defaults.colorLevel as keyof typeof colorCollection)]);
      }
    });

    let color = prng.pick(colors);

    // prettier-ignore
    let body = [
      // Row 1
      prng.pick([
        `<path d="M0 4h1v1H0V4zm4 0h1v1H4V4z" fill-rule="evenodd" fill="${color}"/>`,
        `<path d="M0 4h2v1H0V4zm3 0h2v1H3V4z" fill-rule="evenodd" fill="${color}"/>`,
        `<path d="M0 4h5v1H0V4z" fill="${color}"/>`,
        `<path d="M2 4h1v1H2V4z" fill="${color}"/>`,
        `<path d="M1 4h3v1H1V4z" fill="${color}"/>`,
        `<path d="M0 4h1v1H0V4zm2 0h1v1H2V4zm2 0h1v1H4V4z" fill-rule="evenodd" fill="${color}"/>`
      ]),
      // Row 2
      prng.pick([
        `<path d="M0 3h1v1H0V3zm4 0h1v1H4V3z" fill-rule="evenodd" fill="${color}"/>`,
        `<path d="M0 3h2v1H0V3zm3 0h2v1H3V3z" fill-rule="evenodd" fill="${color}"/>`,
        `<path d="M0 3h5v1H0V3z" fill="${color}"/>`,
        `<path d="M2 3h1v1H2V3z" fill="${color}"/>`,
        `<path d="M1 3h3v1H1V3z" fill="${color}"/>`,
        `<path d="M0 3h1v1H0V3zm2 0h1v1H2V3zm2 0h1v1H4V3z" fill-rule="evenodd" fill="${color}"/>`
      ]),
      // Row 3
      prng.pick([
        `<path d="M0 2h1v1H0V2zm4 0h1v1H4V2z" fill-rule="evenodd" fill="${color}"/>`,
        `<path d="M0 2h2v1H0V2zm3 0h2v1H3V2z" fill-rule="evenodd" fill="${color}"/>`,
        `<path d="M0 2h5v1H0V2z" fill="${color}"/>`,
        `<path d="M2 2h1v1H2V2z" fill="${color}"/>`,
        `<path d="M1 2h3v1H1V2z" fill="${color}"/>`,
        `<path d="M0 2h1v1H0V2zm2 0h1v1H2V2zm2 0h1v1H4V2z" fill-rule="evenodd" fill="${color}"/>`
      ]),
      // Row 4
      prng.pick([
        `<path d="M0 1h1v1H0V1zm4 0h1v1H4V1z" fill-rule="evenodd" fill="${color}"/>`,
        `<path d="M0 1h2v1H0V1zm3 0h2v1H3V1z" fill-rule="evenodd" fill="${color}"/>`,
        `<path d="M0 1h5v1H0V1z" fill="${color}"/>`,
        `<path d="M2 1h1v1H2V1z" fill="${color}"/>`,
        `<path d="M1 1h3v1H1V1z" fill="${color}"/>`,
        `<path d="M0 1h1v1H0V1zm2 0h1v1H2V1zm2 0h1v1H4V1z" fill-rule="evenodd" fill="${color}"/>`
      ]),
      // Row 5
      prng.pick([
        `<path d="M0 0h1v1H0V0zm4 0h1v1H4V0z" fill-rule="evenodd" fill="${color}"/>`,
        `<path d="M0 0h2v1H0V0zm3 0h2v1H3V0z" fill-rule="evenodd" fill="${color}"/>`,
        `<path d="M0 0h5v1H0V0z" fill="${color}"/>`,
        `<path d="M2 0h1v1H2V0z" fill="${color}"/>`,
        `<path d="M1 0h3v1H1V0z" fill="${color}"/>`,
        `<path d="M0 0h1v1H0V0zm2 0h1v1H2V0zm2 0h1v1H4V0z" fill-rule="evenodd" fill="${color}"/>`
      ]),
    ].join('');

    return {
      attributes: {
        viewBox: '0 0 5 5',
        'shape-rendering': 'crispEdges',
      },
      body,
    };
  },
};
