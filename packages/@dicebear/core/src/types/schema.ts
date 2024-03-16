// Schema types
export interface Schema extends SchemaObject {
  $schema?: string;
}

export interface SchemaObject {
  type: 'object';
  properties: {
    [key: string]: SchemaArray | SchemaString | SchemaNumber | SchemaBoolean;
  };
}

export interface SchemaArray {
  type: 'array';
  items: SchemaString | SchemaNumber | SchemaBoolean;
  default?: string[] | number[] | boolean[];
}

export interface SchemaString {
  type: 'string';
  enum?: string[];
  pattern?: string;
  default?: string;
}

export interface SchemaNumber {
  type: 'integer';
  minimum?: number;
  maximum?: number;
  default?: number;
}

export interface SchemaBoolean {
  type: 'boolean';
  default?: boolean;
}

// Options from schema
export type OptionsFromSchema<T extends {}> = T extends SchemaObject
  ? OptionsFromSchemaObject<T>
  : T extends SchemaArray
  ? OptionsFromSchemaArray<T>
  : T extends SchemaString
  ? OptionsFromSchemaString<T>
  : T extends SchemaNumber
  ? number
  : T extends SchemaBoolean
  ? boolean
  : never;

type OptionsFromSchemaObject<T extends SchemaObject> = {
  [K in keyof T['properties']]: OptionsFromSchema<T['properties'][K]>;
};

type OptionsFromSchemaArray<T extends SchemaArray> = Array<
  OptionsFromSchema<T['items']>
>;

type OptionsFromSchemaString<T extends SchemaString> = T['enum'] extends Array<
  infer E
>
  ? E
  : string;
