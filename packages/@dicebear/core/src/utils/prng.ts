import type { Prng } from '../types.js';

const MIN = -2147483648;
const MAX = 2147483647;

function xorshift(value: number) {
  value ^= value << 13;
  value ^= value >> 17;
  value ^= value << 5;

  return value;
}

function hashSeed(seed: string) {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    hash = xorshift(hash);
  }

  return hash;
}

export function create(seed: string = ''): Prng {
  // Ensure that seed is a string
  seed = seed.toString();

  let value = hashSeed(seed) || 1;

  const next = () => (value = xorshift(value));

  const integer = (min: number, max: number) => {
    return Math.floor(((next() - MIN) / (MAX - MIN)) * (max + 1 - min) + min);
  };

  return {
    seed,
    next,
    bool(likelihood: number = 50) {
      return integer(1, 100) <= likelihood;
    },
    integer(min: number, max: number) {
      return integer(min, max);
    },
    pick<T>(arr: T[], fallback?: T): T | undefined {
      if (arr.length === 0) {
        next();

        return fallback;
      }

      return arr[integer(0, arr.length - 1)] ?? fallback;
    },
    shuffle(arr: any[]) {
      // Each method call should call the `next` function only once.
      // Therefore, we use a separate instance of the PRNG here.
      const internalPrng = create(next().toString());

      return arr.sort(() => internalPrng.integer(-1, 1));
    },
    string(
      length: number,
      characters: string = 'abcdefghijklmnopqrstuvwxyz1234567890'
    ): string {
      // Each method call should call the `next` function only once.
      // Therefore, we use a separate instance of the PRNG here.
      const internalPrng = create(next().toString());

      let str = '';

      for (let i = 0; i < length; i++) {
        str += characters[internalPrng.integer(0, characters.length - 1)];
      }

      return str;
    },
  };
}
