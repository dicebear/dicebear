const { description } = require('../../package');
const styles = require('@dicebear/collection');
const camelCaseToKebabCase = require('./utils/camelCaseToKebabCase');
const camelCaseToSpaceCase = require('./utils/camelCaseToSpaceCase');
const path = require('path');

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'DiceBear',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#0284C7' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    logo: '/logo.svg',
    repo: 'dicebear/dicebear',
    editLinks: true,
    docsDir: 'website',
    editLinkText: '',
    lastUpdated: false,
    search: false,
    nav: [
      {
        text: 'Docs',
        link: '/docs/',
      },
      {
        text: 'Styles',
        link: '/styles/',
      },
      {
        text: 'Playground',
        link: '/playground/',
      },
    ],
    sidebar: [
      {
        title: 'Docs',
        collapsable: false,
        children: [
          {
            title: 'Getting Started',
            path: '/docs/',
          },
          {
            title: 'Installation',
            path: '/docs/installation/',
          },
          {
            title: 'HTTP-API',
            path: '/docs/http-api/',
          },
          {
            title: 'CLI',
            path: '/docs/cli/',
          },
          {
            title: 'Options',
            path: '/docs/options/',
          },
        ],
      },
      {
        title: 'Styles',
        collapsable: false,
        children: [
          {
            title: 'Official Styles',
            path: `/styles/`,
            collapsable: false,
            initialOpenGroupIndex: -1,
            children: Object.keys(styles)
              .sort()
              .map((style) => {
                return {
                  title: camelCaseToSpaceCase(style),
                  path: `/styles/${camelCaseToKebabCase(style)}/`,
                };
              }),
          },
          {
            title: 'Build your own',
            path: '/styles/build/',
            collapsable: false,
            initialOpenGroupIndex: -1,
            children: ['/styles/build/with-figma', '/styles/build/with-template'],
          },
        ],
      },
    ],
  },

  additionalPages: Object.keys(styles).map((style) => {
    return {
      path: `/styles/${camelCaseToKebabCase(style)}/`,
      filePath: path.resolve(__dirname, 'pages/styles/[style].md'),
    };
  }),

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
};
