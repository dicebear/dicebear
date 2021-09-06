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
  const hairComponent = pickComponent({
    prng,
    group: 'hair',
    values: options.hair,
  });
  const hairAccessoriesComponent = pickComponent({
    prng,
    group: 'hairAccessories',
    values: options.hairAccessories,
  });
  const headComponent = pickComponent({
    prng,
    group: 'head',
    values: options.head,
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
  const earringsComponent = pickComponent({
    prng,
    group: 'earrings',
    values: options.earrings,
  });
  const frecklesComponent = pickComponent({
    prng,
    group: 'freckles',
    values: options.freckles,
  });
  const noseComponent = pickComponent({
    prng,
    group: 'nose',
    values: options.nose,
  });
  const beardComponent = pickComponent({
    prng,
    group: 'beard',
    values: options.beard,
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
    hair: hairComponent,
    hairAccessories: prng.bool(options.hairAccessoriesProbability)
      ? hairAccessoriesComponent
      : undefined,
    head: headComponent,
    eyes: eyesComponent,
    eyebrows: eyebrowsComponent,
    earrings: prng.bool(options.earringsProbability)
      ? earringsComponent
      : undefined,
    freckles: prng.bool(options.frecklesProbability)
      ? frecklesComponent
      : undefined,
    nose: noseComponent,
    beard: prng.bool(options.beardProbability) ? beardComponent : undefined,
    mouth: mouthComponent,
    glasses: prng.bool(options.glassesProbability)
      ? glassesComponent
      : undefined,
  };
}
