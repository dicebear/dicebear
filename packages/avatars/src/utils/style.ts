import type { Style, StyleOptions } from '../types';
import * as coreSchema from '../schema.json';
import * as schema from './schema';
import { JSONSchema7 } from 'json-schema';

export function options<O extends {}>(style: Style<O>, options: StyleOptions<O>): StyleOptions<O> {
  const userAgent = typeof window !== 'undefined' && window.navigator && window.navigator.userAgent;

  let optionSources: Partial<StyleOptions<O>>[] = [
    {
      seed: Math.random().toString(),
      userAgent: userAgent ? userAgent : undefined
    } as Partial<StyleOptions<O>>,
    schema.defaults(coreSchema as JSONSchema7) as Partial<StyleOptions<O>>,
    schema.defaults(style.schema) as Partial<StyleOptions<O>>,
    options
  ];

  let result = createOptionsProxy(style);

  optionSources.forEach(optionSource => {
    Object.keys(optionSource).forEach(key => {
      result[key as keyof StyleOptions<O>] = optionSource[key as keyof StyleOptions<O>];
    });
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

  return new Proxy({} as Partial<StyleOptions<O>>, {
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