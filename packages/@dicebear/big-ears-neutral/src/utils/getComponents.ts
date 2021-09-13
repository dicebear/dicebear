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
  return {};
}
