/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/YHb4ShTgmO8Lqhkz1plLfL/%40dicebear%2Fmicah?node-id=259%3A555
 */

import { Prng, StyleOptions } from "@dicebear/core";

import { Options } from "../types.js";

type Props = { prng: Prng, options: StyleOptions<Options> } 

export function onPreCreate({ prng, options }: Props) {
  // Prevent baseColor from being used a second time if possible.
  options.baseColor = options.baseColor && options.baseColor.length > 0 ? [prng.pick(options.baseColor) ?? 'transparent'] : [];
  
  for (const colorName of ['eyebrows', 'hair', 'eyes', 'nose', 'ears', 'shirt', 'earrings', 'glasses', 'facialHair']) {
    // @ts-ignore
    const colorOption = options[`${colorName}Color`] ?? [];
    const index = colorOption.indexOf(options.baseColor[0]);
  
    if (colorOption.length > 1 && index > -1) {
      colorOption.splice(index, 1);
    }
  }
}
