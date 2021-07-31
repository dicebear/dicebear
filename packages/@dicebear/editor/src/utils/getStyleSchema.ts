import type { Style } from '@dicebear/avatars';
import type { JSONSchema7 } from 'json-schema';

import { schema } from '@dicebear/avatars';
import { omitSchemaXOf } from './omitSchemaXOf';

const results = new Map();

export function getStyleSchema(style: Style<unknown>): JSONSchema7 {
  let key = JSON.stringify(style.schema);

  if (results.has(key)) {
    return results.get(key);
  }

  let result = omitSchemaXOf({
    allOf: [schema, style.schema],
  });

  results.set(key, result);

  return result;
}
