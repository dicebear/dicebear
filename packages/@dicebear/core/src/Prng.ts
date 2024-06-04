export class Prng {
  private readonly seed: string;
  private value: number;

  private MIN = -2147483648;
  private MAX = 2147483647;

  /**
   * Namespace can be useful to create multiple instances for a seed and still
   * not repeat results. Multiple instances can in turn be useful if an area of
   * the avatar style is changed (e.g. colors) but the untouched areas should
   * still give the same result (e.g. components and core).
   */
  constructor(seed?: string, namespace?: string) {
    seed ??= this.generateRandomSeed();

    this.seed = seed;
    this.value = this.hashSeed(namespace ? `${namespace}/${seed}` : seed) || 1;
  }

  generateRandomSeed(): string {
    return Math.random().toString(36).substring(2, 7);
  }

  getSeed(): string {
    return this.seed;
  }

  next(): number {
    return (this.value = this.xorshift(this.value));
  }

  bool(likelihood: number = 50): boolean {
    return this.integer(1, 100) <= likelihood;
  }

  integer(min: number, max: number): number {
    return Math.floor(
      ((this.next() - this.MIN) / (this.MAX - this.MIN)) * (max + 1 - min) +
        min,
    );
  }

  pick<T>(arr: T[]): T | undefined;
  pick<T>(arr: T[], fallback: T): T;
  pick<T>(arr: T[], fallback?: T): T | undefined {
    // An array with identical values should always deliver the same result
    // regardless of the order of the values. We achieve this by creating a
    // working array and sorting its values at the beginning.
    const workingArray = [...arr].sort();

    if (workingArray.length === 0) {
      this.next();

      return fallback;
    }

    return workingArray[this.integer(0, workingArray.length - 1)];
  }

  string(
    length: number,
    characters: string = 'abcdefghijklmnopqrstuvwxyz1234567890',
  ): string {
    // Each method call should call the `next` function only once.
    // Therefore, we use a separate instance of the Prng here.
    const internalPrng = Prng.create(this.next().toString());

    let str = '';

    for (let i = 0; i < length; i++) {
      str += characters[internalPrng.integer(0, characters.length - 1)];
    }

    return str;
  }

  private xorshift(value: number): number {
    value ^= value << 13;
    value ^= value >> 17;
    value ^= value << 5;

    return value;
  }

  private hashSeed(seed: string): number {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
      hash = this.xorshift(hash);
    }

    return hash;
  }
}
