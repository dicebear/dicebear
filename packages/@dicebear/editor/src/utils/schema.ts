import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import mergeAllOf from 'json-schema-merge-allof';

export function omitXOf<T extends JSONSchema7>(schema: T): T {
  schema = mergeAllOf(schema, { ignoreAdditionalProperties: true });

  return JSON.parse(JSON.stringify(schema), (_key, value) => {
    if (typeof value === 'object') {
      if (value.anyOf) {
        Object.assign(value, keepMostExplicitDefinition(value.anyOf));

        delete value.anyOf;
      }

      if (value.oneOf) {
        Object.assign(value, keepMostExplicitDefinition(value.oneOf));

        delete value.oneOf;
      }
    }

    return value as T;
  });
}

export function keepMostExplicitDefinition(definitions: JSONSchema7Definition[]) {
  let mostExplizitDefinition = definitions[0];
  let mostExplizitScore = 0;

  for (let definition of definitions) {
    let score = 0;

    if (typeof definition === 'object') {
      if (definition.pattern) {
        score += 1;
      }

      if (definition.enum && definition.enum.length > 1) {
        score += 2;
      }

      if (definition.examples && Array.isArray(definition.examples) && definition.examples.length > 1) {
        score += 4;
      }
    }

    if (score > mostExplizitScore) {
      mostExplizitDefinition = definition;
    }
  }

  return mostExplizitDefinition;
}
