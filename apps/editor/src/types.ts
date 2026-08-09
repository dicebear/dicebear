import type { Style } from '@dicebear/core';

export type ConfigStyleOption = {
  hasProbability?: boolean;
  probability: number;
  isColor?: boolean;
  isArray?: boolean;
  values: string[];
  // Color group names, as declared by the style definition. `contrastTo` is a
  // single group, `notEqualTo` a list.
  contrastTo?: string;
  notEqualTo?: string[];
};

export type ConfigStyleOptions = Record<string, ConfigStyleOption>;

export type ConfigStyle = {
  style: Style;
  options: ConfigStyleOptions;
};

export type ConfigStyleCollection = Record<string, ConfigStyle>;

export type SelectedStyleOptions = Record<string, string>;
export type SelectedStyleOptionsCollection = Record<
  string,
  SelectedStyleOptions
>;

export type SelectedStyleCombination = {
  active?: boolean;
  isCustomColor?: boolean;
  options: SelectedStyleOptions;
  avatar: {
    toString: () => string;
    toDataUri: () => string;
  };
};

export type SelectedStyleCombinations = Record<
  string,
  SelectedStyleCombination[]
>;
