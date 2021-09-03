import type { Prng } from '@dicebear/avatars';
import type { ComponentGroupCollection, ComponentPick } from '../static-types';

import * as components from '../components';

export function pickComponent(prng: Prng, group: string, values: string[] = []): ComponentPick {
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
