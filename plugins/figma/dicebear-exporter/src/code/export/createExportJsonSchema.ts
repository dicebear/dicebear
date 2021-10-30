import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { filterDefaults } from '../utils/filterDefaults';
import sortObject from 'sort-object-keys';
import type { Export } from '../types';

export function createExportJsonSchema(exportData: Export): JSONSchema7 {
  const schemaProperties: Record<string, JSONSchema7Definition> = {};

  // Components
  for (const componentGroupName in exportData.components) {
    if (false === exportData.components.hasOwnProperty(componentGroupName)) {
      continue;
    }

    const componentGroup = exportData.components[componentGroupName];

    schemaProperties[componentGroupName] = {
      type: 'array',
      items: {
        type: 'string',
        enum: Object.keys(componentGroup.collection),
      },
      default: filterDefaults(componentGroup.settings.defaults),
    };

    if (typeof componentGroup.settings.probability === 'number') {
      schemaProperties[`${componentGroupName}Probability`] = {
        type: 'integer',
        minimum: 0,
        maximum: 100,
        default: componentGroup.settings.probability,
      };
    }
  }

  // Colors
  for (const colorGroupName in exportData.colors) {
    if (false === exportData.colors.hasOwnProperty(colorGroupName)) {
      continue;
    }

    const colorGroup = exportData.colors[colorGroupName];

    if (colorGroup.isUsedByComponents) {
      schemaProperties[`${colorGroupName}Color`] = {
        type: 'array',
        items: {
          anyOf: [
            {
              type: 'string',
              pattern: '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
            },
            {
              type: 'string',
              enum: Object.keys(colorGroup.collection),
            },
          ],
        },
        default: filterDefaults(colorGroup.settings.defaults),
      };
    }

    if (exportData.frame.settings.backgroundColorGroupName === colorGroupName) {
      schemaProperties[`backgroundColor`] = {
        type: 'array',
        items: {
          anyOf: [
            {
              type: 'string',
              pattern: '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
            },
            {
              type: 'string',
              pattern: '^[0-9a-zA-Z]+$',
            },
          ],
        },
        default: filterDefaults(colorGroup.settings.defaults),
      };
    }
  }

  // Schema JSON
  return {
    title: 'Options',
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: sortObject(schemaProperties),
    additionalProperties: false,
  };
}
