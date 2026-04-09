import * as path from 'node:path';
import { defineConfig, HeadConfig } from 'vitepress';
import { ThemeOptions } from '@theme/types';

import sidebarDocs from './config/sidebarDocs';
import sidebarStyles from './config/sidebarStyles';
import avatarStyles from './config/avatarStyles';
import { formatStars } from './theme/utils/format';

async function fetchGitHubStars(
  repos: string[],
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const TIMEOUT_MS = 5000;

  await Promise.all(
    repos.map(async (repo) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          result[repo] = formatStars(data.stargazers_count);
        }
      } catch (err) {
        console.warn(
          `[github-stars] failed for ${repo}:`,
          err instanceof Error ? err.message : err,
        );
      } finally {
        clearTimeout(timer);
      }
    }),
  );

  return result;
}

const githubStars = await fetchGitHubStars([
  'dicebear/dicebear',
  'nusu/avvvatars',
  'dmester/jdenticon',
  'multiavatar/Multiavatar',
  'boringdesigners/boring-avatars',
]);

const isProduction = process.env.NODE_ENV === 'production';

const thirdPartyScripts: HeadConfig[] = isProduction
  ? [
      [
        'script',
        {
          defer: '',
          src: 'https://u.dicebear.com/script.js',
          'data-website-id': '75d27df5-3441-4530-8f29-70d04ae9085e',
        },
      ],
    ]
  : [];

export default defineConfig<ThemeOptions>({
  title: 'DiceBear',
  description:
    'DiceBear is a free, open source avatar library and avatar API with 30+ SVG styles. Generate profile pictures and user placeholder images for any project.',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'DiceBear' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { property: 'og:site_name', content: 'DiceBear' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'DiceBear',
        url: 'https://www.dicebear.com',
        description:
          'DiceBear is a free, open source avatar library and Avatar API. Generate unique, deterministic SVG avatars and profile pictures with 30+ styles — privacy-focused and self-hostable.',
      }),
    ],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'DiceBear',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        url: 'https://www.dicebear.com',
        description:
          'Privacy-focused, open source SVG avatar library with 30+ styles. Free Avatar API, JavaScript library, and CLI for generating deterministic profile pictures and user placeholder images.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }),
    ],
    ...thirdPartyScripts,
  ],
  srcDir: path.join(__dirname, '..', 'pages'),
  transformHead: (ctx) => {
    const result: HeadConfig[] = [];

    if (ctx.pageData.relativePath) {
      const canonicalPath = ctx.pageData.relativePath
        .replace('index.md', '')
        .replace(/\.md$/, '');

      const canonicalUrl = `https://www.dicebear.com/${canonicalPath}`;

      result.push(['link', { rel: 'canonical', href: canonicalUrl }]);

      if (canonicalPath.startsWith('legal/site-notice')) {
        result.push(['meta', { name: 'robots', content: 'noindex, nofollow' }]);
      }

      const pageTitle =
        ctx.pageData.frontmatter.title || ctx.pageData.title || 'DiceBear';
      const pageDescription =
        ctx.pageData.frontmatter.description ||
        ctx.pageData.description ||
        'DiceBear is a free, open source avatar library and Avatar API with 30+ SVG styles.';

      result.push(
        ['meta', { property: 'og:title', content: pageTitle }],
        ['meta', { property: 'og:description', content: pageDescription }],
        ['meta', { property: 'og:url', content: canonicalUrl }],
        ['meta', { name: 'twitter:title', content: pageTitle }],
        ['meta', { name: 'twitter:description', content: pageDescription }],
      );
    }

    return result;
  },
  vite: {
    ssr: {
      noExternal: [
        'vue-countup-v3',
        'vue-chartjs',
        'globe.gl',
        'three',
      ],
    },
    resolve: {
      alias: {
        '@playground': path.resolve(__dirname, 'theme/components/playground'),
        '@theme': path.resolve(__dirname, 'theme'),
        './components/VPLocalNav.vue': path.resolve(
          __dirname,
          'theme/components/layout/LayoutVPLocalNav.vue',
        ),
      },
    },
  },
  themeConfig: {
    avatarStyles,
    githubStars,
    siteTitle: '',
    logo: {
      dark: '/logo-dark.svg',
      light: '/logo.svg',
    },
    externalLinkIcon: true,
    search: {
      provider: 'local',
    },
    nav: [
      {
        text: 'Documentation',
        link: '/introduction/',
        activeMatch: '^/(introduction|how-to-use|guides|specification)',
      },
      {
        text: 'Styles',
        link: '/styles/',
        activeMatch: '^/styles',
      },
      { text: 'Playground', link: '/playground/', activeMatch: '^/playground' },
      { text: 'Stats', link: '/stats/', activeMatch: '^/stats' },
      { text: 'Editor', link: 'https://editor.dicebear.com' },
    ],
    outline: [2, 2],
    socialLinks: [],
    editLink: {
      pattern:
        'https://github.com/dicebear/dicebear/edit/10.x/apps/docs/pages/:path',
    },
    sidebar: {
      '/introduction/': sidebarDocs,
      '/styles/': sidebarStyles,
      '/how-to-use/': sidebarDocs,
      '/guides/': sidebarDocs,
      '/specification/': sidebarDocs,
    },
  },
  sitemap: {
    hostname: 'https://www.dicebear.com',
  },
  markdown: {},
});
