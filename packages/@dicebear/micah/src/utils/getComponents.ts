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
  const baseComponent = pickComponent({
    prng,
    group: 'base',
    values: options.base,
  });
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth,
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
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes,
  });
  const noseComponent = pickComponent({
    prng,
    group: 'nose',
    values: options.nose,
  });
  const earsComponent = pickComponent({
    prng,
    group: 'ears',
    values: options.ears,
  });
  const shirtComponent = pickComponent({
    prng,
    group: 'shirt',
    values: options.shirt,
  });
  const earringsComponent = pickComponent({
    prng,
    group: 'earrings',
    values: options.earrings,
  });
  const glassesComponent = pickComponent({
    prng,
    group: 'glasses',
    values: options.glasses,
  });
  const facialHairComponent = pickComponent({
    prng,
    group: 'facialHair',
    values: options.facialHair,
  });

  return {
    base: baseComponent,
    mouth: mouthComponent,
    eyebrows: eyebrowsComponent,
    hair: prng.bool(options.hairProbability) ? hairComponent : undefined,
    eyes: eyesComponent,
    nose: noseComponent,
    ears: earsComponent,
    shirt: shirtComponent,
    earrings: prng.bool(options.earringsProbability)
      ? earringsComponent
      : undefined,
    glasses: prng.bool(options.glassesProbability)
      ? glassesComponent
      : undefined,
    facialHair: prng.bool(options.facialHairProbability)
      ? facialHairComponent
      : undefined,
  };
}
