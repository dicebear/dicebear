import type { StyleSchema } from '@dicebear/avatars';
import type { JSONSchema7 } from 'json-schema';
import type { Field } from '../types';

export function convertToField(schema: StyleSchema, name: string): Field {
  const property = schema.properties[name];

  if (typeof property === 'object') {
    let arrayItems: JSONSchema7 = {};

    if (false === Array.isArray(property.items) && typeof property.items === 'object') {
      arrayItems = property.items as JSONSchema7;
    }

    let examples = property.examples ?? property.enum ?? arrayItems.enum?.map((v) => [v]);

    if (Array.isArray(examples)) {
      return {
        type: 'select',
        options: examples.map((example) => ({
          value: example,
          preview: () => '',
        })),
      };
    }

    switch (property.type) {
      case 'boolean':
        return {
          type: 'checkbox',
        };

      case 'integer':
      case 'number':
        return {
          type: 'number',
          min: property.minimum,
          max: property.maximum,
        };

      case 'string':
        return {
          type: 'text',
        };

      default:
        throw new Error(`Property type ${property.type} for ${name} not supported. Please provide examples.`);
    }
  }

  throw new Error(`Type of ${name} not supported`);
}

// => style.editor.renderExample(name, value, options)
