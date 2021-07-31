import type { Style } from '@dicebear/avatars';
import type { JSONSchema7 } from 'json-schema';
import type { Field, Mode } from '../types';

import { getStyleSchema } from './getStyleSchema';
import { getSchemaProperties } from './getSchemaProperties';

export function createFields(style: Style<unknown>, mode: Mode): Map<string, Field> {
  const schema = getStyleSchema(style);
  const properties = getSchemaProperties(schema, mode);

  const result = new Map<string, Field>();

  for (const [key, property] of properties) {
    let arrayItems: JSONSchema7 = {};

    if (false === Array.isArray(property.items) && typeof property.items === 'object') {
      arrayItems = property.items as JSONSchema7;
    }

    let examples = property.examples ?? property.enum ?? arrayItems.enum?.map((v) => [v]);

    if (Array.isArray(examples)) {
      result.set(key, {
        name: key,
        title: property.title,
        type: 'select',
        options: examples.map((example) => ({
          value: example,
          preview: () => '',
        })),
      });

      continue;
    }

    switch (property.type) {
      case 'boolean':
        result.set(key, {
          name: key,
          title: property.title,
          type: 'checkbox',
        });

        break;

      case 'integer':
      case 'number':
        result.set(key, {
          name: key,
          title: property.title,
          type: undefined !== property.minimum && undefined !== property.maximum ? 'range' : 'number',
          min: property.minimum,
          max: property.maximum,
        });

        break;

      case 'string':
        result.set(key, {
          name: key,
          title: property.title,
          type: 'text',
          pattern: property.pattern,
        });

        break;

      default:
        throw new Error(`Property type ${property.type} for ${key} not supported. Please provide examples.`);
    }
  }

  return result;
}
