/**
 * The canonical public origin, in one place for everything that has to agree
 * with it.
 *
 * It feeds the sitemap hostname, the JSON-LD `url` fields, every page's
 * canonical link and the Open Graph image URLs. Those have to agree: a
 * canonical that disagrees with the sitemap is a silent SEO defect, and
 * nothing in the build fails when they drift apart.
 */
export const SITE_ORIGIN = 'https://www.dicebear.com';

/** Absolute URL for a site-root-relative path (`/styles/` -> `https://…/styles/`). */
export function siteUrl(pathname: string): string {
  return new URL(pathname, SITE_ORIGIN).href;
}
