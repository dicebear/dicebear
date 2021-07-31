import type { JSONSchema7 } from 'json-schema';
import type { Mode } from '../types';

import { utils } from '@dicebear/avatars';

export function getSchemaProperties(schema: JSONSchema7, mode: Mode): Map<string, JSONSchema7> {
  let result = new Map<string, JSONSchema7>();
  let properties = schema.properties ?? {};
  let aliases = utils.schema.aliasesMap(schema);

  for (const key in properties) {
    if (false === properties.hasOwnProperty(key)) {
      continue;
    }

    const property = properties[key];

    if (typeof property === 'boolean') {
      continue;
    }

    if (aliases.has(key)) {
      continue;
    }

    if (property.description?.match(/@deprecated/)) {
      continue;
    }

    if (mode === 'fixed' && key.match(/(Probability$|Chance$|^seed$)/)) {
      continue;
    }

    result.set(key, property);
  }

  return result;
}
