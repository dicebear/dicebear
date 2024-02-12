import type { Options } from './options';
import type { Prng } from './prng';
import type { Schema } from './schema';

// Style information types
export interface StyleMeta {
  license?: {
    name?: string;
    url?: string;
    content?: string;
  };
  creator?: {
    name?: string;
    url?: string;
  };
  source?: {
    name?: string;
    url?: string;
  };
}

export interface StyleAttributes {
  viewBox: string;
  [key: string]: string;
}

export type Style<T extends {}> = {
  meta?: StyleMeta;
  schema?: T extends Schema ? T : Schema;
  create: StyleCreate;
}

export type StyleCreate = <T extends {}>(props: StyleCreateProps<T>) => StyleCreateResult;

export type StyleCreateProps<T extends {}> = { prng: Prng, options: Options<T> };

export interface StyleCreateResult {
  attributes: StyleAttributes;
  body: string;
  extra?: () => Record<string, unknown>;
}
