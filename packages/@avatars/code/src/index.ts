import { IStyle } from '@avatars/core';
import qrImage from 'qr-image';

type Options = {
  type?: string;
  color?: string;
  correctionLevel?: 'L' | 'M' | 'Q' | 'H';
};

const style: IStyle<Options> = function (prng, options = {}) {
  let svg = qrImage
    .imageSync(prng.seed, {
      type: 'svg',
      ec_level: options.correctionLevel,
      margin: 0,
    })
    .toString();

  if (options.color) {
    svg = svg.replace('<path ', `<path fill="${options.color}" `);
  }

  return svg;
};

export default style;
