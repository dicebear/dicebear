import { IStyle } from '@avatars/core';
// @ts-ignore
import jdenticon from 'jdenticon';

type Options = {
  hues?: number[];
  lightnessColor?: [number, number];
  lightnessGrayscale?: [number, number];
  saturationColor?: number;
  saturationGrayscale?: number;
};

const style: IStyle<Options> = function (random, options = {}) {
  jdenticon.config = {
    hues: options.hues,
    lightness: {
      color: options.lightnessColor,
      grayscale: options.lightnessGrayscale,
    },
    saturation: {
      color: options.saturationColor,
      grayscale: options.saturationGrayscale,
    },
  };

  return jdenticon.toSvg(random.seed, 50, 0).replace('width="50"', '').replace('height="50"', '');
};

export default style;
