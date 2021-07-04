import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';

export function omitXOf<T extends JSONSchema7Definition>(definition: T, manipulateInput = false): T {
  if (typeof definition === 'boolean') {
    return definition;
  }

  let schema: JSONSchema7 = manipulateInput ? definition : JSON.parse(JSON.stringify(definition));

  if (schema.allOf) {
    for (let row of schema.allOf) {
      Object.assign(schema, omitXOf(row));
    }

    delete schema.allOf;
  }

  if (schema.anyOf) {
    Object.assign(schema, keepMostExplicitDefinition(schema.anyOf.map((v) => omitXOf(v, false))));

    delete schema.oneOf;
  }

  if (schema.oneOf) {
    Object.assign(schema, keepMostExplicitDefinition(schema.oneOf.map((v) => omitXOf(v, false))));

    delete schema.oneOf;
  }

  return schema as T;
}

export function keepMostExplicitDefinition(definitions: JSONSchema7Definition[]) {
  let mostExplizitDefinition = definitions[0];
  let mostExplizitScore = 0;

  for (let definition of definitions) {
    let score = 0;

    if (typeof definition === 'object') {
      if (definition.enum) {
        score += 5;
      }

      if (definition.examples) {
        score += 10;
      }
    }

    if (score > mostExplizitScore) {
      mostExplizitDefinition = definition;
    }
  }

  return mostExplizitDefinition;
}
