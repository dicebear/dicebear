export interface Prng {
  seed: string;
  next(): void;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[], fallback: T): T;
  pick<T>(arr: T[]): T | undefined;
  shuffle<T>(arr: T[]): T[];
  string(length: number, characters?: string): string;
}
