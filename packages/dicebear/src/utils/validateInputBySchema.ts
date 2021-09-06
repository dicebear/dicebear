import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';

export function validateInputBySchema(
  input: Record<string, string | number>,
  schema: JSONSchema7
) {
  const validator = new Ajv({
    strict: false,
    coerceTypes: true,
    useDefaults: false,
    removeAdditional: true,
  });

  const validate = validator.compile(schema);
  const data: Record<
    string,
    string | number | string[] | number[] | boolean | boolean[]
  > = {};

  for (var key in input) {
    if (false === input.hasOwnProperty(key)) {
      continue;
    }

    if (schema.properties && key in schema.properties) {
      const property = schema.properties[key];

      if (typeof property === 'object' && property.type === 'array') {
        data[key] = input[key].toString().split(',');

        continue;
      }
    }

    data[key] = input[key];
  }

  if (false === validate(data)) {
    if (validate.errors) {
      for (var error of validate.errors) {
        throw new Error(`${error.keyword} - ${error.message}`);
      }
    }

    throw new Error('Unknown error');
  }

  return data;
}
