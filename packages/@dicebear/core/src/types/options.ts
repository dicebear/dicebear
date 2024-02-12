import type { OptionsFromSchema, Schema } from './schema';
import type { OptionsFromDefinition, Definition } from './definition';
import { Style } from './style';

export type Options<O extends {}> = O extends Definition
  ? CoreOptions & OptionsFromDefinition<O>
  : O extends Schema
  ? CoreOptions & OptionsFromSchema<O>
  : O extends Style<infer T>
  ? Options<T>
  : CoreOptions & O;

type CoreOptions = {
  seed?: string;
  flip?: boolean;
  rotate?: number;
  scale?: number;
  radius?: number;
  size?: number;
  backgroundColor?: string[];
  backgroundType?: Array<'solid' | 'gradientLinear'>;
  backgroundRotation?: number[];
  translateX?: number;
  translateY?: number;
  clip?: boolean;
  randomizeIds?: boolean;
};
