/**
 * Returns the URL only if it parses and uses an http(s) protocol; otherwise
 * undefined. Use this for any href that ultimately renders user-provided or
 * style-metadata URLs so that javascript:, data:, file: and other dangerous
 * schemes are dropped before they reach the DOM.
 */
export function safeHttpUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:' ? url : undefined;
  } catch {
    return undefined;
  }
}
