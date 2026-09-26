import { safeHttpUrl } from '@theme/utils/url';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

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

// What you can use, how to build with it, the project itself, the legal pages.
export const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Styles', href: '/styles/' },
      { label: 'Animated avatars', href: '/animated-avatars/' },
      { label: 'Playground', href: '/playground/' },
      { label: 'DiceBear Studio', href: '/studio/' },
      { label: 'Editor', href: 'https://editor.dicebear.com', external: true },
      { label: 'Tools', href: '/tools/' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '/start/' },
      { label: 'HTTP API', href: '/integrations/http-api/' },
      { label: 'JavaScript', href: '/integrations/javascript/' },
      { label: 'Python', href: '/integrations/python/' },
      { label: 'PHP', href: '/integrations/php/' },
      { label: 'All integrations', href: '/start/pick-your-integration/' },
      { label: 'For AI assistants', href: '/start/for-ai-assistants/' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Why DiceBear?', href: '/why-dicebear/' },
      { label: 'Statistics', href: '/stats/' },
      { label: 'Supported versions', href: '/understand/supported-versions/' },
      { label: 'Support DiceBear', href: '/support/' },
      {
        label: 'GitHub',
        href: 'https://github.com/dicebear/dicebear',
        external: true,
      },
      {
        label: 'Figma Community',
        href: 'https://www.figma.com/@dicebear_com',
        external: true,
      },
    ],
  },
  { title: 'Legal', links: legalLinks },
];

// Older major versions keep their docs on a subdomain of their own. 10.x has
// no entry: it reads these docs too.
export const olderDocs: FooterLink = {
  label: 'Docs for 9.x',
  href: 'https://v9.dicebear.com',
  external: true,
};
