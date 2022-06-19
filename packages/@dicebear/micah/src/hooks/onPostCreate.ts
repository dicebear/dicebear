/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/YHb4ShTgmO8Lqhkz1plLfL/%40dicebear%2Fmicah?node-id=259%3A555
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
  // Ensure that the mouth remains visible. #132
  if (components.facialHair && colors.facialHair === colors.mouth) {
    colors.mouth = 'ffffff33';
  }
}
