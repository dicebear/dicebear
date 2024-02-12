import type { StyleAttributes, StyleMeta } from "./style";

// Style definition types
export interface Definition {
  meta?: StyleMeta;
  body: string;
  attributes: StyleAttributes;
  components: {
    [name: string]: {
      probability?: number;
      rotation?: number;
      offset?: {
        x?: number;
        y?: number;
      };
      values: {
        [name: string]: {
          default?: boolean;
          content: string;
        };
      };
    };
  };
  colors?: {
    [name: string]: {
      values: string[];
      unique?: boolean;
    };
  };
}

// Options from definition
export type OptionsFromDefinition<T extends Definition> =
  OptionsFromDefinitionComponent<T> &
    OptionsFromDefinitionComponentRotation<T> &
    OptionsFromDefinitionComponentProbability<T> &
    OptionsFromDefinitionComponentOffsetX<T> &
    OptionsFromDefinitionComponentOffsetY<T> &
    OptionsFromDefinitionColor<T>;

type OptionsFromDefinitionComponent<T extends Definition> = {
  [C in keyof T['components']]: Array<keyof T['components'][C]['values']>;
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
