import type {
  SchemaDefaults,
  Style,
  StyleOptions,
  StyleSchema,
} from '../types.js';
import { schema } from '../schema.js';

export function defaults(schema: StyleSchema): SchemaDefaults {
  let result: SchemaDefaults = {};
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

export function merge<O extends {}>(
  style: Style<O>,
  options: StyleOptions<O>
): StyleOptions<O> {
  let result: StyleOptions<O> = {
    ...(defaults(schema) as StyleOptions<O>),
    ...(defaults(style.schema ?? {}) as StyleOptions<O>),
    ...options,
  };

  // Return a complete copy because the styles could partially customize the
  // options and thus modify nested objects and arrays.
  return JSON.parse(JSON.stringify(result));
}
