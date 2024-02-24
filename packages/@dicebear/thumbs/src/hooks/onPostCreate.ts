/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sNI8OuD41VSfu5Gfl3eprv
 */

import { Prng, StyleOptions } from "@dicebear/core";

import { Options, ColorPickCollection, ComponentPickCollection } from "../types.js";

type Props = {
  prng: Prng,
  options: StyleOptions<Options>,
  components: ComponentPickCollection,
  colors: ColorPickCollection
} 

export function onPostCreate({ prng, options, components, colors }: Props) {
  function getContrastYiq(hexcolor: string) {
    const r = parseInt(hexcolor.slice(1, 3), 16);
    const g = parseInt(hexcolor.slice(3, 5), 16);
    const b = parseInt(hexcolor.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
    return yiq >= 200 ? '#000000' : '#ffffff';
  }
  
  const possibleBackgroundColors = options.backgroundColor?.filter(
    (v) => v !== colors.shape.replace('#', '')
  );
  
  if (possibleBackgroundColors?.length) {
    options.backgroundColor = possibleBackgroundColors;
  }
  
  const shapeContrast =
    colors.shape[0] === '#' ? getContrastYiq(colors.shape) : undefined;
  
  if (shapeContrast) {
    if (
      options.eyesColor?.length === 2 &&
      options.eyesColor.includes('000000') &&
      options.eyesColor.includes('ffffff')
    ) {
      colors.eyes = shapeContrast;
    }
  
    if (
      options.mouthColor?.length === 2 &&
      options.mouthColor.includes('000000') &&
      options.mouthColor.includes('ffffff')
    ) {
      colors.mouth = shapeContrast;
    }
  }
}
