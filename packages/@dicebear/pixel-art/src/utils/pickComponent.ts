import type { Prng } from '@dicebear/core';
import type { ComponentGroupCollection, ComponentPick } from '../types.js';
import * as components from '../components/index.js';

type Props = {
  prng: Prng;
  group: string;
  values?: string[];
};

export function pickComponent({
  prng,
  group,
  values = [],
}: Props): ComponentPick {
  const componentCollection: ComponentGroupCollection = components;

  const key = prng.pick(values);

  if (componentCollection[group][key]) {
    return {
      name: key,
      value: componentCollection[group][key],
    };
  } else {
    return undefined;
  }
}
