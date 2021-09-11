import type { Style, StyleOptions } from '../types';
import coreSchema from '../schema.json';
import * as schema from './schema';
import { JSONSchema7 } from 'json-schema';

export function merge<O extends {}>(style: Style<O>, options: StyleOptions<O>): StyleOptions<O> {
  let result: StyleOptions<O> = {
    ...{
      seed: Math.random().toString(),
    },
    ...(schema.defaults(coreSchema as JSONSchema7) as StyleOptions<O>),
    ...(schema.defaults(style.schema) as StyleOptions<O>),
    ...options,
  };

  return result;
}
