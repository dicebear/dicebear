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
 * Parses a range option into a number or a `[min, max]` tuple. It takes one
 * comma-separated value (`"10,50"`, `"-10,10"`), a single number (`"50"`), or
 * the two values of a repeated flag (`--rotate 10 --rotate 20`). A value that
 * fits none of these passes through unchanged, so the options validation
 * reports it.
 */
function parseRangeValue(value: unknown): unknown {
  const joined = Array.isArray(value) ? value.join(',') : value;

  if (typeof joined !== 'string' || joined.trim() === '') {
    return value;
  }

  const parts = joined.split(',').map((part) => Number(part.trim()));

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

    // List values arrive split already, see `getStyleCommandOptions`.
    let value: unknown = argv[key];

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
