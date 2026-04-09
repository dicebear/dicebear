const minimalistStyles = new Set([
  'glass',
  'identicon',
  'rings',
  'shapes',
  'initials',
  'icons',
  'thumbs',
]);

export const categoryOrder = ['Custom', 'Minimalist', 'Characters', 'Other'];

export const previewSeeds = ['Felix', 'Aneka', 'Milo', 'Luna'];

export function getStyleCategory(name: string): string {
  return minimalistStyles.has(name) ? 'Minimalist' : 'Characters';
}

export function normalizeLicense(license: string): string {
  if (license.includes('CC BY 4.0')) return 'CC BY 4.0';
  if (license.includes('CC0 1.0')) return 'CC0 1.0';
  if (license.includes('MIT')) return 'MIT';

  return 'Other';
}
