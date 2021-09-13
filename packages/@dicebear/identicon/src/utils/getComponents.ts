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
  const row1Component = pickComponent({
    prng,
    group: 'row1',
    values: options.row1,
  });
  const row2Component = pickComponent({
    prng,
    group: 'row2',
    values: options.row2,
  });
  const row3Component = pickComponent({
    prng,
    group: 'row3',
    values: options.row3,
  });
  const row4Component = pickComponent({
    prng,
    group: 'row4',
    values: options.row4,
  });
  const row5Component = pickComponent({
    prng,
    group: 'row5',
    values: options.row5,
  });

  return {
    row1: prng.bool(options.row1Probability) ? row1Component : undefined,
    row2: prng.bool(options.row2Probability) ? row2Component : undefined,
    row3: prng.bool(options.row3Probability) ? row3Component : undefined,
    row4: prng.bool(options.row4Probability) ? row4Component : undefined,
    row5: prng.bool(options.row5Probability) ? row5Component : undefined,
  };
}
