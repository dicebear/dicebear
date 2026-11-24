import { Style, OptionsDescriptor } from '@dicebear/core';
import type { Options } from 'yargs';

/**
 * Splits the comma-separated entries of a list option (`b6e3f4,c0aede`) into
 * single values. yargs runs this before it checks `choices`, so
 * `--flip none,horizontal` is validated value by value.
 */
function splitList(values: unknown[]): unknown[] {
  return values.flatMap((entry) =>
    typeof entry === 'string' && entry.includes(',')
      ? entry
          .split(',')
          .map((part) => part.trim())
          .filter((part) => part !== '')
      : [entry],
  );
}

/**
 * Like {@link splitList}, and turns every entry into a number, so
 * `--fontWeight 400,700` arrives as `[400, 700]`. An entry that is no number
 * stays as it is and fails the options validation with its own message.
 */
function splitNumberList(values: unknown[]): unknown[] {
  return splitList(values).map((entry) => {
    const number = typeof entry === 'string' ? Number(entry) : entry;

    return typeof number === 'number' && !Number.isNaN(number) ? number : entry;
  });
}

/**
 * Builds the yargs options map for a style: one entry per field returned by
 * the style's {@link OptionsDescriptor}. List fields become array options,
 * which take repeated flags as well as comma-separated values.
 */
export function getStyleCommandOptions(style: Style): Record<string, Options> {
  const descriptor = new OptionsDescriptor(style).toJSON();
  const result: Record<string, Options> = {};

  for (const [key, field] of Object.entries(descriptor)) {
    const option: Options = {};

    switch (field.type) {
      case 'string':
        option.type = 'string';
        if (field.list) {
          option.array = true;
          option.coerce = splitList;
        }
        break;
      case 'number':
        option.type = 'number';
        if (field.list) {
          // Read as strings, a number parser would turn `400,700` into NaN
          // before the list could be split.
          option.type = 'string';
          option.array = true;
          option.coerce = splitNumberList;
        }
        break;
      case 'range':
        option.type = 'string';
        break;
      case 'boolean':
        option.type = 'boolean';
        break;
      case 'enum':
        option.type = 'string';
        if (field.list) {
          option.array = true;
          option.coerce = splitList;
        }
        if (!field.weighted && !field.open) {
          option.choices = field.values as string[];
        }

        break;
      case 'color':
        option.type = 'string';
        if (field.list) {
          option.array = true;
          option.coerce = splitList;
        }
        break;
    }

    result[key] = option;
  }

  return result;
}
