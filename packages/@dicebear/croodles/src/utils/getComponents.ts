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
  const faceComponent = pickComponent({
    prng,
    group: 'face',
    values: options.face,
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
  const topComponent = pickComponent({
    prng,
    group: 'top',
    values: options.top,
  });
  const mustacheComponent = pickComponent({
    prng,
    group: 'mustache',
    values: options.mustache,
  });
  const eyesComponent = pickComponent({
    prng,
    group: 'eyes',
    values: options.eyes,
  });

  return {
    face: faceComponent,
    nose: noseComponent,
    beard: prng.bool(options.beardProbability) ? beardComponent : undefined,
    mouth: mouthComponent,
    top: topComponent,
    mustache: prng.bool(options.mustacheProbability)
      ? mustacheComponent
      : undefined,
    eyes: eyesComponent,
  };
}
