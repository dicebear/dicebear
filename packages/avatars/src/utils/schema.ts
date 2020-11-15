import type { JSONSchema7 } from 'json-schema';

export function clone(obj: JSONSchema7): JSONSchema7 {
  return JSON.parse(JSON.stringify(obj));
}

export function resolve(schema: JSONSchema7, dependencies: JSONSchema7[] = []): JSONSchema7 {
  const paths = new Map<string, any>();
  const refs: Array<{
    parent: Record<string, any>;
    field: string;
    path: string;
  }> = [];

  schema = clone(schema);
  dependencies = dependencies.map(clone);

  const traverse = (parent: Record<string, any>, field: string = undefined, base = 'http://localhost') => {
    let obj = field ? parent[field] : parent;
    let [path, hash] = base.split('#');
    let url = obj.$id ? new URL(obj.$id, path).toString() : field ? `${path}#${hash || ''}/${field}` : path;

    paths.set(url, obj);

    if (obj === Object(obj)) {
      Object.keys(obj).forEach((prop) => {
        if (prop === '$ref') {
          refs.push({
            parent,
            field,
            path: base,
          });
        } else {
          traverse(obj, prop, url);
        }
      });
    }
  };

  [schema, ...dependencies].forEach((obj) => traverse(obj));

  refs.forEach(({ parent, field, path }) => {
    let obj = parent[field];
    let ref = paths.get(new URL(obj.$ref, path).toString());

    parent[field] = {
      ...ref,
      ...obj,
    };

    delete parent[field].$ref;
  });

  return schema;
}

export function defaults(schema: JSONSchema7) {
  let result: Record<string, unknown> = {};

  iterateProperties(schema, (val, key) => {
    let defaultValue = val['default'];

    if (defaultValue) {
      result = {
        ...result,
        [key]: defaultValue,
      };
    }
  });

  return result;
}

export function examples(schema: JSONSchema7) {
  let result: Record<string, unknown> = {};

  iterateProperties(schema, (val, key) => {
    let examples = val['examples'];

    if (examples) {
      result = {
        ...result,
        [key]: examples,
      };
    }
  });

  return result;
}

export function aliases(schema: JSONSchema7) {
  let result: Record<string, string[]> = {};

  iterateProperties(schema, (val, key) => {
    let title = val['title'];

    if (title) {
      result = {
        ...result,
        [title]: [...(result[title] || []), key],
      };
    }
  });

  return Object.values(result).filter((val) => val.length > 1);
}

export function iterateProperties(schema: JSONSchema7, callback: (val: JSONSchema7, key: string) => unknown) {
  const traverse = (obj: Record<string, any>, isProperties: boolean = false) => {
    Object.keys(obj).forEach((key) => {
      if (key === 'properties') {
        traverse(obj[key], true);
      } else if (['oneOf', 'allOf', 'anyOf'].includes(key)) {
        obj[key].forEach((child: any) => traverse(child, isProperties));
      } else if (isProperties) {
        callback(obj[key], key);
      }
    });
  };

  traverse(schema);
}
