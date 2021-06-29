import type { JSONSchema7Type } from 'json-schema';
import type { StyleOptions } from '@dicebear/avatars';

export type Mode = 'prng' | 'fixed';
export type Defaults<O = {}> = StyleOptions<O>;
export type HiddenFields = string[];

export type Options<O> = {
  mode?: Mode;
  defaults?: Defaults<O>;
  hiddenFields?: HiddenFields;
};

export type TextField = {
  type: 'text';
};

export type NumberField = {
  type: 'number';
  min?: number;
  max?: number;
};

export type SelectField = {
  type: 'select';
  options: Array<{
    value: JSONSchema7Type;
    preview: (options: StyleOptions<any>) => string;
  }>;
};

export type CheckboxField = {
  type: 'checkbox';
};

export type Field = TextField | NumberField | SelectField | CheckboxField;
