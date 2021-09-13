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

  return {
    mouth: mouthComponent,
    nose: noseComponent,
    eyes: eyesComponent,
    eyebrows: eyebrowsComponent,
  };
}
