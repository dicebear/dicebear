import type { JSONSchema7Definition } from 'json-schema';

export function findMostExplicitDefinition(definitions: JSONSchema7Definition[]) {
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
