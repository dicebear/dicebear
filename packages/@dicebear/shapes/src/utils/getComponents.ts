/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/bX8ZT8jK2fo5Uy8G6j2Qic/%40dicebear%2Fshapes
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng;
  options: Options;
};

export function getComponents({
  prng,
  options,
}: Props): ComponentPickCollection {
  const shape1Component = pickComponent({
    prng,
    group: 'shape1',
    values: options.shape1,
    rotation: options.shape1Rotation?.length ? options.shape1Rotation : [0],
    offsetX: options.shape1OffsetX?.length ? options.shape1OffsetX : [0],
    offsetY: options.shape1OffsetY?.length ? options.shape1OffsetY : [0],
  });
  const shape2Component = pickComponent({
    prng,
    group: 'shape2',
    values: options.shape2,
    rotation: options.shape2Rotation?.length ? options.shape2Rotation : [0],
    offsetX: options.shape2OffsetX?.length ? options.shape2OffsetX : [0],
    offsetY: options.shape2OffsetY?.length ? options.shape2OffsetY : [0],
  });
  const shape3Component = pickComponent({
    prng,
    group: 'shape3',
    values: options.shape3,
    rotation: options.shape3Rotation?.length ? options.shape3Rotation : [0],
    offsetX: options.shape3OffsetX?.length ? options.shape3OffsetX : [0],
    offsetY: options.shape3OffsetY?.length ? options.shape3OffsetY : [0],
  });

  return {
    shape1: shape1Component,
    shape2: shape2Component,
    shape3: shape3Component,
  };
}
