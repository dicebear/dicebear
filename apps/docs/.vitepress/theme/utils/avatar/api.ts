import { kebabCase } from 'change-case';
import { escapeShellArg } from '../escape';

export const unsupportedHttpApiOptions = new Set([
  'idRandomization',
  'fontFamily',
  'fontWeight',
  'title',
]);

type ApiOptionValue =
  | { kind: 'array'; values: unknown[] }
  | { kind: 'primitive'; value: string | number | boolean }
  | { kind: 'object'; entries: [string, unknown][] }
  | { kind: 'string'; value: string };

function classifyOptionValue(value: unknown): ApiOptionValue {
  if (Array.isArray(value)) {
    return { kind: 'array', values: value };
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return { kind: 'primitive', value };
  }

  if (typeof value === 'object' && value !== null) {
    return { kind: 'object', entries: Object.entries(value) };
  }

  return { kind: 'string', value: String(value) };
}

// A colon is allowed as is in a query string, and tags such as
// `eyewear:glasses` read better without `%3A`. Everything else is encoded as
// encodeURIComponent does.
function encodeQueryValue(value: string | number | boolean): string {
  return encodeURIComponent(value).replace(/%3A/gi, ':');
}

export function getAvatarApiUrl(
  avatarStyle: string,
  options: Record<string, unknown> = {},
  format: string = 'svg',
): string {
  const qs = Object.entries(options)
    .filter(([k, v]) => v !== undefined && !unsupportedHttpApiOptions.has(k))
    .map(([k, v]) => {
      const classified = classifyOptionValue(v);
      switch (classified.kind) {
        case 'array':
          return `${encodeURIComponent(k)}=${classified.values
            .map((c) => encodeQueryValue(String(c)))
            .join(',')}`;
        case 'primitive':
          return `${encodeURIComponent(k)}=${encodeQueryValue(classified.value)}`;
        case 'object': {
          const pairs = classified.entries
            .map(
              ([vk, vv]) =>
                `${encodeURIComponent(vk)}:${encodeQueryValue(String(vv))}`,
            )
            .join(',');

          return `${encodeURIComponent(k)}=${pairs}`;
        }

        case 'string':
          return `${encodeURIComponent(k)}=${encodeQueryValue(classified.value)}`;
      }
    })
    .join('&');

  return `https://api.dicebear.com/11.x/${kebabCase(avatarStyle)}/${format}${
    qs ? `?${qs}` : ''
  }`;
}

function shellQuote(value: string): string {
  return `'${escapeShellArg(value)}'`;
}

// Numbers and booleans contain no shell-special characters, so they
// stay unquoted both as single values and inside arrays. Strings get
// quoted defensively in case they contain spaces, semicolons, etc.
function formatCliArg(value: unknown): string {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return shellQuote(String(value));
}

/**
 * One `--key value` pair of the CLI command. A value that starts with a dash
 * is joined with `=`: the CLI's parser would read `--seed -x` as two flags,
 * whatever the shell quoting, and only `--seed=-x` keeps it a value.
 */
function cliFlag(key: string, raw: string, formatted: string): string {
  return raw.startsWith('-')
    ? `  --${key}=${formatted}`
    : `  --${key} ${formatted}`;
}

export function getAvatarApiCommand(
  avatarStyle: string,
  options: Record<string, unknown> = {},
): string {
  const args = Object.entries(options)
    .map(([k, v]) => {
      const classified = classifyOptionValue(v);
      switch (classified.kind) {
        case 'array': {
          // Arrays are not greedy on the CLI: a list is one comma-joined value.
          const joined = classified.values.join(',');

          return classified.values.length > 0
            ? cliFlag(k, joined, shellQuote(joined))
            : `  --${k}`;
        }

        case 'primitive':
          return cliFlag(
            k,
            String(classified.value),
            formatCliArg(classified.value),
          );
        case 'object': {
          const pairs = classified.entries
            .map(([vk, vv]) => `${vk}:${vv}`)
            .join(',');

          return cliFlag(k, pairs, shellQuote(pairs));
        }

        case 'string':
          return cliFlag(k, classified.value, formatCliArg(classified.value));
      }
    })
    .join(' \\\n');

  return `dicebear create ${avatarStyle}${
    args.length > 0 ? ` \\\n${args}` : ''
  }`.trim();
}
