import type { Style } from "@dicebear/core";

export type ConfigStyleOption = {
  hasProbability?: boolean;
  probability: number;
  isColor?: boolean;
  isArray?: boolean;
  values: string[];
};

export type ConfigStyleOptions = Record<string, ConfigStyleOption>;

export type ConfigStyle = {
  style: Style<any>;
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
  options: SelectedStyleOptions;
  avatar: {
    toString: () => string;
    toDataUriSync: () => string;
  };
};

export type SelectedStyleCombinations = Record<
  string,
  SelectedStyleCombination[]
>;
