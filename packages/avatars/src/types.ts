/// <reference types="../typings/pure-color" />

import type { JSONSchema7 } from 'json-schema';
import type { Options } from './options';

export interface Prng {
  seed: string;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[]): T;
}

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

export type StyleSchema = JSONSchema7;

export type StyleOptions<O extends {}> = Partial<O & Options>;

export interface StyleCreateProps<O> {
  prng: Prng;
  options: StyleOptions<O>;
}

export type StyleCreate<O extends {}> = (props: StyleCreateProps<O>) => StyleCreateResult;

export interface StyleCreateResultAttributes {
  viewBox: string;
  [key: string]: string;
}

export interface StyleCreateResult {
  attributes: StyleCreateResultAttributes;
  head?: string;
  body: string;
}

export interface StyleMeta {
  title?: string;
  creator?: string | string[];
  source?: string;
  license?: {
    name: string;
    url: string;
  };
  contributor?: string | string[];
}

export interface Style<O extends {}> {
  meta: StyleMeta;
  schema: StyleSchema;
  create: StyleCreate<O>;
}
