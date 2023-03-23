/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/gpLBQuklPE2XsOskwwv7QW
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng,
  options: Options
}

export function getComponents({ prng, options }: Props): ComponentPickCollection {
  const baseComponent = pickComponent({
    prng,
    group: 'base',
    values: options.base,
  });
  const bodyComponent = pickComponent({
    prng,
    group: 'body',
    values: options.body,
  });
  const hairComponent = pickComponent({
    prng,
    group: 'hair',
    values: options.hair,
  });
  const lipsComponent = pickComponent({
    prng,
    group: 'lips',
    values: options.lips,
  });
  const beardComponent = pickComponent({
    prng,
    group: 'beard',
    values: options.beard,
  });
  const noseComponent = pickComponent({
    prng,
    group: 'nose',
    values: options.nose,
  });
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes,
  });
  const glassesComponent = pickComponent({
    prng,
    group: 'glasses',
    values: options.glasses,
  });
  const browsComponent = pickComponent({
    prng,
    group: 'brows',
    values: options.brows,
  });
  const gestureComponent = pickComponent({
    prng,
    group: 'gesture',
    values: options.gesture,
  });
  const bodyIconComponent = pickComponent({
    prng,
    group: 'bodyIcon',
    values: options.bodyIcon,
  });

  return {
    'base': baseComponent,
    'body': bodyComponent,
    'hair': hairComponent,
    'lips': lipsComponent,
    'beard': prng.bool(options.beardProbability) ? beardComponent : undefined,
    'nose': noseComponent,
    'eyes': eyesComponent,
    'glasses': prng.bool(options.glassesProbability) ? glassesComponent : undefined,
    'brows': browsComponent,
    'gesture': prng.bool(options.gestureProbability) ? gestureComponent : undefined,
    'bodyIcon': prng.bool(options.bodyIconProbability) ? bodyIconComponent : undefined,
  }
};
