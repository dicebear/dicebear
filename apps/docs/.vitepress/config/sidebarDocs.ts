import type { DefaultTheme } from 'vitepress';

// NOTE: VitePress renders sidebar item `text` with `v-html`, so inline markup is
// allowed, and we use it to attach small status badges (styled via
// `.vp-sidebar-badge` in theme/styles/main.scss). A "New" badge marks what a
// 10.x minor added. Anything that shipped with 10.0.0 is as old as v10 itself
// and carries none, which is why the PHP library has no badge while the ports
// that followed it do.
//
// Top-level groups always stay expanded (no `collapsed` key, so VitePress
// renders them without a toggle). Nested levels such as the framework guides
// start closed (`collapsed: true`) to keep the tree scannable; VitePress
// expands a collapsed level automatically when it contains the active page,
// so nobody has to dig for where they are.
const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Start',
    items: [
      { text: 'Your first avatar', link: '/start/' },
      { text: 'What is DiceBear?', link: '/start/what-is-dicebear/' },
      {
        text: 'Pick your integration',
        link: '/start/pick-your-integration/',
      },
      {
        text: 'For AI assistants <span class="vp-sidebar-badge is-new">New</span>',
        link: '/start/for-ai-assistants/',
      },
    ],
  },
  {
    text: 'Integrations',
    items: [
      { text: 'HTTP API', link: '/integrations/http-api/' },
      {
        text: 'JavaScript',
        link: '/integrations/javascript/',
        collapsed: true,
        items: [
          {
            text: 'Converter',
            link: '/integrations/javascript/converter/',
          },
          { text: 'React', link: '/integrations/javascript/react/' },
          {
            text: 'React Native',
            link: '/integrations/javascript/react-native/',
          },
          { text: 'Vue', link: '/integrations/javascript/vue/' },
          { text: 'Svelte', link: '/integrations/javascript/svelte/' },
          { text: 'Angular', link: '/integrations/javascript/angular/' },
          { text: 'Next.js', link: '/integrations/javascript/next-js/' },
          { text: 'Nuxt', link: '/integrations/javascript/nuxt/' },
        ],
      },
      { text: 'PHP', link: '/integrations/php/' },
      {
        text: 'Python <span class="vp-sidebar-badge is-new">New</span>',
        link: '/integrations/python/',
      },
      {
        text: 'Rust <span class="vp-sidebar-badge is-new">New</span>',
        link: '/integrations/rust/',
      },
      {
        text: 'Go <span class="vp-sidebar-badge is-new">New</span>',
        link: '/integrations/go/',
      },
      {
        text: 'Dart <span class="vp-sidebar-badge is-new">New</span>',
        link: '/integrations/dart/',
        collapsed: true,
        items: [{ text: 'Flutter', link: '/integrations/dart/flutter/' }],
      },
      {
        text: 'C# <span class="vp-sidebar-badge is-new">New</span>',
        link: '/integrations/csharp/',
        collapsed: true,
        items: [
          {
            text: 'Unity <span class="vp-sidebar-badge is-new">New</span>',
            link: '/integrations/csharp/unity/',
          },
          {
            text: 'Godot <span class="vp-sidebar-badge is-new">New</span>',
            link: '/integrations/csharp/godot/',
          },
        ],
      },
      { text: 'CLI', link: '/integrations/cli/' },
      {
        text: 'Figma <span class="vp-sidebar-badge is-new">New</span>',
        link: '/integrations/figma/',
      },
    ],
  },
  {
    text: 'Customize',
    items: [
      { text: 'Options', link: '/customize/options/' },
      { text: 'Style options', link: '/customize/style-options/' },
      {
        text: 'Tags <span class="vp-sidebar-badge is-new">New</span>',
        link: '/customize/tags/',
        collapsed: true,
        items: [{ text: 'Tag reference', link: '/customize/tags/reference/' }],
      },
      { text: 'Gender', link: '/customize/gender/' },
    ],
  },
  {
    text: 'Recipes',
    items: [
      { text: 'Avatar placeholder', link: '/recipes/avatar-placeholder/' },
      {
        text: 'Gravatar default image',
        link: '/recipes/gravatar-default-image/',
      },
      {
        text: 'Self-host the HTTP API',
        link: '/recipes/self-host-the-http-api/',
      },
      { text: 'Load all styles', link: '/recipes/load-all-styles/' },
    ],
  },
  {
    text: 'Understand',
    items: [
      {
        text: 'How avatars are made',
        link: '/understand/how-avatars-are-made/',
      },
      {
        text: 'How many unique avatars?',
        link: '/understand/how-many-unique-avatars/',
      },
      {
        text: 'DiceBear vs. alternatives',
        link: '/understand/dicebear-vs-alternatives/',
      },
    ],
  },
  {
    text: 'Create styles',
    items: [
      { text: 'Create with Figma', link: '/create-styles/with-figma/' },
      {
        text: 'Edit a style <span class="vp-sidebar-badge is-new">New</span>',
        link: '/create-styles/edit-a-style/',
      },
      { text: 'From scratch', link: '/create-styles/from-scratch/' },
      {
        text: 'Definition schema',
        link: '/create-styles/definition-schema/',
      },
      {
        text: 'Implement DiceBear Core',
        link: '/create-styles/implement-dicebear-core/',
      },
    ],
  },
  {
    text: 'Contribute',
    items: [
      { text: 'Library', link: '/contribute/library/' },
      { text: 'HTTP API', link: '/contribute/http-api/' },
      { text: 'Documentation', link: '/contribute/documentation/' },
      { text: 'Editor', link: '/contribute/editor/' },
    ],
  },
];

/**
 * Every top-level group with its first route segment, e.g. `start`, and its
 * title without badge markup. The nav item and the sidebar map in config.ts
 * and the sections of llms.txt are built from this list, so a new group here
 * is enough to wire its pages up.
 */
export const docsSectionGroups: readonly { slug: string; title: string }[] =
  sidebar.map((group) => {
    const link = group.items?.[0]?.link;

    if (!link || !group.text) {
      throw new Error(`Sidebar group "${group.text}" has no first link`);
    }

    return {
      slug: link.split('/')[1],
      title: group.text.replace(/<[^>]+>/g, '').trim(),
    };
  });

/** First route segment of every top-level group. */
export const docsSections: readonly string[] = docsSectionGroups.map(
  (group) => group.slug,
);

export default sidebar;
