// Schema types
export type Schema = {
  $schema?: string;
} & SchemaObject;

type SchemaTypes =
  | SchemaObject
  | SchemaArray
  | SchemaString
  | SchemaNumber
  | SchemaBoolean;

type SchemaObject = {
  type: 'object';
  properties: {
    [key: string]: SchemaTypes;
  };
  default?: Record<string, unknown>;
};

type SchemaArray = {
  type: 'array';
  default?: Array<string | number | boolean>;
  items: SchemaTypes;
};

type SchemaString = {
  type: 'string';
  default?: string;
  enum?: string[];
  pattern?: string;
};

type SchemaNumber = {
  type: 'integer';
  default?: number;
  minimum?: number;
  maximum?: number;
};

type SchemaBoolean = {
  type: 'boolean';
  default?: boolean;
};

// Options from schema
export type OptionsFromSchema<T extends SchemaTypes> = T extends SchemaObject
  ? OptionsFromSchemaObject<T>
  : T extends SchemaArray
  ? OptionsFromSchemaArray<T>
  : T extends SchemaString
  ? OptionsFromSchemaString<T>
  : T extends SchemaNumber
  ? OptionsFromSchemaNumber<T>
  : T extends SchemaBoolean
  ? OptionsFromSchemaBoolean<T>
  : never;

type OptionsFromSchemaObject<T extends SchemaObject> = {
  [K in keyof T['properties']]: OptionsFromSchema<T['properties'][K]>;
};

type OptionsFromSchemaArray<T extends SchemaArray> = Array<
  OptionsFromSchema<T['items']>
>;

type OptionsFromSchemaString<T extends SchemaString> =
  T['enum'] extends string[] ? T['enum'][number][] : string;

type OptionsFromSchemaNumber<T extends SchemaNumber> = number;

type OptionsFromSchemaBoolean<T extends SchemaBoolean> = boolean;
