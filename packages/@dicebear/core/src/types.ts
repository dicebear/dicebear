// parcel bug workaround
import type * as JSONSchema from 'json-schema';
// import type { JSONSchema7 } from 'json-schema';
import type { Options } from './options';

export interface Prng {
  seed: string;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[]): T;
}

export type StyleSchema = JSONSchema.JSONSchema7;

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

export interface StylePreviewProps<O> {
  prng: Prng;
  options: StyleOptions<O>;
  property: keyof StyleOptions<O>;
}

export type StylePreview<O extends {}> = (props: StylePreviewProps<O>) => StylePreviewResult;

export interface StylePreviewResultAttributes {
  viewBox: string;
  [key: string]: string;
}

export type StylePreviewResult =
  | undefined
  | {
      attributes: StyleCreateResultAttributes;
      head?: string;
      body: string;
    };

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
  preview?: StylePreview<O>;
}
