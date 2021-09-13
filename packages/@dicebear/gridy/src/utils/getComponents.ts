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
  const bodyComponent = pickComponent({
    prng,
    group: 'body',
    values: options.body,
  });
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes,
  });
  const mouthComponent = pickComponent({
    prng,
    group: 'mouth',
    values: options.mouth,
  });

  return {
    body: bodyComponent,
    eyes: eyesComponent,
    mouth: mouthComponent,
  };
}
