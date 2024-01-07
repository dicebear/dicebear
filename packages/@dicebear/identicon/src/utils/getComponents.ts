/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/np7zgQo9412LDvi1mA1UmK
 */

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
    row1: row1Component,
    row2: row2Component,
    row3: row3Component,
    row4: row4Component,
    row5: row5Component,
  };
}
