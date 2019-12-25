import Random from '@dicebear/avatars/lib/random';
import qrImage from 'qr-image';

type Options = {
  type?: string;
  padding?: number;
  color?: string;
  background?: string;
  correctionLevel?: 'L' | 'M' | 'Q' | 'H';
};

export default function(options: Options = {}) {
  return function(random: Random) {
    let svg = qrImage
      .imageSync(random.seed, {
        type: 'svg',
        ec_level: options.correctionLevel,
        margin: options.padding || 0
      })
      .toString();

    if (options.color) {
      svg = svg.replace('<path ', `<path fill="${options.color}" `);
    }

    if (options.background) {
      svg = svg.replace('<svg ', `<svg style="background: ${options.background}" `);
    }

    return svg;
  };
}
