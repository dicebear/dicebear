/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/bX8ZT8jK2fo5Uy8G6j2Qic/%40dicebear%2Fshapes
 */

import type { Prng } from '@dicebear/core';
import type { ComponentGroupCollection, ComponentPickCollection, ColorPickCollection, ComponentPick } from '../types.js';
import * as components from '../components/index.js';

type Props = {
  prng: Prng,
  group: string,
  values?: string[],
  rotation: number[],
  offsetX: number[],
  offsetY: number[],
}

export function pickComponent({ prng, group, values = [], rotation, offsetX, offsetY}: Props): ComponentPick {
  const componentCollection: ComponentGroupCollection = components;

  const key = prng.pick(values);

  const pickedRotation = prng.integer(Math.min(...rotation), Math.max(...rotation));
  const pickedOffsetX = prng.integer(Math.min(...offsetX), Math.max(...offsetX));
  const pickedOffsetY = prng.integer(Math.min(...offsetY), Math.max(...offsetY));

  if (key && componentCollection[group][key]) {
    return {
      name: key,
      value(
        this: Exclude<ComponentPick, undefined>,
        components: ComponentPickCollection,
        colors: ColorPickCollection
      ) {
        let result = componentCollection[group][key](components, colors);

        if (this.rotation || this.offsetX || this.offsetY) {
          result = `<g transform="translate(${(this.offsetX ?? 0)}, ${this.offsetY ?? 0}) rotate(${this.rotation ?? 0} 50 50)">${result}</g>`;
        }

        return result;
      },
      rotation: pickedRotation,
      offsetX: pickedOffsetX,
      offsetY: pickedOffsetY,
    };
  } else {
    return undefined;
  }
}
