/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sNI8OuD41VSfu5Gfl3eprv
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getComponents({ prng, options }: Props): ComponentPickCollection {
  const shapeComponent = pickComponent({
    prng,
    group: 'shape',
    values: options.shape,
    width: 100,
    height: 140,
    rotation: options.shapeRotation?.length ? options.shapeRotation : [0],
    offsetX: options.shapeOffsetX?.length ? options.shapeOffsetX : [0],
    offsetY: options.shapeOffsetY?.length ? options.shapeOffsetY : [0],
  });
  const faceComponent = pickComponent({
    prng,
    group: 'face',
    values: options.face,
    width: 42,
    height: 42,
    rotation: options.faceRotation?.length ? options.faceRotation : [0],
    offsetX: options.faceOffsetX?.length ? options.faceOffsetX : [0],
    offsetY: options.faceOffsetY?.length ? options.faceOffsetY : [0],
  });
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes,
    width: 42,
    height: 16,
    rotation: [0],
    offsetX: [0],
    offsetY: [0],
  });
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth,
    width: 30,
    height: 14,
    rotation: [0],
    offsetX: [0],
    offsetY: [0],
  });

  return {
    'shape': shapeComponent,
    'face': faceComponent,
    'eyes': eyesComponent,
    'mouth': mouthComponent,
  }
};
