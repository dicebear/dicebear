import type { JSONSchema7 } from 'json-schema';
import type { Result as ConverterResult } from '@dicebear/converter';

export interface ResultConvertOptions {
  includeExif?: boolean;
}

export interface Result extends ConverterResult {
  png(options?: ResultConvertOptions): ConverterResult;
  jpeg(options?: ResultConvertOptions): ConverterResult;
  toString(): string;
  toJson(): {
    svg: string;
    extra: Record<string, unknown>;
  };
}

export type BackgroundType = 'solid' | 'linear';

export interface Options {
  seed?: string;
  flip?: boolean;
  rotate?: number;
  scale?: number;
  radius?: number;
  size?: number;
  backgroundColor?: string[];
  backgroundType?: BackgroundType[];
  backgroundRotation?: number[];
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
  next(): void;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[], fallback: T): T;
  pick<T>(arr: T[]): T | undefined;
  shuffle<T>(arr: T[]): T[];
  string(length: number, characters?: string): string;
}

export type StyleSchema = JSONSchema7;

export type StyleOptions<O extends {}> = Partial<O & Options>;

export interface StyleCreateProps<O extends {}> {
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
  extra?: () => Record<string, unknown>;
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
  meta?: StyleMeta;
  schema?: StyleSchema;
  create: StyleCreate<O>;
}
