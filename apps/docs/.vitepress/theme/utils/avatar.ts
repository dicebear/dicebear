import { Style } from '@dicebear/core';
import { kebabCase } from 'change-case';
import { escapeShellArg } from './escape';
import type { ComponentDependency } from '@theme/composables/useDependencyMap';

export function stripHash(hex: string): string {
  return hex.replace(/^#/, '');
}

export function clonePlain<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const definitionImports: Record<string, () => Promise<{ default: unknown }>> = {
  'adventurer': () => import('@dicebear/definitions/adventurer.json'),
  'adventurer-neutral': () => import('@dicebear/definitions/adventurer-neutral.json'),
  'avataaars': () => import('@dicebear/definitions/avataaars.json'),
  'avataaars-neutral': () => import('@dicebear/definitions/avataaars-neutral.json'),
  'big-ears': () => import('@dicebear/definitions/big-ears.json'),
  'big-ears-neutral': () => import('@dicebear/definitions/big-ears-neutral.json'),
  'big-smile': () => import('@dicebear/definitions/big-smile.json'),
  'bottts': () => import('@dicebear/definitions/bottts.json'),
  'bottts-neutral': () => import('@dicebear/definitions/bottts-neutral.json'),
  'croodles': () => import('@dicebear/definitions/croodles.json'),
  'croodles-neutral': () => import('@dicebear/definitions/croodles-neutral.json'),
  'dylan': () => import('@dicebear/definitions/dylan.json'),
  'fun-emoji': () => import('@dicebear/definitions/fun-emoji.json'),
  'glass': () => import('@dicebear/definitions/glass.json'),
  'icons': () => import('@dicebear/definitions/icons.json'),
  'identicon': () => import('@dicebear/definitions/identicon.json'),
  'initials': () => import('@dicebear/definitions/initials.json'),
  'lorelei': () => import('@dicebear/definitions/lorelei.json'),
  'lorelei-neutral': () => import('@dicebear/definitions/lorelei-neutral.json'),
  'micah': () => import('@dicebear/definitions/micah.json'),
  'miniavs': () => import('@dicebear/definitions/miniavs.json'),
  'notionists': () => import('@dicebear/definitions/notionists.json'),
  'notionists-neutral': () => import('@dicebear/definitions/notionists-neutral.json'),
  'open-peeps': () => import('@dicebear/definitions/open-peeps.json'),
  'personas': () => import('@dicebear/definitions/personas.json'),
  'pixel-art': () => import('@dicebear/definitions/pixel-art.json'),
  'pixel-art-neutral': () => import('@dicebear/definitions/pixel-art-neutral.json'),
  'rings': () => import('@dicebear/definitions/rings.json'),
  'shapes': () => import('@dicebear/definitions/shapes.json'),
  'thumbs': () => import('@dicebear/definitions/thumbs.json'),
  'toon-head': () => import('@dicebear/definitions/toon-head.json'),
};

const styleCache = new Map<string, Style>();
const definitionRawCache = new Map<string, object>();
const variableResultCache = new Map<string, Map<string, boolean>>();
const pendingCustomStyles = new Map<string, PromiseWithResolvers<Style>>();
let customStylesFlushed = false;

export const fallbackColors = ['ff8aab', 'ffbe47', '5bc971', '4da6ff', 'a67df5'] as const;

export function padColors(values: readonly string[], min = 4): string[] {
  if (values.length >= min) return [...values];

  const pool = fallbackColors.filter((c) => !values.includes(c));

  return [...values, ...pool.slice(0, min - values.length)];
}

export const webSafeFonts = [
  'system-ui',
  'Arial',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
] as const;

export const fontWeights = [
  { label: '100 — Thin', value: 100 },
  { label: '200 — Extra Light', value: 200 },
  { label: '300 — Light', value: 300 },
  { label: '400 — Normal', value: 400 },
  { label: '500 — Medium', value: 500 },
  { label: '600 — Semi Bold', value: 600 },
  { label: '700 — Bold', value: 700 },
  { label: '800 — Extra Bold', value: 800 },
  { label: '900 — Black', value: 900 },
] as const;

export function registerCustomStyle(key: string, definition: object): Style {
  const style = new Style(definition);

  styleCache.set(key, style);
  definitionRawCache.set(key, definition);
  variableResultCache.delete(key);

  const pending = pendingCustomStyles.get(key);

  if (pending) {
    pending.resolve(style);
    pendingCustomStyles.delete(key);
  }

  return style;
}

export function flushPendingCustomStyles(): void {
  for (const [key, { reject }] of pendingCustomStyles) {
    reject(new Error(`Custom style "${key}" not found in storage.`));
  }

  pendingCustomStyles.clear();
  customStylesFlushed = true;
}

export function unregisterCustomStyle(key: string): void {
  styleCache.delete(key);
  definitionRawCache.delete(key);
  variableResultCache.delete(key);
}

export async function loadAvatarStyle(avatarStyle: string): Promise<Style> {
  const cached = styleCache.get(avatarStyle);

  if (cached) {
    return cached;
  }

  const name = kebabCase(avatarStyle);
  const cachedByName = styleCache.get(name);

  if (cachedByName) {
    return cachedByName;
  }

  if (avatarStyle.startsWith('custom:')) {
    if (customStylesFlushed) {
      throw new Error(`Custom style "${avatarStyle}" not found.`);
    }

    const existing = pendingCustomStyles.get(avatarStyle);

    if (existing) {
      return existing.promise;
    }

    const deferred = Promise.withResolvers<Style>();

    pendingCustomStyles.set(avatarStyle, deferred);

    return deferred.promise;
  }

  const loader = definitionImports[name];

  if (!loader) {
    throw new Error(`Avatar style "${avatarStyle}" not found.`);
  }

  const def = await loader();
  const raw = def.default as object;

  definitionRawCache.set(name, raw);

  const style = new Style(raw);

  styleCache.set(name, style);

  return style;
}

function scanForVariable(obj: unknown, variableName: string): boolean {
  if (typeof obj !== 'object' || obj === null) return false;

  const record = obj as Record<string, unknown>;

  if (record.type === 'variable' && record.value === variableName) return true;

  for (const val of Object.values(record)) {
    if (scanForVariable(val, variableName)) return true;
  }

  return false;
}

export function styleUsesVariable(avatarStyle: string, variableName: string): boolean {
  const name = kebabCase(avatarStyle);
  const key = definitionRawCache.has(name) ? name : avatarStyle;
  const raw = definitionRawCache.get(key);

  if (!raw) return false;

  let perStyle = variableResultCache.get(key);

  if (!perStyle) {
    perStyle = new Map();
    variableResultCache.set(key, perStyle);
  }

  if (perStyle.has(variableName)) return perStyle.get(variableName)!;

  const result = scanForVariable(raw, variableName);

  perStyle.set(variableName, result);

  return result;
}

async function readAllBytes(readable: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  const reader = readable.getReader();

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const result = new Uint8Array(
    chunks.reduce((sum, c) => sum + c.length, 0),
  );

  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

export async function compressFragment(data: object): Promise<string> {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);

  const cs = new CompressionStream('deflate-raw');
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();

  const compressed = await readAllBytes(cs.readable);
  const base64 = btoa(String.fromCharCode(...compressed));

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function decompressFragment(encoded: string): Promise<object> {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();

  const decompressed = await readAllBytes(ds.readable);
  const json = new TextDecoder().decode(decompressed);

  return JSON.parse(json);
}

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
  if (Array.isArray(value)) return { kind: 'array', values: value };
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
          return classified.values.length === 0
            ? `${encodeURIComponent(k)}[]`
            : `${encodeURIComponent(k)}=${classified.values
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

  return `https://api.dicebear.com/10.x/${kebabCase(avatarStyle)}/${format}${
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
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
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

  return `dicebear ${shellQuote(avatarStyle)} .${
    args.length > 0 ? ` \\\n${args}` : ''
  }`.trim();
}

export function resolveColors(colorName: string, styleColors?: Record<string, string[]>): readonly string[] {
  const values = styleColors?.[colorName];

  if (values && values.length > 0) return values;

  return fallbackColors;
}

/**
 * Returns options that make the given component visible by walking
 * its parent dependency chain and disabling all unrelated components.
 */
export function getComponentVisibilityOptions(
  componentName: string,
  allComponentNames: string[],
  allDependencies: Record<string, ComponentDependency>,
): Record<string, unknown> {
  const opts: Record<string, unknown> = {
    [`${componentName}Probability`]: 100,
  };

  const keep = new Set<string>([componentName]);

  let current = componentName;

  while (allDependencies[current]) {
    const dep = allDependencies[current];

    keep.add(dep.parentName);
    opts[`${dep.parentName}Variant`] = dep.parentVariant;
    opts[`${dep.parentName}Probability`] = 100;

    for (const { colorKey, defaultCount } of dep.parentColors) {
      if (defaultCount > 1) {
        opts[colorKey] = ['555555'];
      }
    }

    current = dep.parentName;
  }

  for (const [child, dep] of Object.entries(allDependencies)) {
    if (keep.has(dep.parentName)) {
      keep.add(child);
    }
  }

  for (const name of allComponentNames) {
    if (keep.has(name)) continue;

    opts[`${name}Probability`] = 0;
  }

  return opts;
}

export function getComponentVariantPreviewOptions(
  componentName: string,
  variant: string,
  allComponentNames: string[],
  allDependencies: Record<string, ComponentDependency>,
): Record<string, unknown> {
  return {
    seed: 'JD',
    [`${componentName}Variant`]: variant,
    ...getComponentVisibilityOptions(componentName, allComponentNames, allDependencies),
  };
}

/**
 * Build preview options for general (non-component) style options.
 * Component-specific options (Variant, Color, Probability, etc.) are
 * handled by ComponentPreview instead.
 */
export function getAvatarPropertyPreviewOptions(
  propertyName: string,
  propertyValue: unknown,
): Record<string, unknown> {
  if (propertyName === 'seed') {
    return {
      [propertyName]: propertyValue,
    };
  }

  if (propertyName === 'backgroundType') {
    return {
      backgroundColor: ['6d28d9', 'c026d3'],
      [propertyName]: [propertyValue],
    };
  }

  if (propertyName === 'backgroundRotation') {
    return {
      backgroundColor: ['3f3f46', 'd4d4d8'],
      backgroundType: ['gradientLinear'],
      [propertyName]: [propertyValue],
    };
  }

  return {
    seed: 'JD',
    [propertyName]:
      typeof propertyValue === 'string' ? [propertyValue] : propertyValue,
  };
}
