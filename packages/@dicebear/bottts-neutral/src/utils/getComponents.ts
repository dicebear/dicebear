/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/4nf3pyoOuM1U9Pa8M0cL6u/%40dicebear%2Fbottts?node-id=4%3A3179
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getComponents({ prng, options }: Props): ComponentPickCollection {
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

  return {
    'mouth': mouthComponent,
    'eyes': eyesComponent,
  }
};
