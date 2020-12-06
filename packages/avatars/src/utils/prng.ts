import type { Prng } from '../types';

const MIN = -2147483648;
const MAX = 2147483647;

function hashSeed(seed: string) {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }

  return hash;
}

function randomSeed() {
  return MIN + Math.floor((MAX - MIN) * Math.random()).toString();
}

export function create(seed?: string): Prng {
  seed = seed ?? randomSeed();

  let value = hashSeed(seed) || 1;

  const next = () => {
    value ^= value << 13;
    value ^= value >> 17;
    value ^= value << 5;

    return value;
  };

  const integer = (min: number, max: number) => {
    return Math.floor(((next() - MIN) / (MAX - MIN)) * (max + 1 - min) + min);
  };

  return {
    seed,
    bool(likelihood: number = 50) {
      return integer(0, 100) < likelihood;
    },
    integer(min: number, max: number) {
      return integer(min, max);
    },
    pick<T>(arr: T[]): T {
      return arr[integer(0, arr.length - 1)];
    },
  };
}
