import type { Prng } from './types';
import { create } from './utils/prng';

/**
 * @deprecated Since version 4.5. Will be removed in version 5.0. Use `utils.prng` instead.
 */
export default class Random {
  private prng: Prng;

  constructor(seed: string) {
    this.prng = create(seed);
  }

  get seed() {
    return this.prng.seed;
  }

  bool(likelihood: number = 50) {
    return this.prng.bool(likelihood);
  }

  integer(min: number, max: number) {
    return this.prng.integer(min, max);
  }

  pickone<T>(arr: T[]): T {
    return this.prng.pick(arr);
  }
}
