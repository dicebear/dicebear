/// <reference types="../typings/pure-color" />

export interface Prng {
  seed: string;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[]): T;
  // @deprecated
  pickone<T>(arr: T[]): T;
  skip(rounds: number): void;
}

/**
 * @deprecated Since version 4.5. Will be removed in version 5.0.
 */
export interface Color {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

/**
 * @deprecated Since version 4.5. Will be removed in version 5.0.
 */
export interface ColorCollection {
  amber: Color;
  blue: Color;
  blueGrey: Color;
  brown: Color;
  cyan: Color;
  deepOrange: Color;
  deepPurple: Color;
  green: Color;
  grey: Color;
  indigo: Color;
  lightBlue: Color;
  lightGreen: Color;
  lime: Color;
  orange: Color;
  pink: Color;
  purple: Color;
  red: Color;
  teal: Color;
  yellow: Color;
}
