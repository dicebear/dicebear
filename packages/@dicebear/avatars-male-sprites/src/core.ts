import { Style, StyleSchema } from '@dicebear/avatars';
import Color from '@dicebear/avatars/lib/color';
import { Options } from './options';
import { schema } from './schema';

export const style: Style<Options> = {
  meta: {
    title: 'Male / 8biticon',
    creator: 'Plastic Jam',
    contributor: 'Florian Körner',
    source: 'https://github.com/dicebear/dicebear',
    license: {
      name: 'MIT',
      url: 'https://github.com/dicebear/dicebear/blob/v4/packages/avatars-male-sprites/LICENSE',
    },
  },
  schema,
  create: ({ prng, options }) => {
    let skinColor = prng.pick([
      new Color('#FFDBAC'),
      new Color('#F5CFA0'),
      new Color('#EAC393'),
      new Color('#E0B687'),
      new Color('#CB9E6E'),
      new Color('#B68655'),
      new Color('#A26D3D'),
      new Color('#8D5524'),
    ]);

    let hairColor = prng
      .pick([
        new Color('#090806'),
        new Color('#2c222b'),
        new Color('#71635a'),
        new Color('#b7a69e'),
        new Color('#b89778'),
        new Color('#a56b46'),
        new Color('#b55239'),
        new Color('#8d4a43'),
        new Color('#91553d'),
        new Color('#533d32'),
        new Color('#3b3024'),
        new Color('#554838'),
        new Color('#4e433f'),
        new Color('#504444'),
        new Color('#6a4e42'),
        new Color('#a7856a'),
        new Color('#977961'),
      ])
      .brighterOrDarkerThan(skinColor, 17);

    let eyesColor = prng.pick([
      new Color('#76778b'),
      new Color('#697b94'),
      new Color('#647b90'),
      new Color('#5b7c8b'),
      new Color('#588387'),
    ]);

    let eyebrowsColor = hairColor.clone().darkerThan(skinColor, 7).darkerThan(hairColor, 10);

    let mustacheColor = hairColor.clone().darkerThan(skinColor, 7);
    mustacheColor.alpha = prng.pick([1, 0.75, 0.5]);

    let mouthColor = prng
      .pick([new Color('#eec1ad'), new Color('#dbac98'), new Color('#d29985')])
      .brighterOrDarkerThan(skinColor, 10);

    let glassesColor = prng.pick([
      new Color('#5f705c'),
      new Color('#43677d'),
      new Color('#5e172d'),
      new Color('#ffb67a'),
      new Color('#a04b5d'),
      new Color('#191919'),
      new Color('#323232'),
      new Color('#4b4b4b'),
    ]);

    let clothesColor = prng.pick([
      new Color('#5bc0de'),
      new Color('#5cb85c'),
      new Color('#428bca'),
      new Color('#03396c'),
      new Color('#005b96'),
      new Color('#6497b1'),
      new Color('#1b85b8'),
      new Color('#5a5255'),
      new Color('#559e83'),
      new Color('#ae5a41'),
      new Color('#c3cb71'),
      new Color('#666547'),
      new Color('#ffe28a'),
    ]);

    let hatColor = prng.pick([
      new Color('#18293b'),
      new Color('#2e1e05'),
      new Color('#989789'),
      new Color('#3d6ba7'),
      new Color('#517459'),
      new Color('#a62116'),
    ]);

    let mouth = [];

    while (mouth.length === 0) {
      if (undefined === options.mood || options.mood.indexOf('sad') > -1) {
        // prettier-ignore
        mouth.push(
            `<path d="M8 13h3v1H8v-1z" fill="${mouthColor.hex}"/>`,
            `<path d="M8 13h4v1H8v-1z" fill="${mouthColor.hex}"/>`,
            `<path d="M9 13h2v1H9v-1z" fill="${mouthColor.hex}"/>`,
            `<path d="M8 12v1h3v1h1v-1h-1v-1H8z" fill="${mouthColor.hex}"/>`,
            `<path d="M8 13v1h1v-1h3v-1H9v1H8z" fill="${mouthColor.hex}"/>`
          );
      }

      if (undefined === options.mood || options.mood.indexOf('happy') > -1) {
        // prettier-ignore
        mouth.push(
            `<path d="M7 12v1h1v1h4v-1H8v-1H7z" fill="${mouthColor.hex}"/>`,
            `<path d="M10 12v1H9v1h2v-2h-1z" fill="${mouthColor.hex}"/>`,
            `<path d="M8 13v1h4v-1h1v-1h-1v1H8z" fill="${mouthColor.hex}"/>`,
            `<path d="M8 12v2h4v-2H8z" fill="#FFF"/>`
          );
      }

      if (undefined === options.mood || options.mood.indexOf('surprised') > -1) {
        // prettier-ignore
        mouth.push(
            `<path d="M9 12v2h2v-2H9z" fill="${mouthColor.hex}"/>`,
            `<path d="M9 13v1h1v-1H9z" fill="${mouthColor.hex}"/>`
          );
      }

      if (mouth.length === 0) {
        // Reset mood option because it appears to be invalid.
        options.mood = undefined;
      }
    }

    // prettier-ignore
    let body = [
      // Head
      `<path d="M8 15v1H4v1H3v3h14v-3h-1v-1h-4v-1h3v-1h1v-1h1v-3h1V7h-1V4h-1V3h-1V2H5v1H4v1H3v3H2v3h1v3h1v1h1v1h3z" fill="${skinColor.hex}"/><path d="M5 15v-1H4v-1H3v-3H2V7h1V4h1V3h1V2h10v1h1v1h1v3h1v3h-1v3h-1v1h-1v1H5z" fill="#FFF" fill-opacity=".1"/>`,
      // Eyes
      prng.pick([
        `<path d="M5 9V7h3v2H5zm7-2h3v2h-3V7z" fill="#FFF"/><path d="M7 8v1h1V8H7zm7 0h1v1h-1V8z" fill="${eyesColor.hex}"/>`,
        `<path d="M5 7h3v2H5V7zm7 0h3v2h-3V7z" fill="#FFF"/><path d="M6 8h1v1H6V8zm7 1V8h1v1h-1z" fill="${eyesColor.hex}"/>`,
        `<path d="M5 7h3v2H5V7zm7 0h3v2h-3V7z" fill="#FFF"/><path d="M7 8h1v1H7V8zm5 0h1v1h-1V8z" fill="${eyesColor.hex}"/>`,
        `<path d="M6 7h1v1h1v1H6V7zm6 0h1v1h1v1h-2V7z" fill="#FFF"/><path d="M6 8h1v1H6V8zm6 0h1v1h-1V8z" fill="${eyesColor.hex}"/>`,
        `<path d="M5 8h2v1H5V8zm7 0h2v1h-2V8z" fill="#FFF"/><path d="M7 8h1v1H7V8zm7 0h1v1h-1V8z" fill="${eyesColor.hex}"/>`,
        `<path d="M6 8h1v1H6V8zm7 0h1v1h-1V8z" fill="#FFF"/><path d="M7 8h1v1H7V8zm5 0h1v1h-1V8z" fill="${eyesColor.hex}"/>`,
        `<path d="M5 7v1h3V7H5zm7 0h3v1h-3V7z" fill="#FFF"/><path d="M5 9V8h1V7h1v1h1v1H5zm7 0V8h1V7h1v1h1v1h-3z" fill="${eyesColor.hex}"/><path d="M5 9V8h1V7h1v1h1v1H7V8H6v1H5zm7 0V8h1V7h1v1h1v1h-1V8h-1v1h-1z" fill="#FFF" fill-opacity=".5"/>`,
        `<path d="M5 8h3v1H5V8zm7 0h3v1h-3V8z" fill="#FFF"/><path d="M6 8h1v1H6V8zm7 0h1v1h-1V8z" fill="${eyesColor.hex}"/>`,
        `<path d="M5 7h3v2H5V7zm7 0h3v2h-3V7z" fill="#FFF"/><path d="M5 8h2v1H5V8zm7 0h2v1h-2V8z" fill="${eyesColor.hex}"/>`,
        `<path d="M5 7h3v3H5V7zm7 0h3v3h-3V7z" fill="#FFF"/><path d="M6 8h1v1H6V8zm7 0h1v1h-1V8z" fill="${eyesColor.hex}"/>`,
        `<path d="M5 7h3v3H5V7zm7 0h3v3h-3V7z" fill="#FFF"/><path d="M6 7h2v2H6V7zm7 0h2v2h-2V7z" fill="${eyesColor.hex}"/><path d="M6 7v1h1v1h1V8H7V7H6zm7 0v1h1v1h1V8h-1V7h-1z" fill="#FFF" fill-opacity=".4"/><path d="M7 7v1h1V7H7zm7 0h1v1h-1V7z" fill="#FFF" fill-opacity=".7"/>`,
        `<path d="M5 7h3v3H5V7zm7 0h3v3h-3V7z" fill="#FFF"/><path d="M5 8h2v1H5V8zm7 0h2v1h-2V8z" fill="${eyesColor.hex}"/><path d="M5 8h1v1H5V8zm7 0h1v1h-1V8z" fill="#FFF" fill-opacity=".7"/>`,
        `<path d="M6 7h1v2H5V8h1V7zm7 0h1v2h-2V8h1V7z" fill="#FFF"/><path d="M7 7v1H6v1h2V7H7zm7 0v1h-1v1h2V7h-1z" fill="${eyesColor.hex}"/><path d="M7 7v1h1V7H7zM6 8v1h1V8H6zm8-1v1h1V7h-1zm-1 1v1h1V8h-1z" fill="#FFF" fill-opacity=".5"/>`
      ]),
      // Eyebrows
      prng.pick([
        `<path d="M7 5v1H5v1H4V6h1V5h2zm7 0v1h-2v1h-1V6h1V5h2z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M8 4v1H7v1H5V5h2V4h1zm4 0h1v1h2v1h-2V5h-1V4z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M6 5h3v2H8V6H6V5zm5 0h3v1h-2v1h-1V5z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M5 5h3v1h1v1H8V6H5V5zm10 0h-3v1h-1v1h1V6h3V5z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M6 5H4v2h1V6h1V5zm8 0h2v2h-1V6h-1V5z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M5 6h2v1H5V6zm8 0h2v1h-2V6z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M6 5h1v1h1v1H5V6h1V5zm7 0h1v1h1v1h-3V6h1V5z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M6 5h2v1h1v1H8V6H6V5zm8 0h-2v1h-1v1h1V6h2V5z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M12 7V6h1V5h1v1h1v1h-1V6h-1v1h-1zM5 7V6h1V5h1v1h1v1H7V6H6v1H5z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M7 5v1H5v1H4V6h1V5h2zm6 0h2v1h1v1h-1V6h-2V5z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M4 7V5h3v1H5v1H4zm12-2v2h-1V6h-2V5h3z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M7 5h1v1h1v1H8V6H7V5zm6 0v1h-1v1h-1V6h1V5h1z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`,
        `<path d="M4 7V6h1V5h1v1H5v1H4zm10-2h1v1h1v1h-1V6h-1V5z" fill-rule="evenodd" fill="${eyebrowsColor.hex}"/>`
      ]),
      // Mustache (50% chance)
      prng.bool(50)
        ? prng.pick([
            `<path d="M3 10v3h1v1h1v1h10v-1h1v-1h1v-3h-3v1H6v-1H3z" id="Path" fill="${mustacheColor.hex}" fill-opacity="${mustacheColor.alpha}"/>`,
            `<path d="M3 13h1v1h1v1h10v-1h1v-1h1v-3h-1v1h-1v1H5v-1H4v-1H3v3z" id="Path" fill="${mustacheColor.hex}" fill-opacity="${mustacheColor.alpha}"/>`,
            `<path d="M3 11v2h1v1h1v1h10v-1h1v-1h1v-2H3z" id="Path" fill="${mustacheColor.hex}" fill-opacity="${mustacheColor.alpha}"/>`,
            `<path d="M3 7v6h1v1h1v1h10v-1h1v-1h1V7h-1v2h-1v1h-1v1H6v-1H5V9H4V7H3z" id="Path" fill="${mustacheColor.hex}" fill-opacity="${mustacheColor.alpha}"/>`
          ])
        : '',
      // Mouth
      prng.pick(mouth),
      // Glasses (25% chance)
      prng.bool(25)
        ? prng.pick([
            `<path d="M5 7h3v3H5V7zm7 0h3v3h-3V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M7 7h1v1H7V7zm7 0h1v1h-1V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M12 10V7h3v3h-3zm-1-4v1H9V6H4v1H3v1h1v3h5V8h2v3h5V8h1V7h-1V6h-5zm-6 4V7h3v3H5z" fill-rule="evenodd" fill="${glassesColor.hex}"/><path d="M3 7h1v1H3V7zm6 0h2v1H9V7zm7 0h1v1h-1V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M5 7h3v2H5V7zm7 0h3v2h-3V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M7 7h1v1H7V7zm7 0h1v1h-1V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M5 7v2h3V7H5zM4 6v1H3v1h1v1h1v1h3V9h1V8h2v1h1v1h3V9h1V8h1V7h-1V6h-5v1H9V6H4zm8 1v2h3V7h-3z" fill-rule="evenodd" fill="${glassesColor.hex}"/><path d="M3 7h1v1H3V7zm6 0h2v1H9V7zm7 0h1v1h-1V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M5 8h3v1H5V8zm7 0h3v1h-3V8z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M7 8h1v1H7V8zm7 0h1v1h-1V8z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M5 8v1h3V8H5zM3 7v1h1v1h1v1h3V9h1V8h2v1h1v1h3V9h1V8h1V7H3zm9 1v1h3V8h-3z" fill-rule="evenodd" fill="${glassesColor.hex}"/><path d="M3 7v1h1V7H3zm6 0v1h2V7H9zm7 0v1h1V7h-1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M5 7h3v2H5V7zm7 0h3v2h-3V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M7 7h1v1H7V7zm7 0h1v1h-1V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M12 7v2h3V7h-3zM8 6H5v1H3v1h1v1h1v1h3V9h1V8h2v1h1v1h3V9h1V8h1V7h-2V6h-3v1H8V6zM5 7v2h3V7H5z" fill-rule="evenodd" fill="${glassesColor.hex}"/><path d="M3 7h1v1H3V7zm6 0h2v1H9V7zm7 0h1v1h-1V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M4 8H3V7h1V6h5v1h2V6h5v1h1v1h-1v2h-5V8H9v2H4V8zm1 0V7h3v2H5V8zm7-1v2h3V7h-3z" fill-rule="evenodd" fill="${glassesColor.hex}"/><path d="M5 7h3v2H5V7zm7 0h3v2h-3V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M14 7h1v1h-1V7zM7 7h1v1H7V7z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M3 8V7h1v1H3zm6-1v1h2V7H9zm7 0v1h1V7h-1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M4 8H3V7h14v1h-1v2h-5V8H9v2H4V8zm1 0h3v1H5V8zm7 0h3v1h-3V8z" fill-rule="evenodd" fill="${glassesColor.hex}"/><path d="M5 8h3v1H5V8zm7 0h3v1h-3V8z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M7 8v1h1V8H7zm7 0v1h1V8h-1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/><path d="M3 7v1h1V7H3zm13 0v1h1V7h-1zM9 7v1h2V7H9z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`
          ])
        : '',
      // Clothes
      prng.pick([
        `<path d="M3 20v-3h1v-1h4v-1h4v1h4v1h1v3H3z" fill="${clothesColor.hex}"/><path d="M3 20v-3h1v-1h12v1h1v3H3z" fill="#FFF" fill-opacity=".2"/><path d="M12 19v-1h3v1h-3z" fill="#FFF" fill-opacity=".2"/>`,
        `<path d="M3 20v-3h1v-1h12v1h1v3H3z" fill="${clothesColor.hex}"/><path d="M5 20v-2h1v-1h8v1h1v2h-2v-1h-2v1H9v-1H7v1H5z" fill="#FFF" fill-opacity=".2"/>`,
        `<path d="M3 20v-3h1v-1h12v1h1v3H3z" fill="${clothesColor.hex}"/><path d="M8 16H4v1H3v3h14v-3h-1v-1h-4v1h1v1h-1v1h-1v-1H9v1H8v-1H7v-1h1v-1z" fill="#FFF" fill-opacity=".2"/><path d="M9 16v1h2v-1H9z" fill="#FFF"/>`,
        `<path d="M3 20v-3h1v-1h12v1h1v3H3z" fill="${clothesColor.hex}"/><path d="M9 16H4v1H3v3h6v-2H8v-1h1v-1zm2 0h5v1h1v3h-6v-2h1v-1h-1v-1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".3"/>`,
        `<path d="M3 20v-3h1v-1h3v2h6v-2h3v1h1v3H3z" fill="${clothesColor.hex}"/><path d="M5 16H4v1H3v3h2v-4zm1 0h1v2h6v-2h1v4H6v-4zm9 0h1v1h1v3h-2v-4z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
        `<path d="M3 20v-3h1v-1h4v1h1v1h2v-1h1v-1h4v1h1v3H3z" fill="${clothesColor.hex}"/><path d="M4 17v-1h3v1H4zm9 0v-1h3v1h-3z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
        `<path d="M3 20v-3h1v-1h3v-1h1v1h1v1h2v-1h1v-1h1v1h3v1h1v3H3z" fill="${clothesColor.hex}"/><path d="M6 16H4v1H3v3h6v-2H8v-1H6v-1zm2 0h1-1zm3 0h1-1zm2 0h1v1h-2v1h-1v2h6v-3h-1v-1h-3z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
        `<path d="M5 16H4v1H3v3h14v-3h-1v-1h-3v1H7v-1H5z" fill="${clothesColor.hex}"/><path d="M10 20v-1h3v1h-3z" fill="#FFF" fill-opacity=".5"/><path d="M5 16H4v1H3v3h1v-1h1v-3zm1 0h1v1h6v-1h1v2H6v-2zm9 0h1v1h1v3h-1v-1h-1v-3z" fill-rule="evenodd" fill="#FFF" fill-opacity=".8"/>`,
        `<path d="M3 20v-3h1v-1h4v1h4v-1h4v1h1v3H3z" fill="${clothesColor.hex}"/><path d="M3 20v-1h1v1H3zm2 0v-1h1v1H5zm2 0v-1h1v1H7zm2 0v-1h1v1H9zm2 0v-1h1v1h-1zm2 0v-1h1v1h-1zm2 0v-1h1v1h-1zm1-2h1v1h-1v-1zm-2 0h1v1h-1v-1zm-2 0h1v1h-1v-1zm-2 0h1v1h-1v-1zm-2 0h1v1H8v-1zm-2 0h1v1H6v-1zm-2 0h1v1H4v-1zm-1-1h1v1H3v-1zm2 0h1v1H5v-1zm2 0h1v1H7v-1zm2 0h1v1H9v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zM4 16h1v1H4v-1zm2 0h1v1H6v-1zm6 0h1v1h-1v-1zm2 0h1v1h-1v-1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
        `<path d="M3 20v-3h1v-1h4v1h4v-1h4v1h1v3H3z" fill="${clothesColor.hex}"/><path d="M3 20v-2h1v2H3zm3 0v-2h2v2H6zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2zm2-3v1h1v-1h-1zm-2 1v-2h-2v2h2zm-6-1v1h2v-1H8zm-4-1v2h2v-2H4z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
        `<path d="M3 20v-3h1v-1h4v1h4v-1h4v1h1v3H3z" fill="${clothesColor.hex}"/><path d="M3 19h14v1H3v-1zm0-2h14v1H3v-1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
        `<path d="M3 20v-3h1v-1h4v1h4v-1h4v1h1v3H3z" fill="${clothesColor.hex}"/>`,
        `<path d="M3 20v-3h1v-1h12v1h1v3H3z" fill="${clothesColor.hex}"/>`
      ]),
      // Hair (95% chance)
      prng.bool(95)
        ? prng.pick([
            `<path d="M3 3v2h1V4h1V3h10v1h1v1h1V3h-1V2H4v1H3z" fill="${hairColor.hex}"/>`,
            `<path d="M5 2h10v1h1v1h1v3h-1V6h-1V5h-1V4h-4v1H8v1H7v1H4V6H3V4h1V3h1V2z" fill="${hairColor.hex}"/>`,
            `<path d="M3 6h1V4h1V3h2v1h1v1h4V4h1V3h2v1h1v2h1V4h-1V3h-1V2H5v1H4v1H3v2z" fill="${hairColor.hex}"/>`,
            `<path d="M3 8h1V5h12v3h1V4h-1V3h-1V2H5v1H4v1H3v4z" fill="${hairColor.hex}"/>`,
            `<path d="M2 4v1h1v1h2V4h1V2H4v1H3v1H2zm6-1h2v1h2V3h1V2H8v1zm6 1h1v2h2V5h1V4h-1V3h-1V2h-2v2z" fill-rule="evenodd" fill="${hairColor.hex}"/>`,
            `<path d="M3 7h1V5h2V3h8v1h1v1h1v2h1V3h-2V2h-2V1h-1v1h-2V1H9v1H8V1H7v1H5v1H4v1H3v3z" fill="${hairColor.hex}"/>`,
            `<path d="M8 2h4v1h-1v1H9V3H8V2z" fill="${hairColor.hex}"/>`,
            `<path d="M9 0v1H8v1h4V1h-1V0H9z" fill="${hairColor.hex}"/>`,
            `<path d="M3 7h1V5h2V4h2V3h1v1h2v1h2v1h2v1h2V4h-1V3h-1V2H5v1H4v1H3v3z" fill="${hairColor.hex}"/>`,
            `<path d="M4 4h12V3h-1V2H5v1H4v1z" fill="${hairColor.hex}"/>`,
            `<path d="M2 7h1V5h2V4h1V3h1v1h2V3h4V2h1v1h1v1h1v1h1v2h1V6h1V4h-1V3h-1V2h-1V1h-1V0h-1v1h-2V0h-1v1H9V0H8v1H7V0H5v1H4v1H2v5z" fill="${hairColor.hex}"/>`,
            `<path d="M0 7h1v5h1v1h1V9h1V7h1V6h1V4h1V3h7v1h1v1h1v1h1v7h1v-2h1V7h-1V6h1V4h-1v1h-1V3h1V2h-1v1h-1V2h-2V1h-1V0h-1v1H5V0H4v1H3V0H2v1h1v2H2V2H1v1h1v1H1v2H0v1z" fill="${hairColor.hex}"/>`,
            `<path d="M5 2v1H4v1H3v3h2V6h1V5h6V4h1V3h1v1h-1v1h1v1h1v1h2V4h-1V3h-1V2H5z" fill="${hairColor.hex}"/>`
          ])
        : '',
      // Hat (5% chance)
      prng.bool(5)
        ? prng.pick([
            `<path d="M4 0v2H2v2h16V2h-2V0H4z" fill="${hatColor.hex}"/>`,
            `<path d="M4 3H2v1h16V3h-2V0H4v3z" fill="${hatColor.hex}"/>`,
            `<path d="M2 2v2h16V2h-1V1h-1V0H4v1H3v1H2z" fill="${hatColor.hex}"/>`,
            `<path d="M6 0v1H5v1H4v2h14V3h-2V2h-1V1h-1V0H6z" fill="${hatColor.hex}"/>`,
            `<path d="M2 4V2h2V0h12v2h2v2H2z" fill="${hatColor.hex}"/><path d="M4 0v2h12V0H4z" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M2 4V3h2V0h12v3h2v1H2z" fill="${hatColor.hex}"/><path d="M4 0v3h12V0H4z" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M2 4V2h1V1h1V0h12v1h1v1h1v2H2z" fill="${hatColor.hex}"/><path d="M3 1v1h14V1H3zM2 3v1h16V3H2z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M14 0H6v1H5v1H4v2h14V3h-2V2h-1V1h-1V0z" fill="${hatColor.hex}"/><path d="M5 3h1V2h1V1h1V0H7v1H6v1H5v1z" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M4 0v2H2v2h16V2h-2V0H4z" fill="${hatColor.hex}"/><path d="M15 3V0h-1v3h1z" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M4 0v3H2v1h16V3h-2V0H4z" fill="${hatColor.hex}"/><path d="M15 3V0h-1v3h1zm-2-3v2h-1V0h1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M2 2v2h16V2h-1V1h-1V0H4v1H3v1H2z" fill="${hatColor.hex}"/><path d="M15 0v4h-1V0h1zm-2 0v4h-1V0h1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
            `<path d="M5 2H4v2h14V3h-2V2h-1V1h-1V0H6v1H5v1z" fill="${hatColor.hex}"/><path d="M14 2h-3v1h3V2z" fill="#FFF" fill-opacity=".2"/>`
          ])
        : ''
    ].join('');

    return {
      attributes: {
        viewBox: '0 0 20 20',
        'shape-rendering': 'crispEdges',
      },
      body,
    };
  },
};
