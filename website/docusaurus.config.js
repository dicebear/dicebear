const path = require('path');

module.exports = {
  title: 'DiceBear Avatars',
  tagline: 'DiceBear is an avatar library for designers and developers.',
  url: 'https://avatars.dicebear.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'favicon.ico',
  organizationName: 'DiceBear', // Usually your GitHub org/user name.
  projectName: 'avatars', // Usually your repo name.
  themeConfig: {
    sidebarCollapsible: false,
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'DiceBear Avatars',
      logo: {
        alt: 'DiceBear Avatars',
        src: 'img/favicon.svg',
      },
      items: [
        {
          to: 'docs',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'styles',
          activeBasePath: 'styles',
          label: 'Styles',
          position: 'left',
        },
        {
          to: 'integrations/cli',
          activeBasePath: 'integrations',
          label: 'Integrations',
          position: 'left',
        },
        {
          href: 'https://github.com/DiceBear/avatars',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/DiceBear/avatars',
            },
            {
              label: 'Status',
              href: 'https://dicebear.betteruptime.com/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Licenses',
              to: '/licenses',
            },
            {
              label: 'Frequently Asked Questions',
              to: '/faq',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              to: '/legal/privacy-policy',
            },
            {
              label: 'Legal Notice / Impressum',
              to: '/legal/legal-notice',
            },
          ],
        },
      ],
      copyright: `Documentation realized with <a href="https://v2.docusaurus.io/">docusaurus</a>, <a href="https://getbootstrap.com/">bootstrap</a> and <a href="https://octicons.github.com/">octicons</a>.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/DiceBear/avatars/edit/main/website/',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/index.scss'),
        },
      },
    ],
  ],
  plugins: ['docusaurus-plugin-sass', path.resolve(__dirname, 'src/plugins/buffer-plugin')],
};
