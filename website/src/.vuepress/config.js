const { description } = require('../../package');
const styles = require('@dicebear/collection');

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
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
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
      {
        text: 'Integrations',
        link: '/integrations/',
        items: [
          { text: 'CLI', link: '/integrations/cli' },
          { text: 'API Server', link: '/integrations/api-server' },
          { text: 'Serverless', link: '/integrations/serverless' },
        ],
      },
    ],
    sidebar: {
      '/styles/': [
        {
          title: 'Guide',
          collapsable: false,
          children: Object.keys(styles)
            .sort()
            .map((style) =>
              style
                .split(/(?=[A-Z])/)
                .map((v) => v.slice(0, 1).toLowerCase() + v.slice(1))
                .join('-')
            ),
        },
      ],
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
};
