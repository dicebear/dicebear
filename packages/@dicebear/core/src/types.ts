import { JSONSchema7 } from 'json-schema';

export interface Options {
  seed?: string;
  dataUri?: boolean;
  flip?: boolean;
  rotate?: number;
  scale?: number;
  radius?: number;
  size?: number;
  backgroundColor?: string[];
  translateX?: number;
  translateY?: number;
  clip?: boolean;
}

export interface Prng {
  seed: string;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[]): T;
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
