import { safeHttpUrl } from '@theme/utils/url';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export const productLinks: FooterLink[] = [
  { label: 'Why DiceBear?', href: '/why-dicebear/' },
  { label: 'Playground', href: '/playground/' },
  { label: 'All Styles', href: '/styles/' },
  { label: 'Editor', href: 'https://editor.dicebear.com', external: true },
];

export const resourceLinks: FooterLink[] = [
  { label: 'Documentation', href: '/introduction/' },
  { label: 'JS Library', href: '/how-to-use/js-library/' },
  { label: 'HTTP API', href: '/how-to-use/http-api/' },
  { label: 'CLI', href: '/how-to-use/cli/' },
  { label: 'Statistics', href: '/stats/' },
];

function buildLegalLink(label: string, rawHref: string | undefined): FooterLink | null {
  if (!rawHref) {
    return null;
  }

  const isExternal = /^https?:\/\//.test(rawHref);

  if (isExternal && !safeHttpUrl(rawHref)) {
    return null;
  }

  return { label, href: rawHref, external: isExternal || undefined };
}

export const legalLinks: FooterLink[] = [
  { label: 'Licenses', href: '/licenses/' },
  buildLegalLink('Privacy Policy', import.meta.env.VITE_PRIVACY_POLICY_URL),
  buildLegalLink('Cookie Policy', import.meta.env.VITE_COOKIE_POLICY_URL),
  buildLegalLink('Site Notice', import.meta.env.VITE_SITE_NOTICE_URL),
].filter((link): link is FooterLink => link !== null);
