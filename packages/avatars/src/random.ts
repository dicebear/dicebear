import type { Prng } from './types';
import { create } from './utils/prng';

/**
 * @deprecated use `utils.prng` instead.
 */
export default class Random {
  private prng: Prng;
  public readonly seed: string;

  constructor(seed: string) {
    this.prng = create(seed);
    this.seed = this.prng.seed;
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
