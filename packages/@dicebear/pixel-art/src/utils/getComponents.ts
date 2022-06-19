/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/WTcivb1XPf5ODtyv7ZNnU9/%40dicebear%2Fpixel-art?node-id=5%3A1231
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getComponents({ prng, options }: Props): ComponentPickCollection {
  const accessoriesComponent = pickComponent({
    prng,
    group: 'accessories',
    values: options.accessories
  });
  const clothingComponent = pickComponent({
    prng,
    group: 'clothing',
    values: options.clothing
  });
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes
  });
  const glassesComponent = pickComponent({
    prng,
    group: 'glasses',
    values: options.glasses
  });
  const beardComponent = pickComponent({
    prng,
    group: 'beard',
    values: options.beard
  });
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth
  });
  const hairComponent = pickComponent({
    prng,
    group: 'hair',
    values: options.hair
  });

  return {
    'accessories': prng.bool(options.accessoriesProbability) ? accessoriesComponent : undefined,
    'clothing': clothingComponent,
    'eyes': eyesComponent,
    'glasses': prng.bool(options.glassesProbability) ? glassesComponent : undefined,
    'beard': prng.bool(options.beardProbability) ? beardComponent : undefined,
    'mouth': mouthComponent,
    'hair': hairComponent,
  }
};
