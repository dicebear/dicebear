import Random from '@dicebear/avatars/lib/random';
// @ts-ignore
import jdenticon from 'jdenticon';

type Options = {
  hues?: number[];
  padding?: number;
  colorLightness?: [number, number];
  grayscaleLightness?: [number, number];
  colorSaturation?: number;
  grayscaleSaturation?: number;
  background?: string;
};

export default function(options: Options = {}) {
  return function(random: Random) {
    jdenticon.config = {
      hues: options.hues,
      lightness: {
        color: options.colorLightness,
        grayscale: options.grayscaleLightness
      },
      saturation: {
        color: options.colorSaturation,
        grayscale: options.grayscaleSaturation
      },
      backColor: options.background
    };

    return jdenticon
      .toSvg(random.seed, 50, options.padding || 0)
      .replace('width="50"', '')
      .replace('height="50"', '');
  };
}
