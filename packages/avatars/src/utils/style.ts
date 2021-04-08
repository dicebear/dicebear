import type { Style, StyleOptions } from '../types';
import * as coreSchema from '../schema.json';
import * as schema from './schema';
import { JSONSchema7 } from 'json-schema';

export function options<O extends {}>(style: Style<O>, options: StyleOptions<O>): StyleOptions<O> {
  let optionSources: StyleOptions<O>[] = [
    {
      seed: Math.random().toString(),
      userAgent: typeof window !== 'undefined' && window.navigator && window.navigator.userAgent
    } as StyleOptions<O>,
    schema.defaults(coreSchema as JSONSchema7) as StyleOptions<O>,
    schema.defaults(style.schema) as StyleOptions<O>,
    options
  ];

  let result = createOptionsProxy(style);

  optionSources.forEach(optionSource => {
    result = Object.assign(result, optionSource);
  });

  return result as StyleOptions<O>;
}

export function createOptionsProxy<O extends {}>(style: Style<O>) {
  let aliasMap = [...schema.aliases(coreSchema as JSONSchema7), ...schema.aliases(style.schema)].reduce((map, aliases) => {
    aliases.forEach(alias => {
      map.set(alias, aliases[0]);
    });

    return map;
  }, new Map<string | symbol, string>());

  return new Proxy({} as StyleOptions<O>, {
    get: (obj, key) => {
      let originalKey = (aliasMap.get(key) ?? key) as keyof StyleOptions<O>;

      return obj[originalKey];
    },
    set: (obj, key, value) => {
      let originalKey = (aliasMap.get(key) ?? key) as keyof StyleOptions<O>;

      obj[originalKey] = value;

      return true;
    },
    deleteProperty: (obj, key) => {
      let originalKey = (aliasMap.get(key) ?? key) as keyof StyleOptions<O>;

      delete obj[originalKey];

      return true;
    }
  });
}