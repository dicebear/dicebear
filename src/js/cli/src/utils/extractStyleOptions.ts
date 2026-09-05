import { Style, OptionsDescriptor } from '@dicebear/core';

/**
 * Parses `['variant01:2', 'variant03:1']` (yargs array form) into a
 * `{ variant01: 2, variant03: 1 }` weight map. Entries without a colon
 * default to weight `1`.
 */
function parseWeightedValue(value: string[]): Record<string, number> {
  const result: Record<string, number> = {};

  for (const pair of value) {
    const [key, weight] = pair.split(':');

    if (key) {
      result[key.trim()] = weight !== undefined ? Number(weight) : 1;
    }
  }

  return result;
}

/**
 * Parses a comma-separated string like `"10,50"` into a `[min, max]` tuple
 * for range options, or a single numeric string like `"50"` into a number.
 * Passes the value through unchanged when it matches neither form.
 */
function parseRangeValue(value: unknown): unknown {
  if (typeof value !== 'string' || value.trim() === '') {
    return value;
  }

  const parts = value.split(',').map((part) => Number(part.trim()));

  if (!parts.every((n) => !isNaN(n))) {
    return value;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  if (parts.length === 2) {
    return parts;
  }

  return value;
}

/**
 * Splits comma-separated list values (`b6e3f4,c0aede`) that yargs hands over
 * as single array entries. Arrays are not greedy on this CLI, so a list is
 * either repeated flags or one comma-joined value.
 */
function splitListValue(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }

  return value.flatMap((entry) =>
    typeof entry === 'string' && entry.includes(',')
      ? entry
          .split(',')
          .map((part) => part.trim())
          .filter((part) => part !== '')
      : [entry],
  );
}

/**
 * Extracts only the style-relevant options from the yargs argv object,
 * filtering out CLI-specific keys (`_`, `$0`, `output`, `count`, `format`,
 * etc.) and converting weighted/range/list values into the shapes the core
 * resolver expects.
 */
export function extractStyleOptions(
  argv: Record<string, unknown>,
  style: Style,
): Record<string, unknown> {
  const descriptor = new OptionsDescriptor(style).toJSON();
  const result: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(descriptor)) {
    if (!(key in argv) || argv[key] === undefined) {
      continue;
    }

    let value: unknown = splitListValue(argv[key]);

    if (field.type === 'enum' && field.weighted && Array.isArray(value)) {
      value = parseWeightedValue(value);
    }

    if (field.type === 'range') {
      value = parseRangeValue(value);
    }

    result[key] = value as Record<string, unknown>[string];
  }

  return result;
}
