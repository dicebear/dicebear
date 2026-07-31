export type StyleCategory = 'Custom' | 'Minimalist' | 'Characters' | 'Scenes';

// Annotated rather than inferred so that object literals carrying this value
// keep the category type instead of widening to `string`.
export const CUSTOM_CATEGORY: StyleCategory = 'Custom';

export const categoryOrder: StyleCategory[] = [
  CUSTOM_CATEGORY,
  'Minimalist',
  'Characters',
  'Scenes',
];

/**
 * The category each packaged style is listed under, on the style overview and
 * in the playground picker. Every style needs an entry. A missing one fails the
 * build (see config/avatarStyles.ts) instead of falling back to a default, so a
 * scene or a pattern cannot end up filed with the avatars.
 */
const styleCategories: Record<string, StyleCategory> = {
  adventurer: 'Characters',
  'adventurer-neutral': 'Characters',
  avataaars: 'Characters',
  'avataaars-neutral': 'Characters',
  'big-ears': 'Characters',
  'big-ears-neutral': 'Characters',
  'big-smile': 'Characters',
  blobs: 'Minimalist',
  bottts: 'Characters',
  'bottts-neutral': 'Characters',
  constellation: 'Scenes',
  critters: 'Characters',
  croodles: 'Characters',
  'croodles-neutral': 'Characters',
  disco: 'Minimalist',
  dylan: 'Characters',
  'fun-emoji': 'Characters',
  glass: 'Minimalist',
  glyphs: 'Minimalist',
  icons: 'Minimalist',
  identicon: 'Minimalist',
  'initial-face': 'Minimalist',
  initials: 'Minimalist',
  landscape: 'Scenes',
  loops: 'Minimalist',
  lorelei: 'Characters',
  'lorelei-neutral': 'Characters',
  micah: 'Characters',
  miniavs: 'Characters',
  moods: 'Characters',
  notionists: 'Characters',
  'notionists-neutral': 'Characters',
  'open-peeps': 'Characters',
  personas: 'Characters',
  'pixel-art': 'Characters',
  'pixel-art-neutral': 'Characters',
  pixelbot: 'Characters',
  planets: 'Scenes',
  rings: 'Minimalist',
  'shape-grid': 'Minimalist',
  shapes: 'Minimalist',
  sprouts: 'Characters',
  squircles: 'Minimalist',
  stripes: 'Minimalist',
  thumbs: 'Minimalist',
  'toon-head': 'Characters',
  triangles: 'Minimalist',
  waves: 'Minimalist',
  weave: 'Minimalist',
};

export const previewSeeds = ['Felix', 'Aneka', 'Milo', 'Luna'];

export function getStyleCategory(name: string): StyleCategory {
  const category = styleCategories[name];

  if (!category) {
    throw new Error(
      `Avatar style "${name}" has no category. Add it to theme/config/styleCategories.ts.`,
    );
  }

  return category;
}

/**
 * The names that the map above does not cover. The build calls this once it
 * knows which definitions @dicebear/styles ships, so a new style cannot reach
 * the site uncategorized.
 */
export function findUncategorizedStyles(styleNames: string[]): string[] {
  return styleNames.filter((name) => !(name in styleCategories));
}

export function normalizeLicense(license: string): string {
  if (license.includes('CC BY 4.0')) {
    return 'CC BY 4.0';
  }

  if (license.includes('CC0 1.0')) {
    return 'CC0 1.0';
  }

  if (license.includes('MIT')) {
    return 'MIT';
  }

  return 'Other';
}
