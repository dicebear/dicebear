/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/community/file/1198749693280469639
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getComponents({ prng, options }: Props): ComponentPickCollection {
  const eyebrowsComponent = pickComponent({
    prng,
    group: 'eyebrows',
    values: options.eyebrows,
  });
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes,
  });
  const frecklesComponent = pickComponent({
    prng,
    group: 'freckles',
    values: options.freckles,
  });
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth,
  });
  const noseComponent = pickComponent({
    prng,
    group: 'nose',
    values: options.nose,
  });
  const glassesComponent = pickComponent({
    prng,
    group: 'glasses',
    values: options.glasses,
  });

  return {
    'eyebrows': eyebrowsComponent,
    'eyes': eyesComponent,
    'freckles': prng.bool(options.frecklesProbability) ? frecklesComponent : undefined,
    'mouth': mouthComponent,
    'nose': noseComponent,
    'glasses': prng.bool(options.glassesProbability) ? glassesComponent : undefined,
  }
};
