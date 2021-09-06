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
  const faceComponent = pickComponent({
    prng,
    group: 'face',
    values: options.face,
  });
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth,
  });
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
  const accessoriesComponent = pickComponent({
    prng,
    group: 'accessories',
    values: options.accessories,
  });

  return {
    face: faceComponent,
    mouth: mouthComponent,
    eyes: eyesComponent,
    hair: hairComponent,
    accessories: prng.bool(options.accessoriesProbability)
      ? accessoriesComponent
      : undefined,
  };
}
