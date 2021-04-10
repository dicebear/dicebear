import { utils, ColorCollection, StyleSchema } from '@dicebear/avatars';
import Color from '@dicebear/avatars/lib/color';
import Random from '@dicebear/avatars/lib/random';
import type { Options } from './options';
import schema from './schema.json';

export function create(random: Random, options: Options = {}) {
  let defaults = utils.schema.defaults(schema as StyleSchema);

  let colors: string[] = [];

  Object.keys(Color.collection).forEach((color) => {
    if (options.colors === undefined || options.colors.length === 0 || options.colors.indexOf(color as keyof ColorCollection) !== -1) {
      let colorCollection = Color.collection[color as keyof ColorCollection];

      colors.push(colorCollection[options.colorLevel || defaults.colorLevel as keyof typeof colorCollection]);
    }
  });

  let color = random.pickone(colors);

  // prettier-ignore
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 5 5" version="1.1" shape-rendering="crispEdges">`,
    // Row 1
    random.pickone([
      `<path d="M0 4h1v1H0V4zm4 0h1v1H4V4z" fill-rule="evenodd" fill="${color}"/>`,
      `<path d="M0 4h2v1H0V4zm3 0h2v1H3V4z" fill-rule="evenodd" fill="${color}"/>`,
      `<path d="M0 4h5v1H0V4z" fill="${color}"/>`,
      `<path d="M2 4h1v1H2V4z" fill="${color}"/>`,
      `<path d="M1 4h3v1H1V4z" fill="${color}"/>`,
      `<path d="M0 4h1v1H0V4zm2 0h1v1H2V4zm2 0h1v1H4V4z" fill-rule="evenodd" fill="${color}"/>`
    ]),
    // Row 2
    random.pickone([
      `<path d="M0 3h1v1H0V3zm4 0h1v1H4V3z" fill-rule="evenodd" fill="${color}"/>`,
      `<path d="M0 3h2v1H0V3zm3 0h2v1H3V3z" fill-rule="evenodd" fill="${color}"/>`,
      `<path d="M0 3h5v1H0V3z" fill="${color}"/>`,
      `<path d="M2 3h1v1H2V3z" fill="${color}"/>`,
      `<path d="M1 3h3v1H1V3z" fill="${color}"/>`,
      `<path d="M0 3h1v1H0V3zm2 0h1v1H2V3zm2 0h1v1H4V3z" fill-rule="evenodd" fill="${color}"/>`
    ]),
    // Row 3
    random.pickone([
      `<path d="M0 2h1v1H0V2zm4 0h1v1H4V2z" fill-rule="evenodd" fill="${color}"/>`,
      `<path d="M0 2h2v1H0V2zm3 0h2v1H3V2z" fill-rule="evenodd" fill="${color}"/>`,
      `<path d="M0 2h5v1H0V2z" fill="${color}"/>`,
      `<path d="M2 2h1v1H2V2z" fill="${color}"/>`,
      `<path d="M1 2h3v1H1V2z" fill="${color}"/>`,
      `<path d="M0 2h1v1H0V2zm2 0h1v1H2V2zm2 0h1v1H4V2z" fill-rule="evenodd" fill="${color}"/>`
    ]),
    // Row 4
    random.pickone([
      `<path d="M0 1h1v1H0V1zm4 0h1v1H4V1z" fill-rule="evenodd" fill="${color}"/>`,
      `<path d="M0 1h2v1H0V1zm3 0h2v1H3V1z" fill-rule="evenodd" fill="${color}"/>`,
      `<path d="M0 1h5v1H0V1z" fill="${color}"/>`,
      `<path d="M2 1h1v1H2V1z" fill="${color}"/>`,
      `<path d="M1 1h3v1H1V1z" fill="${color}"/>`,
      `<path d="M0 1h1v1H0V1zm2 0h1v1H2V1zm2 0h1v1H4V1z" fill-rule="evenodd" fill="${color}"/>`
    ]),
    // Row 5
    random.pickone([
      `<path d="M0 0h1v1H0V0zm4 0h1v1H4V0z" fill-rule="evenodd" fill="${color}"/>`,
      `<path d="M0 0h2v1H0V0zm3 0h2v1H3V0z" fill-rule="evenodd" fill="${color}"/>`,
      `<path d="M0 0h5v1H0V0z" fill="${color}"/>`,
      `<path d="M2 0h1v1H2V0z" fill="${color}"/>`,
      `<path d="M1 0h3v1H1V0z" fill="${color}"/>`,
      `<path d="M0 0h1v1H0V0zm2 0h1v1H2V0zm2 0h1v1H4V0z" fill-rule="evenodd" fill="${color}"/>`
    ]),
    '</svg>'
  ].join('');
}

export default create;
