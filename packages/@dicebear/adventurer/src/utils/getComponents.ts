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
  const baseComponent = pickComponent({
    prng,
    group: 'base',
    values: options.base,
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
  const accessoiresComponent = pickComponent({
    prng,
    group: 'accessoires',
    values: options.accessoires,
  });
  const hairComponent = pickComponent({
    prng,
    group: 'hair',
    values: options.hair,
  });

  return {
    base: baseComponent,
    eyes: eyesComponent,
    eyebrows: eyebrowsComponent,
    mouth: mouthComponent,
    accessoires: prng.bool(options.accessoiresProbability)
      ? accessoiresComponent
      : undefined,
    hair: prng.bool(options.hairProbability) ? hairComponent : undefined,
  };
}
