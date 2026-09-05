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
            .map((c) => encodeURIComponent(String(c)))
            .join(',')}`;
        case 'primitive':
          return `${encodeURIComponent(k)}=${encodeURIComponent(classified.value)}`;
        case 'object': {
          const pairs = classified.entries
            .map(
              ([vk, vv]) =>
                `${encodeURIComponent(vk)}:${encodeURIComponent(String(vv))}`,
            )
            .join(',');

          return `${encodeURIComponent(k)}=${pairs}`;
        }

        case 'string':
          return `${encodeURIComponent(k)}=${encodeURIComponent(classified.value)}`;
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

export function getAvatarApiCommand(
  avatarStyle: string,
  options: Record<string, unknown> = {},
): string {
  const args = Object.entries(options)
    .map(([k, v]) => {
      const classified = classifyOptionValue(v);
      switch (classified.kind) {
        case 'array':
          return `  --${k} ${classified.values
            .map(formatCliArg)
            .join(' ')}`.trimEnd();
        case 'primitive':
          return `  --${k} ${formatCliArg(classified.value)}`;
        case 'object': {
          const pairs = classified.entries
            .map(([vk, vv]) => shellQuote(`${vk}:${vv}`))
            .join(' ');

          return `  --${k} ${pairs}`;
        }

        case 'string':
          return `  --${k} ${formatCliArg(classified.value)}`;
      }
    })
    .join(' \\\n');

  return `dicebear create ${avatarStyle}${
    args.length > 0 ? ` \\\n${args}` : ''
  }`.trim();
}
