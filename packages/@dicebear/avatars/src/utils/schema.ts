import { StyleSchema } from '../types';

export function properties(schema: StyleSchema) {
  return schema.properties || {};
}

export function defaults(schema: StyleSchema) {
  let result: Record<string, unknown> = {};
  let props = properties(schema);

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

export function aliases(schema: StyleSchema) {
  let result: Record<string, string[]> = {};
  let props = properties(schema);

  Object.keys(props).forEach((key) => {
    let val = props[key];

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

export function aliasesMap(schema: StyleSchema) {
  let result = new Map<string, string>();

  for (let row of aliases(schema)) {
    let [key, ...values] = row.reverse();

    for (let val of values) {
      result.set(val, key);
    }
  }

  return result;
}
