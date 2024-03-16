import { Schema, Definition, Style } from '../types';

export function createDefinition<T extends Definition>(styleDefinition: T): T {
  return styleDefinition;
}

export function createStyleFromDefinition<T extends Definition>(
  styleDefinition: T
): Style<T> {
  const factory: Style<T> = {
    meta: styleDefinition.meta,
    schema: createSchemaFromDefinition(styleDefinition) as T extends Schema
      ? T
      : Schema,
    create: () => {
      return {
        attributes: styleDefinition.attributes,
        body: styleDefinition.body,
      };
    },
  };

  return factory;
}

export function createSchemaFromDefinition(
  styleDefinition: Definition
): Schema {
  const schema: Schema = {
    type: 'object',
    properties: {},
  };

  for (const [name, component] of Object.entries(styleDefinition.components)) {
    schema.properties[name] = {
      type: 'array',
      items: {
        type: 'string',
        enum: Object.values(component.values).map((value) => value.content),
      },
      default: Object.values(component.values)
        .filter((value) => value.default)
        .map((value) => value.content),
    };

    if (component.probability !== undefined) {
      schema.properties[name + 'Probability'] = {
        type: 'integer',
        minimum: 0,
        maximum: 100,
        default: component.probability,
      };
    }

    if (component.rotation !== undefined) {
      schema.properties[name + 'Rotation'] = {
        type: 'integer',
        minimum: 0,
        maximum: 360,
        default: component.rotation,
      };
    }

    if (component.offset?.x !== undefined) {
      schema.properties[name + 'OffsetX'] = {
        type: 'integer',
        default: component.offset.x,
      };
    }

    if (component.offset?.y !== undefined) {
      schema.properties[name + 'OffsetY'] = {
        type: 'integer',
        default: component.offset.y,
      };
    }
  }

  for (const [name, color] of Object.entries(styleDefinition.colors ?? {})) {
    schema.properties[name] = {
      type: 'array',
      items: {
        type: 'string',
        enum: color.values,
      },
      default: color.values,
    };
  }

  return schema;
}
