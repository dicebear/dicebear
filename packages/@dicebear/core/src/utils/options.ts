import type {
  Style,
  Options,
  Schema,
} from '../types.js';
import { schema } from '../schema.js';

export function defaults(schema: Schema): Record<string, unknown> {
  let result: Record<string, unknown> = {};
  let props = schema.properties ?? {};

  Object.keys(props).forEach((key) => {
    let val = props[key];

    if (undefined !== val.default) {
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
  options: Options<O>
): Options<O> {
  let result: Options<O> = {
    ...(defaults(schema) as Options<O>),
    ...(style.schema ? defaults(style.schema) as Options<O> : {}),
    ...options,
  };

  // Return a complete copy because the styles could partially customize the
  // options and thus modify nested objects and arrays.
  return JSON.parse(JSON.stringify(result));
}
