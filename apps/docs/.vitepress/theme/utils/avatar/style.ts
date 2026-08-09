import { Style, type StyleDefinition } from '@dicebear/core';
import { kebabCase } from 'change-case';

export function clonePlain<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const definitionImports: Record<string, () => Promise<{ default: unknown }>> = {
  adventurer: () => import('@dicebear/styles/adventurer.json'),
  'adventurer-neutral': () =>
    import('@dicebear/styles/adventurer-neutral.json'),
  avataaars: () => import('@dicebear/styles/avataaars.json'),
  'avataaars-neutral': () => import('@dicebear/styles/avataaars-neutral.json'),
  'big-ears': () => import('@dicebear/styles/big-ears.json'),
  'big-ears-neutral': () => import('@dicebear/styles/big-ears-neutral.json'),
  'big-smile': () => import('@dicebear/styles/big-smile.json'),
  blobs: () => import('@dicebear/styles/blobs.json'),
  bottts: () => import('@dicebear/styles/bottts.json'),
  'bottts-neutral': () => import('@dicebear/styles/bottts-neutral.json'),
  clay: () => import('@dicebear/styles/clay.json'),
  constellation: () => import('@dicebear/styles/constellation.json'),
  critters: () => import('@dicebear/styles/critters.json'),
  croodles: () => import('@dicebear/styles/croodles.json'),
  'croodles-neutral': () => import('@dicebear/styles/croodles-neutral.json'),
  disco: () => import('@dicebear/styles/disco.json'),
  dylan: () => import('@dicebear/styles/dylan.json'),
  'fun-emoji': () => import('@dicebear/styles/fun-emoji.json'),
  glass: () => import('@dicebear/styles/glass.json'),
  glyphs: () => import('@dicebear/styles/glyphs.json'),
  icons: () => import('@dicebear/styles/icons.json'),
  identicon: () => import('@dicebear/styles/identicon.json'),
  'initial-face': () => import('@dicebear/styles/initial-face.json'),
  initials: () => import('@dicebear/styles/initials.json'),
  landscape: () => import('@dicebear/styles/landscape.json'),
  loops: () => import('@dicebear/styles/loops.json'),
  lorelei: () => import('@dicebear/styles/lorelei.json'),
  'lorelei-neutral': () => import('@dicebear/styles/lorelei-neutral.json'),
  micah: () => import('@dicebear/styles/micah.json'),
  miniavs: () => import('@dicebear/styles/miniavs.json'),
  moods: () => import('@dicebear/styles/moods.json'),
  notionists: () => import('@dicebear/styles/notionists.json'),
  'notionists-neutral': () =>
    import('@dicebear/styles/notionists-neutral.json'),
  'open-peeps': () => import('@dicebear/styles/open-peeps.json'),
  personas: () => import('@dicebear/styles/personas.json'),
  'pixel-art': () => import('@dicebear/styles/pixel-art.json'),
  'pixel-art-neutral': () => import('@dicebear/styles/pixel-art-neutral.json'),
  pixelbot: () => import('@dicebear/styles/pixelbot.json'),
  planets: () => import('@dicebear/styles/planets.json'),
  rings: () => import('@dicebear/styles/rings.json'),
  'shape-grid': () => import('@dicebear/styles/shape-grid.json'),
  shapes: () => import('@dicebear/styles/shapes.json'),
  sprouts: () => import('@dicebear/styles/sprouts.json'),
  squircles: () => import('@dicebear/styles/squircles.json'),
  stripes: () => import('@dicebear/styles/stripes.json'),
  thumbs: () => import('@dicebear/styles/thumbs.json'),
  'toon-head': () => import('@dicebear/styles/toon-head.json'),
  triangles: () => import('@dicebear/styles/triangles.json'),
  'voxel-art': () => import('@dicebear/styles/voxel-art.json'),
  'voxel-bot': () => import('@dicebear/styles/voxel-bot.json'),
  waves: () => import('@dicebear/styles/waves.json'),
  weave: () => import('@dicebear/styles/weave.json'),
};

const styleCache = new Map<string, Style>();
const definitionRawCache = new Map<string, object>();
const variableResultCache = new Map<string, Map<string, boolean>>();
const pendingCustomStyles = new Map<string, PromiseWithResolvers<Style>>();
let customStylesFlushed = false;

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

/**
 * Returns the cached raw definition for a previously-loaded style, or
 * loads and caches it on demand. Used where the runtime needs the
 * `StyleDefinition` shape directly — e.g. to compute combination counts
 * over a narrowed copy.
 */
export async function loadAvatarStyleDefinition(
  avatarStyle: string,
): Promise<StyleDefinition> {
  await loadAvatarStyle(avatarStyle);

  const name = kebabCase(avatarStyle);
  const key = definitionRawCache.has(name) ? name : avatarStyle;
  const raw = definitionRawCache.get(key);

  if (!raw) {
    throw new Error(`Definition for "${avatarStyle}" not available.`);
  }

  return raw as StyleDefinition;
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
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const record = obj as Record<string, unknown>;

  if (record.type === 'variable' && record.value === variableName) {
    return true;
  }

  for (const val of Object.values(record)) {
    if (scanForVariable(val, variableName)) {
      return true;
    }
  }

  return false;
}

export function styleUsesVariable(
  avatarStyle: string,
  variableName: string,
): boolean {
  const name = kebabCase(avatarStyle);
  const key = definitionRawCache.has(name) ? name : avatarStyle;
  const raw = definitionRawCache.get(key);

  if (!raw) {
    return false;
  }

  let perStyle = variableResultCache.get(key);

  if (!perStyle) {
    perStyle = new Map();
    variableResultCache.set(key, perStyle);
  }

  if (perStyle.has(variableName)) {
    return perStyle.get(variableName)!;
  }

  const result = scanForVariable(raw, variableName);

  perStyle.set(variableName, result);

  return result;
}
