import type { Style, StyleOptions, StyleSchema } from '../types.js';
import { schema } from '../schema.js';

export function defaults(schema: StyleSchema) {
  let result: Record<string, unknown> = {};
  let props = schema.properties ?? {};

  Object.keys(props).forEach((key) => {
    let val = props[key];

    if (typeof val === 'object' && undefined !== val.default) {
      if (Array.isArray(val.default)) {
        result[key] = [...val.default];
      } else if (typeof val.default === 'object') {
        result[key] = { ...val.default };
      } else {
        result[key] = val.default;
      }
    }
  });

  return result;
}

export function merge<O extends {}>(style: Style<O>, options: StyleOptions<O>): StyleOptions<O> {
  let result: StyleOptions<O> = {
    ...{
      seed: Math.random().toString(),
    },
    ...(defaults(schema) as StyleOptions<O>),
    ...(defaults(style.schema) as StyleOptions<O>),
    ...options,
  };

  return result;
}
