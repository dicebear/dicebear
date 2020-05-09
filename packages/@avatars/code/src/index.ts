import Random from '@avatars/core/lib/random';
import qrImage from 'qr-image';

type Options = {
  type?: string;
  color?: string;
  correctionLevel?: 'L' | 'M' | 'Q' | 'H';
};

export default function (random: Random, options: Options = {}) {
  let svg = qrImage
    .imageSync(random.seed, {
      type: 'svg',
      ec_level: options.correctionLevel,
      margin: 0,
    })
    .toString();

  if (options.color) {
    svg = svg.replace('<path ', `<path fill="${options.color}" `);
  }

  return svg;
}
