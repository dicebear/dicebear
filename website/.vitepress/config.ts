import * as path from 'node:path';
import { defineConfigWithTheme, HeadConfig } from 'vitepress';
import { ThemeOptions } from '@shared/types';
import sidebarDocs from './config/sidebarDocs';
import sidebarPlayground from './config/sidebarPlayground';
import sidebarLegal from './config/sidebarLegal';
import sidebarStyles from './config/sidebarStyles';
import avatarStyles from './config/avatarStyles';
import vuetify from 'vite-plugin-vuetify';

export default defineConfigWithTheme<ThemeOptions>({
  title: 'DiceBear',
  description:
    'With DiceBear you can create awesome avatars for your project in no time.',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  srcDir: path.join(__dirname, '..', 'pages'),
  transformHead: (ctx) => {
    const result: HeadConfig[] = [];

    if (ctx.pageData.relativePath) {
      const canonicalPath = ctx.pageData.relativePath
        .replace('index.md', '')
        .replace(/\.md$/, '');

      result.push([
        'link',
        { rel: 'canonical', href: `https://www.dicebear.com/${canonicalPath}` },
      ]);
    }

    return result;
  },
  vite: {
    plugins: [
      vuetify({
        styles: { configFile: __dirname + '/theme/styles/vuetify.scss' },
      }),
    ],
    ssr: {
      noExternal: ['vuetify'],
    },
    resolve: {
      alias: {
        '@playground': path.resolve(__dirname, 'playground'),
        '@shared': path.resolve(__dirname, 'shared'),
        // Temporary fix for Safari / Select scrolling on mobile
        'body-scroll-lock': path.resolve(
          __dirname,
          'shared/utils/body-scroll-lock.ts'
        ),
        './components/VPLocalNav.vue': path.resolve(
          __dirname,
          'theme/components/VPLocalNav.vue'
        ),
      },
    },
  },
  themeConfig: {
    avatarStyles,
    siteTitle: '',
    logo: {
      dark: '/logo-dark.svg',
      light: '/logo.svg',
    },
    externalLinkIcon: true,
    nav: [
      {
        text: 'Documentation',
        link: '/introduction/',
        activeMatch: '^/(introduction|how-to-use|guides)',
      },
      {
        text: 'Styles',
        link: '/styles/',
        activeMatch: '^/styles',
      },
      { text: 'Playground', link: '/playground/', activeMatch: '^/playground' },
      { text: 'Editor', link: 'https://editor.dicebear.com' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dicebear/dicebear' },
    ],
    editLink: {
      pattern: 'https://github.com/dicebear/dicebear/edit/8.x/website/pages/:path',
    },
    sidebar: {
      '/introduction/': sidebarDocs,
      '/styles/': sidebarStyles,
      '/how-to-use/': sidebarDocs,
      '/guides/': sidebarDocs,
      '/playground/': sidebarPlayground,
      '/legal/': sidebarLegal,
    },
  },
  sitemap: {
    hostname: 'https://www.dicebear.com',
  },
  markdown: {},
});
