import Color from '@dicebear/avatars/lib/color';
import Random from '@dicebear/avatars/lib/random';
import { ColorCollection, Color as ColorType } from '@dicebear/avatars/lib/types';

type Options = {
  padding?: number;
  background?: string;
  colors?: Array<keyof ColorCollection>;
  colorLevel?: keyof ColorType;
};

export default function(options: Options = {}) {
  options = {
    padding: 0,
    background: '#FFF',
    colorLevel: 600,
    ...options
  };

  let colors: string[] = [];

  Object.keys(Color.collection).forEach((color: keyof ColorCollection) => {
    if (options.colors === undefined || options.colors.length === 0 || options.colors.indexOf(color) !== -1) {
      colors.push(Color.collection[color][options.colorLevel]);
    }
  });

  return function(random: Random) {
    let color = random.pickone(colors);

    // prettier-ignore
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="${0-options.padding} ${0-options.padding} ${5+options.padding*2} ${5+options.padding*2}" version="1.1" shape-rendering="crispEdges">`,
      // Background
      `<path d="M${0-options.padding} ${0-options.padding}h${5+options.padding*2}v${5+options.padding*2}H${0-options.padding}V0z" fill="${options.background}" />`,
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
  };
}
