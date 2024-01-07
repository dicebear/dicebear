import {
  red,
  orange,
  yellow,
  emerald,
  sky,
  violet,
  pink,
  gray,
} from 'tailwindcss/colors';
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import type { ConfigStyleOptions } from '@/types';

const defaultBackgroundColors = [
  ...[red[100], red[200], red[300], red[400], red[500]],
  ...[orange[100], orange[200], orange[300], orange[400], orange[500]],
  ...[yellow[100], yellow[200], yellow[300], yellow[400], yellow[500]],
  ...[emerald[100], emerald[200], emerald[300], emerald[400], emerald[500]],
  ...[sky[100], sky[200], sky[300], sky[400], sky[500]],
  ...[violet[100], violet[200], violet[300], violet[400], violet[500]],
  ...[pink[100], pink[200], pink[300], pink[400], pink[500]],
  ...[gray[100], gray[200], gray[300], gray[400], gray[500]],
].map((color) => color.replace('#', ''));

export default function getSchemaOptions(
  schema: JSONSchema7
): ConfigStyleOptions {
  const result: ConfigStyleOptions = {};
  const properties: Record<string, JSONSchema7Definition> = {
    backgroundColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
    },
    ...schema.properties,
  };

  for (const key in properties) {
    if (false === properties.hasOwnProperty(key)) {
      continue;
    }

    if (key === 'style') {
      continue;
    }

    const property = properties[key];

    if (typeof property === 'boolean') {
      continue;
    }

    const isColor = !!key.match(/Color$/);
    const isArray = property.type === 'array';
    const isBackgroundColor = key === 'backgroundColor';
    const probability = properties[`${key}Probability`];
    const hasProbability = typeof probability === 'object';

    const values = new Set<string>();

    if (hasProbability) {
      values.add('');
    }

    if (property.enum) {
      for (const value of property.enum) {
        if (typeof value === 'string') {
          values.add(value);
        }
      }
    }

    if (property.default && Array.isArray(property.default)) {
      for (const value of property.default) {
        if (typeof value === 'string') {
          values.add(value);
        }
      }
    }

    if (
      typeof property.items === 'object' &&
      !Array.isArray(property.items) &&
      property.items.enum
    ) {
      for (const value of property.items.enum) {
        if (typeof value === 'string') {
          values.add(value);
        }
      }
    }

    if (values.size <= 1) {
      if (!isBackgroundColor) {
        continue;
      }

      for (const fallbackBackgroundColor of defaultBackgroundColors) {
        values.add(fallbackBackgroundColor);
      }
    }

    if (isBackgroundColor && values.has('transparent')) {
      values.delete('transparent');
      values.add('ffffff');
    }

    result[key] = {
      values: Array.from(values.values()),
      isColor,
      isArray,
      hasProbability,
      probability: hasProbability ? (probability.default as number) : 100,
    };
  }

  return result;
}
