/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/ZHPv3t2L6Asuuql9ND4q1L/%40dicebear%2Fcroodles?node-id=2%3A942
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getComponents({ prng, options }: Props): ComponentPickCollection {
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes
  });
  const noseComponent = pickComponent({
    prng,
    group: 'nose',
    values: options.nose
  });
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth
  });

  return {
    'eyes': eyesComponent,
    'nose': noseComponent,
    'mouth': mouthComponent,
  }
};
