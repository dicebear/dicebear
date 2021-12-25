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
  const earComponent = pickComponent({
    prng,
    group: 'ear',
    values: options.ear,
  });
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes,
  });
  const cheekComponent = pickComponent({
    prng,
    group: 'cheek',
    values: options.cheek,
  });
  const noseComponent = pickComponent({
    prng,
    group: 'nose',
    values: options.nose,
  });
  const sideburnComponent = pickComponent({
    prng,
    group: 'sideburn',
    values: options.sideburn,
  });
  const frontHairComponent = pickComponent({
    prng,
    group: 'frontHair',
    values: options.frontHair,
  });

  return {
    hair: hairComponent,
    face: faceComponent,
    mouth: mouthComponent,
    ear: earComponent,
    eyes: eyesComponent,
    cheek: prng.bool(options.cheekProbability) ? cheekComponent : undefined,
    nose: noseComponent,
    sideburn: sideburnComponent,
    frontHair: frontHairComponent,
  };
}
