import type { Style, StyleOptions } from '../types';
import { schema as coreSchema } from '../schema';
import * as schema from './schema';

export function merge<O extends {}>(style: Style<O>, options: StyleOptions<O>): StyleOptions<O> {
  let result: StyleOptions<O> = {
    ...{
      seed: Math.random().toString(),
    },
    ...(schema.defaults(coreSchema) as StyleOptions<O>),
    ...(schema.defaults(style.schema) as StyleOptions<O>),
    ...options,
  };

  return result;
}
