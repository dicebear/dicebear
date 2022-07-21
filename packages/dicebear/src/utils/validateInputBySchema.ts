import Ajv from 'ajv';
import { StyleSchema } from '@dicebear/core';
import { ArgumentsCamelCase } from 'yargs';

export function validateInputBySchema(
  input: ArgumentsCamelCase<unknown>,
  schema: StyleSchema
) {
  const validator = new Ajv({
    strict: false,
    coerceTypes: true,
    useDefaults: false,
    removeAdditional: true,
  });

  const validate = validator.compile(schema);
  const data = JSON.parse(JSON.stringify(input));

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
