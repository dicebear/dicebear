import { StyleSchema } from '../types';

export function defaults(schema: StyleSchema) {
  let result: Record<string, unknown> = {};
  let properties = schema.properties || {};

  Object.keys(properties).forEach((key) => {
    let val = properties[key];

    if (typeof val === 'object' && undefined !== val.default) {
      result[key] = val.default;
    }
  });

  return result;
}

export function aliases(schema: StyleSchema) {
  let result: Record<string, string[]> = {};
  let properties = schema.properties || {};

  Object.keys(properties).forEach((key) => {
    let val = properties[key];

    if (typeof val === 'object') {
      let title = val.title;

      if (title) {
        result[title] = result[title] || [];
        result[title].push(key);
      }
    }
  });

  return Object.values(result)
    .filter((keys) => keys.length > 1)
    .map((keys) =>
      keys.sort().sort((a, b) => {
        if (a.length === b.length) {
          return 0;
        }

        return a.length > b.length ? 1 : -1;
      })
    );
}
