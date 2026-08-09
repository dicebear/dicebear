import { safeHttpUrl } from '@theme/utils/url';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export const productLinks: FooterLink[] = [
  { label: 'Why DiceBear?', href: '/why-dicebear/' },
  { label: 'Animated Avatars', href: '/animated-avatars/' },
  { label: 'All Styles', href: '/styles/' },
];

// Mirrors the tool list on /tools/ (see theme/components/tools/ToolList.vue).
export const toolLinks: FooterLink[] = [
  { label: 'Playground', href: '/playground/' },
  { label: 'WCAG Contrast Picker', href: '/tools/contrast/' },
  { label: 'Bundle Size Estimator', href: '/tools/bundle-size/' },
  { label: 'Editor', href: 'https://editor.dicebear.com', external: true },
  {
    label: 'Figma Plugin',
    href: 'https://www.figma.com/community/plugin/1005765655729342787',
    external: true,
  },
];

export const resourceLinks: FooterLink[] = [
  { label: 'Documentation', href: '/introduction/' },
  { label: 'JS Library', href: '/how-to-use/js-library/' },
  { label: 'HTTP API', href: '/how-to-use/http-api/' },
  { label: 'CLI', href: '/how-to-use/cli/' },
  { label: 'Statistics', href: '/stats/' },
  { label: 'Support DiceBear', href: '/support/' },
];

// Older major versions keep their docs on a subdomain of their own. This list
// replaces the version dropdown that used to sit in the top nav.
export const versionLinks: FooterLink[] = [
  { label: '10.x (current)', href: '/' },
  { label: '9.x', href: 'https://v9.dicebear.com', external: true },
];

function buildLegalLink(
  label: string,
  rawHref: string | undefined,
): FooterLink | null {
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
  buildLegalLink('Legal Notice', import.meta.env.VITE_LEGAL_NOTICE_URL),
].filter((link): link is FooterLink => link !== null);
