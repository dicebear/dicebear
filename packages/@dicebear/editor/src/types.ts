import type { StyleOptions } from '@dicebear/avatars';

export type Mode = 'prng' | 'fixed';
export type Defaults<O = {}> = StyleOptions<O>;
export type HiddenFields = string[];

export type Options<O> = {
  mode?: Mode;
  defaults?: Defaults<O>;
  hiddenFields?: HiddenFields;
};
