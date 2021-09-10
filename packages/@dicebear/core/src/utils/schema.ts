import { StyleSchema } from '../types';

export function properties(schema: StyleSchema) {
  return schema.properties ?? {};
}

export function defaults(schema: StyleSchema) {
  let result: Record<string, unknown> = {};
  let props = properties(schema);

  Object.keys(props).forEach((key) => {
    let val = props[key];

    if (typeof val === 'object' && undefined !== val.default) {
      result[key] = val.default;
    }
  });

  return result;
}
