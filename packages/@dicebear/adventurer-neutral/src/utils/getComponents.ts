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
  const eyebrowsComponent = pickComponent({
    prng,
    group: 'eyebrows',
    values: options.eyebrows,
  });
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth,
  });
  const glassesComponent = pickComponent({
    prng,
    group: 'glasses',
    values: options.glasses,
  });

  return {
    eyes: eyesComponent,
    eyebrows: eyebrowsComponent,
    mouth: mouthComponent,
    glasses: prng.bool(options.glassesProbability)
      ? glassesComponent
      : undefined,
  };
}
