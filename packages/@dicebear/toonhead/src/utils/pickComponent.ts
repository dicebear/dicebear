/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 */

import type { Prng } from '@dicebear/core';
import type { ComponentGroupCollection, ComponentPick } from '../types.js';
import * as components from '../components/index.js';

type Props = {
  prng: Prng,
  group: string,
  values?: string[],
}

export function pickComponent({ prng, group, values = []}: Props): ComponentPick {
  const componentCollection: ComponentGroupCollection = components;

  const key = prng.pick(values);

  if (key && componentCollection[group][key]) {
    return {
      name: key,
      value: componentCollection[group][key],
    };
  } else {
    return undefined;
  }
}
