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
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes,
  });
  const hairComponent = pickComponent({
    prng,
    group: 'hair',
    values: options.hair,
  });
  const bodyComponent = pickComponent({
    prng,
    group: 'body',
    values: options.body,
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
  const facialHairComponent = pickComponent({
    prng,
    group: 'facialHair',
    values: options.facialHair,
  });

  return {
    eyes: eyesComponent,
    hair: hairComponent,
    body: bodyComponent,
    mouth: mouthComponent,
    nose: noseComponent,
    facialHair: prng.bool(options.facialHairProbability)
      ? facialHairComponent
      : undefined,
  };
}
