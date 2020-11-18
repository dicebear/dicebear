import * as seedrandom from 'seedrandom/seedrandom';

export default class Random {
  private prng: seedrandom.prng;
  public readonly seed: string;

  constructor(seed: string) {
    this.seed = seed;

    this.prng = seedrandom(seed);
  }

  bool(likelihood: number = 50) {
    return this.prng() * 100 < likelihood;
  }

  integer(min: number, max: number) {
    return Math.floor(this.prng() * (max - min + 1) + min);
  }

  pickone<T>(arr: T[]): T {
    return arr[this.integer(0, arr.length - 1)];
  }
}
