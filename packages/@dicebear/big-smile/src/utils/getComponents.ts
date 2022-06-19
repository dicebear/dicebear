/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/3Te9c70BX2Aj4IUP35sWhF/%40dicebear%2Fbig-smile?node-id=344%3A5223
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getComponents({ prng, options }: Props): ComponentPickCollection {
  const faceComponent = pickComponent({
    prng,
    group: 'face',
    values: options.face
  });
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth
  });
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes
  });
  const hairComponent = pickComponent({
    prng,
    group: 'hair',
    values: options.hair
  });
  const accessoriesComponent = pickComponent({
    prng,
    group: 'accessories',
    values: options.accessories
  });

  return {
    'face': faceComponent,
    'mouth': mouthComponent,
    'eyes': eyesComponent,
    'hair': hairComponent,
    'accessories': prng.bool(options.accessoriesProbability) ? accessoriesComponent : undefined,
  }
};
