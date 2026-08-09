import * as path from 'node:path';
import { defineConfig, type DefaultTheme, type HeadConfig } from 'vitepress';
import type { ThemeOptions } from '@theme/types';

import {
  generateOgImages,
  ogImagePathFor,
  OG_IMAGE_SIZE,
} from './og-images.ts';
import { SITE_ORIGIN, siteUrl } from './config/site.ts';
import sidebarDocs from './config/sidebarDocs.ts';
import sidebarStyles from './config/sidebarStyles.ts';
import sidebarTools from './config/sidebarTools.ts';
import avatarStyles, {
  styleCount,
  animatedStyleCount,
  STYLE_COUNT_TOKEN,
  ANIMATED_STYLE_COUNT_TOKEN,
} from './config/avatarStyles.ts';
import avatarUniqueCounts from './config/avatarUniqueCounts.ts';
import avatarStyleSizes from './config/avatarStyleSizes.ts';
import { formatStars } from './theme/utils/format.ts';

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
  description: `DiceBear is a free, open source avatar library and avatar API with ${styleCount} avatar styles. Generate profile pictures and user placeholder images for any project.`,
  head: [
    // Most pages load avatars from the HTTP API (seed demo, style showcase,
    // playground). Warming up the connection hides the DNS/TLS latency on
    // mobile. The avatars are plain <img> requests (no CORS), so the hint
    // must not carry a crossorigin attribute to match the connection.
    ['link', { rel: 'preconnect', href: 'https://api.dicebear.com' }],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-96x96.png',
        sizes: '96x96',
      },
    ],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
    ],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'DiceBear' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { property: 'og:site_name', content: 'DiceBear' }],
    ['meta', { property: 'og:type', content: 'website' }],
    // The cards generated in buildEnd are 1200x630, so the large variant is
    // the one that matches; `summary` would crop them into a small square.
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'DiceBear',
        url: siteUrl('/'),
        description: `DiceBear is a free, open source avatar library and Avatar API. Generate unique, deterministic SVG avatars and profile pictures with ${styleCount} styles, privacy-focused and self-hostable.`,
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
        url: siteUrl('/'),
        description: `Privacy-focused, open source SVG avatar library with ${styleCount} styles. Free Avatar API, JavaScript library, PHP library, Python library, Rust library, Go library, Dart library, and CLI for generating deterministic profile pictures and user placeholder images.`,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }),
    ],
    ...thirdPartyScripts,
  ],
  srcDir: path.join(import.meta.dirname, '..', 'pages'),
  // Frontmatter is static YAML and cannot import the style counts, so pages
  // write the tokens where the numbers belong and the build substitutes them.
  // Runs before transformHead, which reads these two fields for the canonical
  // title and the og:description.
  transformPageData: (pageData) => {
    const fill = (value: string) =>
      value
        .replaceAll(STYLE_COUNT_TOKEN, String(styleCount))
        .replaceAll(ANIMATED_STYLE_COUNT_TOKEN, String(animatedStyleCount));

    if (typeof pageData.frontmatter.title === 'string') {
      pageData.frontmatter.title = fill(pageData.frontmatter.title);
    }

    if (typeof pageData.frontmatter.description === 'string') {
      pageData.frontmatter.description = fill(pageData.frontmatter.description);
    }

    if (typeof pageData.title === 'string') {
      pageData.title = fill(pageData.title);
    }

    if (typeof pageData.description === 'string') {
      pageData.description = fill(pageData.description);
    }
  },
  transformHead: (ctx) => {
    const result: HeadConfig[] = [];

    // The theme renders text with the self-hosted variable Inter (see
    // theme/index.ts); VitePress's built-in Inter is disabled via
    // theme-without-fonts. Preload the latin subset so the first paint
    // doesn't wait a full round trip after the CSS arrives. Font preloads
    // always need `crossorigin`, even for same-origin requests.
    const interFont = ctx.assets.find((asset) =>
      /inter-latin-wght-normal\.[\w-]+\.woff2$/.test(asset),
    );

    if (interFont) {
      result.push([
        'link',
        {
          rel: 'preload',
          href: interFont,
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ]);
    }

    if (ctx.pageData.relativePath) {
      const canonicalPath = ctx.pageData.relativePath
        .replace('index.md', '')
        .replace(/\.md$/, '');

      const canonicalUrl = siteUrl(`/${canonicalPath}`);

      result.push(['link', { rel: 'canonical', href: canonicalUrl }]);

      if (canonicalPath.startsWith('legal/legal-notice')) {
        result.push(['meta', { name: 'robots', content: 'noindex, nofollow' }]);
      }

      const pageTitle =
        ctx.pageData.frontmatter.title || ctx.pageData.title || 'DiceBear';
      const pageDescription =
        ctx.pageData.frontmatter.description ||
        ctx.pageData.description ||
        `DiceBear is a free, open source avatar library and Avatar API with ${styleCount} avatar styles.`;

      // og-images.ts owns which page maps to which card, so the mapping and
      // the generator cannot drift into pointing at a card that was never
      // written.
      const ogImageUrl = siteUrl(ogImagePathFor(ctx.pageData.relativePath));

      result.push(
        ['meta', { property: 'og:title', content: pageTitle }],
        ['meta', { property: 'og:description', content: pageDescription }],
        ['meta', { property: 'og:url', content: canonicalUrl }],
        ['meta', { property: 'og:image', content: ogImageUrl }],
        [
          'meta',
          { property: 'og:image:width', content: String(OG_IMAGE_SIZE.width) },
        ],
        [
          'meta',
          {
            property: 'og:image:height',
            content: String(OG_IMAGE_SIZE.height),
          },
        ],
        ['meta', { property: 'og:image:alt', content: pageTitle }],
        ['meta', { name: 'twitter:title', content: pageTitle }],
        ['meta', { name: 'twitter:description', content: pageDescription }],
        ['meta', { name: 'twitter:image', content: ogImageUrl }],
      );
    }

    return result;
  },
  buildEnd: (siteConfig) =>
    generateOgImages(siteConfig.outDir, siteConfig.cacheDir, siteConfig.srcDir),
  vite: {
    plugins: [
      {
        // VitePress puts everything the theme entry reaches into one `theme`
        // chunk, and rolldown then folds the modules that many pages share
        // into it as well. @dicebear/core rides along that way: its two
        // compiled JSON Schema validators alone are ~160 kB, and they were
        // downloaded on text-only pages that never render an avatar.
        //
        // The grouping has to be injected here rather than through
        // `build.rolldownOptions`, because VitePress writes its own
        // `output.codeSplitting` after the user config has been merged.
        name: 'dicebear:chunks',
        apply: 'build',
        outputOptions(options) {
          const { codeSplitting } = options as {
            codeSplitting?: { groups?: unknown[] };
          };

          // Only extend a grouping that is actually there. If VitePress ever
          // stops setting one, leaving the defaults alone beats replacing
          // them with just this group.
          if (!codeSplitting?.groups) return null;

          return {
            ...options,
            codeSplitting: {
              ...codeSplitting,
              groups: [
                {
                  name: 'dicebear-core',
                  test: /[/\\](@dicebear[/\\]core|js[/\\]core)[/\\]lib[/\\]/,
                },
                ...codeSplitting.groups,
              ],
            },
          } as typeof options;
        },
      },
    ],
    ssr: {
      noExternal: ['vue-countup-v3', 'vue-chartjs'],
    },
    resolve: {
      alias: {
        '@playground': path.resolve(
          import.meta.dirname,
          'theme/components/playground',
        ),
        '@theme': path.resolve(import.meta.dirname, 'theme'),
        './components/VPLocalNav.vue': path.resolve(
          import.meta.dirname,
          'theme/components/layout/LayoutVPLocalNav.vue',
        ),
      },
    },
  },
  themeConfig: {
    avatarStyles,
    styleCount,
    animatedStyleCount,
    avatarUniqueCounts,
    avatarStyleSizes,
    githubStars,
    siteTitle: '',
    // Intrinsic SVG dimensions as explicit attributes so the browser can
    // reserve the aspect ratio before the file loads (the displayed size
    // comes from the theme's CSS height). VPImage spreads nested src
    // objects onto the <img> at runtime, but ThemeableImage only types the
    // light/dark form with plain strings, hence the double cast.
    logo: {
      dark: { src: '/logo-dark.svg', width: 183, height: 32 },
      light: { src: '/logo.svg', width: 183, height: 32 },
    } as unknown as DefaultTheme.ThemeableImage,
    externalLinkIcon: true,
    search: {
      provider: 'local',
    },
    // The nav serves the developer audience of this site. The Editor targets
    // end users looking for a single avatar, so it lives on the home page and
    // in the footer instead of taking a slot on every docs page. The version
    // switcher moved to the footer as well (see theme/config/footer-links.ts).
    nav: [
      { text: 'Playground', link: '/playground/', activeMatch: '^/playground' },
      {
        text: 'Styles',
        link: '/styles/',
        activeMatch: '^/styles',
      },
      {
        text: 'Animated',
        link: '/animated-avatars/',
        activeMatch: '^/animated-avatars',
      },
      {
        text: 'Docs',
        link: '/introduction/',
        activeMatch: '^/(introduction|how-to-use|guides|specification)',
      },
      {
        text: 'About',
        link: '/why-dicebear/',
        activeMatch: '^/why-dicebear',
      },
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
      '/tools/': sidebarTools,
    },
  },
  sitemap: {
    hostname: SITE_ORIGIN,
  },
  markdown: {},
});
