/**
 * The titles, repositories and links of the support page. Its prose stays in
 * the Markdown and reaches the page through slots of the same names; the
 * page and its Markdown mirror both read the rest from here.
 */
export interface SupportLink {
  text: string;
  href: string;
}

export interface SupportSection {
  /** The slot of the Markdown page that holds the prose. */
  slot: 'star' | 'code' | 'styles' | 'answer' | 'sponsor';
  title: string;
  links: SupportLink[];
}

export const supportRepos = [
  {
    name: 'dicebear/dicebear',
    text: 'The core libraries for seven languages, the CLI, this documentation site, and the editor.',
  },
  { name: 'dicebear/styles', text: 'The avatar style definitions.' },
  { name: 'dicebear/api', text: 'The self-hostable HTTP API.' },
] as const;

export const supportSections: Record<SupportSection['slot'], SupportSection> = {
  star: { slot: 'star', title: 'A star costs nothing', links: [] },
  code: {
    slot: 'code',
    title: 'Code',
    links: [
      { text: 'Contribute to the library', href: '/contribute/library/' },
    ],
  },
  styles: {
    slot: 'styles',
    title: 'Avatar styles',
    links: [
      { text: 'With Figma', href: '/create-styles/with-figma/' },
      { text: 'From scratch', href: '/create-styles/from-scratch/' },
    ],
  },
  answer: {
    slot: 'answer',
    title: 'Answer a question',
    links: [
      {
        text: 'GitHub Discussions',
        href: 'https://github.com/dicebear/dicebear/discussions',
      },
    ],
  },
  sponsor: {
    slot: 'sponsor',
    title: 'Sponsored by bunny.net',
    links: [{ text: 'Visit bunny.net', href: 'https://bunny.net/' }],
  },
};
