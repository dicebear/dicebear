import type { DefaultTheme } from 'vitepress';

// NOTE: VitePress renders sidebar item `text` with `v-html`, so inline markup is
// allowed, and we use it to attach small status badges (styled via
// `.vp-sidebar-badge` in theme/styles/main.scss). A "New" badge marks what a
// 10.x minor added. Anything that shipped with 10.0.0 is as old as v10 itself
// and carries none, which is why the PHP library has no badge while the ports
// that followed it do. Groups are intentionally NOT collapsible (no `collapsed`
// key), so every section stays expanded.
const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Introduction',
    items: [
      { text: 'What is DiceBear?', link: '/introduction/' },
      {
        text: 'DiceBear vs. Alternatives',
        link: '/guides/avatar-library-comparison/',
      },
      {
        text: 'For AI Assistants <span class="vp-sidebar-badge is-new">New</span>',
        link: '/guides/dicebear-for-ai-assistants/',
      },
    ],
  },
  {
    text: 'How to use',
    items: [
      {
        text: 'JS Library',
        link: '/how-to-use/js-library/',
        items: [
          { text: 'Core', link: '/how-to-use/js-library/' },
          { text: 'Converter', link: '/how-to-use/js-library/converter/' },
        ],
      },
      { text: 'PHP Library', link: '/how-to-use/php-library/' },
      {
        text: 'Python Library <span class="vp-sidebar-badge is-new">New</span>',
        link: '/how-to-use/python-library/',
      },
      {
        text: 'Rust Library <span class="vp-sidebar-badge is-new">New</span>',
        link: '/how-to-use/rust-library/',
      },
      {
        text: 'Go Library <span class="vp-sidebar-badge is-new">New</span>',
        link: '/how-to-use/go-library/',
      },
      {
        text: 'Dart Library <span class="vp-sidebar-badge is-new">New</span>',
        link: '/how-to-use/dart-library/',
      },
      {
        text: 'C# Library <span class="vp-sidebar-badge is-new">New</span>',
        link: '/how-to-use/csharp-library/',
      },
      { text: 'HTTP-API', link: '/how-to-use/http-api/' },
      { text: 'CLI', link: '/how-to-use/cli/' },
    ],
  },
  {
    text: 'Customization',
    items: [
      {
        text: 'Options',
        link: '/guides/core-options/',
      },
      {
        text: 'Tags <span class="vp-sidebar-badge is-new">New</span>',
        link: '/guides/filter-variants-with-tags/',
      },
      {
        text: 'Tag Reference',
        link: '/guides/how-dicebear-tags-variants/',
      },
      {
        text: 'Gender',
        link: '/guides/how-do-i-set-a-gender/',
      },
    ],
  },
  {
    text: 'Frameworks',
    items: [
      {
        text: 'Angular',
        link: '/guides/use-the-library-with-angular/',
      },
      {
        text: 'Flutter',
        link: '/guides/use-the-library-with-flutter/',
      },
      {
        text: 'Godot <span class="vp-sidebar-badge is-new">New</span>',
        link: '/guides/use-the-library-with-godot/',
      },
      {
        text: 'Next.js',
        link: '/guides/use-the-library-with-next-js/',
      },
      {
        text: 'Nuxt',
        link: '/guides/use-the-library-with-nuxt/',
      },
      {
        text: 'React',
        link: '/guides/use-the-library-with-react/',
      },
      {
        text: 'React Native',
        link: '/guides/use-the-library-with-react-native/',
      },
      {
        text: 'Svelte',
        link: '/guides/use-the-library-with-svelte/',
      },
      {
        text: 'Unity <span class="vp-sidebar-badge is-new">New</span>',
        link: '/guides/use-the-library-with-unity/',
      },
      {
        text: 'Vue',
        link: '/guides/use-the-library-with-vue/',
      },
    ],
  },
  {
    text: 'Custom Styles',
    items: [
      {
        text: 'With Figma',
        link: '/guides/create-an-avatar-style-with-figma/',
      },
      {
        text: 'Edit a Style <span class="vp-sidebar-badge is-new">New</span>',
        link: '/guides/edit-an-avatar-style-with-figma/',
      },
      {
        text: 'From Scratch',
        link: '/guides/create-an-avatar-style-from-scratch/',
      },
    ],
  },
  {
    text: 'Specification',
    items: [
      {
        text: 'Definition Schema',
        link: '/specification/definition-schema/',
      },
      {
        text: 'Implement DiceBear Core',
        link: '/specification/implement-dicebear-core/',
      },
    ],
  },
  {
    text: 'Use Cases',
    items: [
      {
        text: 'Avatar Placeholder',
        link: '/guides/use-as-avatar-placeholder/',
      },
      {
        text: 'Gravatar Default Image',
        link: '/guides/use-the-http-api-as-gravatar-default-image/',
      },
      {
        text: 'Self-host the HTTP-API',
        link: '/guides/host-the-http-api-yourself/',
      },
    ],
  },
  {
    text: 'Advanced',
    items: [
      {
        text: 'Access Style Options',
        link: '/guides/access-all-available-options/',
      },
      {
        text: 'Load All Avatar Styles',
        link: '/guides/load-all-avatar-styles/',
      },
      {
        text: 'Unique Avatar Count',
        link: '/guides/how-many-unique-avatars/',
      },
    ],
  },
  {
    text: 'Contributing',
    items: [
      {
        text: 'Documentation',
        link: '/guides/contribute-to-the-documentation/',
      },
      {
        text: 'Editor',
        link: '/guides/contribute-to-the-editor/',
      },
      {
        text: 'API',
        link: '/guides/contribute-to-the-api/',
      },
      {
        text: 'Library',
        link: '/guides/contribute-to-the-library/',
      },
    ],
  },
];

export default sidebar;
