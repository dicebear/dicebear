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

export interface BaseField {
  name: string;
  title?: string;
}

export interface TextField extends BaseField {
  type: 'text';
  pattern?: string;
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
}

export interface RangeField extends BaseField {
  type: 'range';
  min?: number;
  max?: number;
}

export interface SelectField extends BaseField {
  type: 'select';
  options: Array<{
    value: JSONSchema7Type;
    preview: (options: StyleOptions<any>) => string;
  }>;
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
}

export type Field = TextField | NumberField | RangeField | SelectField | CheckboxField;
