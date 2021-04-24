import type { StyleSchema } from '@dicebear/avatars';
import Ajv from 'ajv';

export function validateInputBySchema(input: Record<string, string | number>, schema: StyleSchema) {
  const validator = new Ajv({
    strict: false,
    coerceTypes: true,
    useDefaults: false,
    removeAdditional: false,
  });

  const validate = validator.compile(schema);
  const data: Record<string, string | number | string[] | number[] | boolean | boolean[]> = {};

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
      for (var errorKey in validate.errors) {
        if (validate.errors.hasOwnProperty(errorKey)) {
          new Error(`${errorKey} - ${validate.errors[errorKey]}`);
        }
      }
    }

    throw new Error('Unknown error');
  }

  return data;
}
