import type { Style, StyleOptions } from '../types';
import * as coreSchema from '../schema.json';
import * as schema from './schema';
import { JSONSchema7 } from 'json-schema';

export function options<O extends {}>(style: Style<O>, options: StyleOptions<O>): StyleOptions<O> {
  let mergedOptions: StyleOptions<O> = {
    seed: Math.random().toString(),
    userAgent: typeof window !== 'undefined' && window.navigator && window.navigator.userAgent,
    ...schema.defaults(coreSchema as JSONSchema7),
    ...schema.defaults(style.schema),
    ...options,
  };

  let aliasCollection = [...schema.aliases(coreSchema as JSONSchema7), ...schema.aliases(style.schema)].reduce(
    (result, values) => {
      values.forEach((key) => {
        result[key] = values;
      });

      return result;
    },
    {} as Record<string, string[]>
  );

  return new Proxy(mergedOptions, {
    get: (obj, key) => {
      const aliases = aliasCollection[key.toString()];

      if (Array.isArray(aliases)) {
        for (let i = 0; i < aliases.length; i++) {
          let alias = aliases[i];

          if (alias in obj) {
            return obj[alias as keyof StyleOptions<O>];
          }
        }
      }

      return obj[key as keyof StyleOptions<O>];
    },
    set: (obj, key, value) => {
      const aliases = aliasCollection[key.toString()];

      if (Array.isArray(aliases)) {
        obj[aliases[0] as keyof StyleOptions<O>] = value;
      }

      return true;
    },
    deleteProperty: (obj, key) => {
      const aliases = aliasCollection[key.toString()];

      if (Array.isArray(aliases)) {
        aliases.forEach(alias => {
          delete obj[alias as keyof StyleOptions<O>];
        });

        return true;
      }

      delete obj[key.toString() as keyof StyleOptions<O>];

      return true;
    }
  });
}
