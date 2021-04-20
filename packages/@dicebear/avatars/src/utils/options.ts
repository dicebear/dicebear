import type { Style, StyleOptions } from '../types';
import { schema as coreSchema } from '../schema';
import * as schema from './schema';

export function merge<O extends {}>(style: Style<O>, options: StyleOptions<O>): StyleOptions<O> {
  let optionSources: StyleOptions<O>[] = [
    {
      seed: Math.random().toString(),
      /** @ts-ignore @deprecated - will be removed with version 5.0 */
      userAgent: typeof window !== 'undefined' && window.navigator && window.navigator.userAgent,
    } as StyleOptions<O>,
    schema.defaults(coreSchema) as StyleOptions<O>,
    schema.defaults(style.schema) as StyleOptions<O>,
    options,
  ];

  let result = createAliasProxy(style);

  optionSources.forEach((optionSource) => {
    result = Object.assign(result, optionSource);
  });

  return result as StyleOptions<O>;
}

export function createAliasProxy<O extends {}>(style: Style<O>) {
  let aliasMap = [...schema.aliases(coreSchema), ...schema.aliases(style.schema)].reduce((map, aliases) => {
    aliases.forEach((alias) => {
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
    },
  });
}
