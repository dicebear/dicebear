import type { Style, StyleOptions } from '../types';
import { schema as coreSchema } from '../schema';
import * as schema from './schema';
import * as helper from './helper';

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

  optionSources.forEach((optionSource: Record<string, any>) => {
    result = Object.assign(result, helper.omit(optionSource, '_aliases'));
  });

  return result;
}

export function createAliasProxy<O extends {}>(style: Style<O>): StyleOptions<O> {
  let aliasMap = [...schema.aliases(coreSchema), ...schema.aliases(style.schema)].reduce((map, aliases) => {
    aliases.forEach((alias) => {
      map.set(alias, aliases[0]);
    });

    return map;
  }, new Map<string | symbol, string>());

  return new Proxy(
    {
      _aliases: aliasMap,
    } as { _aliases: Map<string | symbol, string> } & StyleOptions<O>,
    {
      get: (obj, key) => {
        let originalKey = (obj._aliases.get(key) ?? key) as keyof StyleOptions<O>;

        return obj[originalKey];
      },
      set: (obj, key, value) => {
        let originalKey = (obj._aliases.get(key) ?? key) as keyof StyleOptions<O>;

        obj[originalKey] = value;

        return true;
      },
      deleteProperty: (obj, key) => {
        let originalKey = (obj._aliases.get(key) ?? key) as keyof StyleOptions<O>;

        delete obj[originalKey];

        return true;
      },
    }
  );
}
