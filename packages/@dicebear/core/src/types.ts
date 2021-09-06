import type { JSONSchema7 } from 'json-schema';
import type { BinaryResult } from '@dicebear/converter';

export interface ResultConvertOptions {
  includeExif?: boolean;
}

export type Result = string & {
  svg(): BinaryResult;
  png(options?: ResultConvertOptions): BinaryResult;
  jpeg(options?: ResultConvertOptions): BinaryResult;
};

export interface Options {
  seed?: string;
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

export interface Exif {
  [key: string]: string;
}

export type SchemaDefaults = Record<string, unknown>;

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

export type StyleCreate<O extends {}> = (
  props: StyleCreateProps<O>
) => StyleCreateResult;

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
  source?: string;
  creator?: string;
  homepage?: string;
  license?: {
    name: string;
    url: string;
  };
}

export interface Style<O extends {}> {
  meta: StyleMeta;
  schema: StyleSchema;
  create: StyleCreate<O>;
}
