import type { Prng } from '@dicebear/core';
import type { Options } from '../options';
import type { ComponentPickCollection } from '../static-types';
import { pickComponent } from './pickComponent';

type Props = {
  prng: Prng;
  options: Options;
};

export function getComponents({
  prng,
  options,
}: Props): ComponentPickCollection {
  const beardComponent = pickComponent({
    prng,
    group: 'beard',
    values: options.beard,
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
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth,
  });
  const hairComponent = pickComponent({
    prng,
    group: 'hair',
    values: options.hair,
  });
  const accessoriesComponent = pickComponent({
    prng,
    group: 'accessories',
    values: options.accessories,
  });
  const glassesComponent = pickComponent({
    prng,
    group: 'glasses',
    values: options.glasses,
  });
  const hatComponent = pickComponent({
    prng,
    group: 'hat',
    values: options.hat,
  });
  const clothingComponent = pickComponent({
    prng,
    group: 'clothing',
    values: options.clothing,
  });

  return {
    beard: prng.bool(options.beardProbability) ? beardComponent : undefined,
    eyes: eyesComponent,
    eyebrows: eyebrowsComponent,
    mouth: mouthComponent,
    hair: prng.bool(options.hairProbability) ? hairComponent : undefined,
    accessories: prng.bool(options.accessoriesProbability)
      ? accessoriesComponent
      : undefined,
    glasses: prng.bool(options.glassesProbability)
      ? glassesComponent
      : undefined,
    hat: prng.bool(options.hatProbability) ? hatComponent : undefined,
    clothing: clothingComponent,
  };
}
