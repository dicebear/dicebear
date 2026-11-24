/**
 * The artists behind the styles DiceBear did not draw itself, read from the
 * style definitions. The artists page lists them, the footer credits their
 * works.
 */
import { kebabCase } from 'change-case';
import type { AvatarStyleMeta, AvatarStyles } from '@theme/types';
import { ARTIST_PROFILES } from '@theme/config/artistProfiles';
import {
  normalizeLicense,
  type LicenseBucket,
} from '@theme/config/styleCategories';
import { attributionKind, attributionPrefix } from './license';
import { formatLicenseName } from './format';
import { styleDisplayName } from './styleMeta';
import { safeHttpUrl } from './url';

export type ArtistLinkKind =
  | 'web'
  | 'instagram'
  | 'x'
  | 'threads'
  | 'dribbble'
  | 'figma'
  | 'youtube'
  | 'github'
  | 'substack'
  | 'linkedin';

export interface ArtistLink {
  kind: ArtistLinkKind;
  label: string;
  href: string;
}

export interface ArtistStyle {
  /** The key in `theme.avatarStyles`. */
  name: string;
  slug: string;
  title: string;
  /** "Remix of “…”" when the source work has a name of its own. */
  work?: string;
  license: string;
  bucket: LicenseBucket;
}

export interface Artist {
  name: string;
  links: ArtistLink[];
  styles: ArtistStyle[];
}

/** The anchor of an artist's entry on the artists page. */
export function artistId(name: string): string {
  return `artist-${kebabCase(name)}`;
}

/** The link to an artist's entry on the artists page. */
export function artistHref(name: string): string {
  return `/artists/#${artistId(name)}`;
}

/** Whether a style comes from an artist outside DiceBear. */
export function isGuestStyle(meta: AvatarStyleMeta): boolean {
  return attributionKind(meta) !== 'own-work' && meta.creator !== undefined;
}

const HOSTS: [RegExp, ArtistLinkKind, string][] = [
  [/(^|\.)instagram\.com$/, 'instagram', 'Instagram'],
  [/(^|\.)(x|twitter)\.com$/, 'x', 'X'],
  [/(^|\.)threads\.(net|com)$/, 'threads', 'Threads'],
  [/(^|\.)dribbble\.com$/, 'dribbble', 'Dribbble'],
  [/(^|\.)figma\.com$/, 'figma', 'Figma'],
  [/(^|\.)youtube\.com$/, 'youtube', 'YouTube'],
  [/(^|\.)github\.com$/, 'github', 'GitHub'],
  [/(^|\.)substack\.com$/, 'substack', 'Substack'],
  [/(^|\.)linkedin\.com$/, 'linkedin', 'LinkedIn'],
];

/** The artist's own site first, then the profiles in the order above. */
const LINK_ORDER: ArtistLinkKind[] = ['web', ...HOSTS.map(([, kind]) => kind)];

function artistLink(url?: string): ArtistLink | undefined {
  const href = safeHttpUrl(url);

  if (!href) {
    return undefined;
  }

  const host = new URL(href).hostname.replace(/^www\./, '');
  const known = HOSTS.find(([pattern]) => pattern.test(host));

  return known
    ? { kind: known[1], label: known[2], href }
    : { kind: 'web', label: 'Website', href };
}

/** The creator URL and the known profiles, one link per kind. */
function artistLinks(name: string, homepage?: string): ArtistLink[] {
  const byKind = new Map<ArtistLinkKind, ArtistLink>();

  for (const url of [homepage, ...(ARTIST_PROFILES[name] ?? [])]) {
    const link = artistLink(url);

    if (link && !byKind.has(link.kind)) {
      byKind.set(link.kind, link);
    }
  }

  return LINK_ORDER.flatMap((kind) => byKind.get(kind) ?? []);
}

/** Every guest artist with their styles, both in alphabetical order. */
export function guestArtists(styles: AvatarStyles): Artist[] {
  const byName = new Map<string, Artist>();

  for (const [name, style] of Object.entries(styles)) {
    const meta = style.meta;

    if (!isGuestStyle(meta) || !meta.creator) {
      continue;
    }

    const title = styleDisplayName(name);
    const license = formatLicenseName(meta.license?.name);
    const artist = byName.get(meta.creator) ?? {
      name: meta.creator,
      links: artistLinks(meta.creator, meta.homepage),
      styles: [],
    };

    artist.styles.push({
      name,
      slug: kebabCase(name),
      title,
      work:
        meta.title && meta.title !== title
          ? `${attributionPrefix(attributionKind(meta))} “${meta.title}”`
          : undefined,
      license,
      bucket: normalizeLicense(license),
    });
    byName.set(meta.creator, artist);
  }

  const order = (a: string, b: string) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' });

  return [...byName.values()]
    .map((artist) => ({
      ...artist,
      styles: artist.styles.sort((a, b) => order(a.title, b.title)),
    }))
    .sort((a, b) => order(a.name, b.name));
}
