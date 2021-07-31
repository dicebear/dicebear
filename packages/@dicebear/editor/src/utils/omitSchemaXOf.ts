import type { JSONSchema7 } from 'json-schema';
import mergeAllOf from 'json-schema-merge-allof';
import { findMostExplicitDefinition } from './findMostExplicitDefinition';

export function omitSchemaXOf(schema: JSONSchema7): JSONSchema7 {
  schema = mergeAllOf(schema, { ignoreAdditionalProperties: true });

  return JSON.parse(JSON.stringify(schema), (_key, value) => {
    if (typeof value === 'object') {
      if (value.anyOf) {
        Object.assign(value, findMostExplicitDefinition(value.anyOf));

        delete value.anyOf;
      }

      if (value.oneOf) {
        Object.assign(value, findMostExplicitDefinition(value.oneOf));

        delete value.oneOf;
      }
    }

    return value;
  });
}
