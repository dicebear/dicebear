/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getComponents({ prng, options }: Props): ComponentPickCollection {
  const backhairComponent = pickComponent({
    prng,
    group: 'backhair',
    values: options.backhair,
  });
  const bodyComponent = pickComponent({
    prng,
    group: 'body',
    values: options.body,
  });
  const headComponent = pickComponent({
    prng,
    group: 'head',
    values: options.head,
  });
  const clothesComponent = pickComponent({
    prng,
    group: 'clothes',
    values: options.clothes,
  });
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth,
  });
  const beardsComponent = pickComponent({
    prng,
    group: 'beards',
    values: options.beards,
  });
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes,
  });
  const eyebrowsComponent = pickComponent({
    prng,
    group: 'eyebrows',
    values: options.eyebrows,
  });
  const hairComponent = pickComponent({
    prng,
    group: 'hair',
    values: options.hair,
  });

  return {
    'backhair': prng.bool(options.backhairProbability) ? backhairComponent : undefined,
    'body': bodyComponent,
    'head': headComponent,
    'clothes': clothesComponent,
    'mouth': mouthComponent,
    'beards': prng.bool(options.beardsProbability) ? beardsComponent : undefined,
    'eyes': eyesComponent,
    'eyebrows': eyebrowsComponent,
    'hair': hairComponent,
  }
};
