/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/bX8ZT8jK2fo5Uy8G6j2Qic
 */

import { Prng, StyleOptions } from "@dicebear/core";

import { Options } from "../types.js";

type Props = { prng: Prng, options: StyleOptions<Options> } 

export function onPreCreate({ prng, options }: Props) {
  const usedColors = new Set<string>();
  
  function getAvailableColors(colors: string[]): string[] {
    const filteredColors = colors.filter((color) => !usedColors.has(color));
    
    return filteredColors.length > 0 ? filteredColors : colors;
  }
  
  function getColor(colors: string[]) {
    const availableColors = getAvailableColors(colors);
  
    const color = prng.pick(availableColors, 'transparent');
    usedColors.add(color);
  
    return color;
  }
  
  options.shape1Color = [getColor(options.shape1Color ?? [])];
  options.shape2Color = [getColor(options.shape2Color ?? [])];
  options.shape3Color = [getColor(options.shape3Color ?? [])];
  options.backgroundColor = getAvailableColors(options.backgroundColor ?? []);
}
