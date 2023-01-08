/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h
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
  if (components.style?.name === 'circle') {
    options.backgroundColor = [];
  }
  
  if (components.style?.name !== 'circle'
      && options.backgroundColor
      && options.backgroundColor.length === 1
      && options.backgroundColor[0] === '65c9ff'
  ) {
    options.backgroundColor = [];   
  }
}
