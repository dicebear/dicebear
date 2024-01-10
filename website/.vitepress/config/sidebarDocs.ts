import { DefaultTheme } from 'vitepress';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Introduction',
    items: [{ text: 'What is DiceBear?', link: '/introduction/' }],
  },
  {
    text: 'How to use',
    items: [
      {
        text: 'JS-Library',
        link: '/how-to-use/js-library/',
        collapsed: true,
        items: [
          { text: 'Core', link: '/how-to-use/js-library/' },
          {
            text: 'Converter',
            link: '/how-to-use/js-library/converter/',
          },
        ],
      },
      { text: 'HTTP-API', link: '/how-to-use/http-api/' },
      { text: 'CLI', link: '/how-to-use/cli/' },
    ],
  },
  {
    text: 'Guides',
    items: [
      {
        text: 'Programmatically access all available options of an avatar style',
        link: '/guides/access-all-available-options/',
      },
      {
        text: 'Host the HTTP API yourself',
        link: '/guides/host-the-http-api-yourself/',
      },
      {
        text: 'Contribute to the documentation',
        link: '/guides/contribute-to-the-documentation/',
      },
      {
        text: 'Contribute to the library',
        link: '/guides/contribute-to-the-library/',
      },
      {
        text: 'Create an avatar style from Scratch',
        link: '/guides/create-an-avatar-style-from-scratch/',
      },
      {
        text: 'Create an avatar style with Figma',
        link: '/guides/create-an-avatar-style-with-figma/',
      },
      {
        text: 'Use the HTTP-API as Gravatar default image',
        link: '/guides/use-the-http-api-as-gravatar-default-image/',
      },
      {
        text: 'Use the library without tree shaking',
        link: '/guides/use-the-library-without-tree-shaking/',
      },
      {
        text: 'Use the library without ESM',
        link: '/guides/use-the-library-without-esm/',
      },
      {
        text: 'Use the library with React',
        link: '/guides/use-the-library-with-react/',
      },
      {
        text: 'Use the library with React Native',
        link: '/guides/use-the-library-with-react-native/',
      },
      {
        text: 'Use the library with Svelte',
        link: '/guides/use-the-library-with-svelte/',
      },
      {
        text: 'Use the library with Vue',
        link: '/guides/use-the-library-with-vue/',
      },
      {
        text: 'How many unique avatars are possible per avatar style?',
        link: '/guides/how-many-unique-avatars/',
      },
    ],
  },
];

export default sidebar;
