import type { OptionsFromSchema, Schema } from './schema';
import type { OptionsFromDefinition, Definition } from './definition';
import { Style } from './style';
import { schema } from '../schema';

type CoreOptions = OptionsFromSchema<typeof schema>;

type SchemaOptions<O extends {}> = O extends Definition
  ? OptionsFromDefinition<O>
  : O extends Schema
  ? OptionsFromSchema<O>
  : O extends Style<infer T>
  ? Options<T>
  : O;

export type Options<O extends {}> = Partial<CoreOptions & SchemaOptions<O>>;
