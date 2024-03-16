import type {
  OptionsFromSchema,
  SchemaArray,
  SchemaString,
  SchemaNumber,
  SchemaBoolean,
} from './schema';
import type { StyleAttributes, StyleMeta } from './style';

// Style definition types
export interface Definition {
  meta?: StyleMeta;
  body: string;
  attributes: StyleAttributes;
  components?: Record<string, DefinitionCompontent>;
  colors?: Record<string, DefinitionColor>;
  additionalOptions?: Record<string, DefinitionAdditionalOption>;
}

interface DefinitionCompontent {
  probability?: number;
  rotation?: number;
  offset?: {
    x?: number;
    y?: number;
  };
  values: Record<string, DefinitionComponentValue>;
}

interface DefinitionComponentValue {
  default?: boolean;
  content: string;
}

interface DefinitionColor {
  values: string[];
  unique?: boolean;
}

type DefinitionAdditionalOption =
  | SchemaArray
  | SchemaString
  | SchemaNumber
  | SchemaBoolean;

// Options from definition
export type OptionsFromDefinition<T extends Definition> =
  OptionsFromDefinitionComponent<T> &
    OptionsFromDefinitionComponentRotation<T> &
    OptionsFromDefinitionComponentProbability<T> &
    OptionsFromDefinitionComponentOffsetX<T> &
    OptionsFromDefinitionComponentOffsetY<T> &
    OptionsFromDefinitionColor<T> &
    OptionsFromDefinitionAdditonalOptionsSchema<T>;

type OptionsFromDefinitionComponent<T extends Definition> = {
  [C in keyof T['components']]: T['components'][C] extends DefinitionCompontent
    ? Array<keyof T['components'][C]['values']>
    : never;
};

type OptionsFromDefinitionComponentRotation<T extends Definition> = {
  [C in keyof T['components'] as `${string &
    C}Rotation`]: T['components'][C] extends { rotation: number }
    ? number
    : never;
};

type OptionsFromDefinitionComponentProbability<T extends Definition> = {
  [C in keyof T['components'] as `${string &
    C}Probability`]: T['components'][C] extends { probability: number }
    ? number
    : never;
};

type OptionsFromDefinitionComponentOffsetX<T extends Definition> = {
  [C in keyof T['components'] as `${string &
    C}OffsetX`]: T['components'][C] extends { offset: { x: number } }
    ? number
    : never;
};

type OptionsFromDefinitionComponentOffsetY<T extends Definition> = {
  [C in keyof T['components'] as `${string &
    C}OffsetY`]: T['components'][C] extends { offset: { y: number } }
    ? number
    : never;
};

type OptionsFromDefinitionColor<T extends Definition> = {
  [C in keyof T['colors'] as `${string & C}Color`]: string[];
};

type OptionsFromDefinitionAdditonalOptionsSchema<T extends Definition> = {
  [K in keyof T['additionalOptions']]: T['additionalOptions'][K] extends DefinitionAdditionalOption
    ? OptionsFromSchema<T['additionalOptions'][K]>
    : never;
};
