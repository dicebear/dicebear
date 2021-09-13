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
  const headComponent = pickComponent({
    prng,
    group: 'head',
    values: options.head,
  });
  const faceComponent = pickComponent({
    prng,
    group: 'face',
    values: options.face,
  });
  const facialHairComponent = pickComponent({
    prng,
    group: 'facialHair',
    values: options.facialHair,
  });
  const maskComponent = pickComponent({
    prng,
    group: 'mask',
    values: options.mask,
  });
  const accessoriesComponent = pickComponent({
    prng,
    group: 'accessories',
    values: options.accessories,
  });

  return {
    head: headComponent,
    face: faceComponent,
    facialHair: facialHairComponent,
    mask: maskComponent,
    accessories: accessoriesComponent,
  };
}
