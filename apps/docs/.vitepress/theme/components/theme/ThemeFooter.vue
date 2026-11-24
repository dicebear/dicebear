<script setup lang="ts">
/**
 * Site footer: brand and sponsor, four link columns, the credits of every
 * style drawn by another artist, then versions and the code license.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { ArrowUpRight } from '@lucide/vue';
import type { AvatarStyleMeta, ThemeOptions } from '@theme/types';
import { footerColumns, olderDocs } from '@theme/config/footer-links';
import { safeHttpUrl } from '@theme/utils/url';
import { isGuestStyle } from '@theme/utils/artists';
import ThemeSponsor from './ThemeSponsor.vue';

const { theme } = useData<ThemeOptions>();

/** One credit per source work. Styles made in-house need none. */
const credits = computed(() => {
  const result: AvatarStyleMeta[] = [];
  const seen: string[] = [];

  for (const style of Object.values(theme.value.avatarStyles)) {
    const meta = style.meta;

    if (!isGuestStyle(meta)) {
      continue;
    }

    if (meta.source) {
      if (seen.includes(meta.source)) {
        continue;
      }

      seen.push(meta.source);
    }

    result.push(meta);
  }

  return result;
});

function href(link: { href: string; external?: boolean }) {
  return link.external ? link.href : withBase(link.href);
}

function licenseName(name?: string) {
  return (name ?? '').replace(/\.$/, '');
}
</script>

<template>
  <footer class="theme-footer">
    <div class="theme-footer-inner">
      <div class="theme-footer-top">
        <div class="theme-footer-brand">
          <a :href="withBase('/')" aria-label="DiceBear home">
            <img
              class="only-light"
              :src="withBase('/logo.svg')"
              alt="DiceBear"
              width="183"
              height="32"
            />
            <img
              class="only-dark"
              :src="withBase('/logo-dark.svg')"
              alt="DiceBear"
              width="183"
              height="32"
            />
          </a>
          <p>
            Open source SVG avatar library and avatar API for designers and
            developers.
          </p>
          <ThemeSponsor class="theme-footer-sponsor" />
        </div>

        <nav class="theme-footer-columns" aria-label="Footer">
          <div
            v-for="column in footerColumns"
            :key="column.title"
            class="theme-footer-column"
          >
            <h3 class="site-control">{{ column.title }}</h3>
            <ul>
              <li v-for="link in column.links" :key="link.label">
                <a
                  :href="href(link)"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener noreferrer' : undefined"
                >
                  {{ link.label }}
                  <ArrowUpRight
                    v-if="link.external"
                    :size="12"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <section
        class="theme-footer-credits"
        aria-label="Styles by other artists"
      >
        <div class="theme-footer-credits-head">
          <h3>Styles by other artists</h3>
          <span>
            All avatars are remixes of the original works.
            <a :href="withBase('/artists/')" class="site-link">All artists</a>
            ·
            <a :href="withBase('/licenses/')" class="site-link">All licenses</a>
          </span>
        </div>
        <ul>
          <li v-for="style in credits" :key="style.source ?? style.title">
            <a
              v-if="safeHttpUrl(style.source)"
              :href="safeHttpUrl(style.source)"
              target="_blank"
              rel="noopener"
              class="theme-footer-link"
              >{{ style.title }}</a
            >
            <template v-else>{{ style.title }}</template>
            by {{ style.creator }} /
            <a
              v-if="safeHttpUrl(style.license?.url)"
              :href="safeHttpUrl(style.license?.url)"
              target="_blank"
              rel="noopener"
              class="theme-footer-link"
              >{{ licenseName(style.license?.name) }}</a
            >
            <template v-else>{{ licenseName(style.license?.name) }}</template>
          </li>
        </ul>
      </section>

      <div class="theme-footer-bottom">
        <span>
          Version {{ theme.majorVersion }}.x
          <span class="theme-footer-dot" aria-hidden="true">·</span>
          <a
            :href="olderDocs.href"
            target="_blank"
            rel="noopener noreferrer"
            class="theme-footer-link"
            >{{ olderDocs.label }}
            <ArrowUpRight :size="12" aria-hidden="true" />
          </a>
        </span>
        <span>
          Code under the
          <a :href="withBase('/licenses/')" class="theme-footer-link"
            >MIT license</a
          >
        </span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.theme-footer-inner {
  display: flex;
  flex-direction: column;
  gap: clamp(40px, 4vw, 56px);
  max-width: var(--db-container);
  margin: 0 auto;
  padding: clamp(48px, 5.5vw, 80px) var(--db-wrap) 40px;
}

/* Inside the docs shell the grid already holds the column and its gutter. */
.theme-footer.docs-shell-footer .theme-footer-inner {
  max-width: none;
  padding: 64px 0 40px;
}

.theme-footer-top {
  display: flex;
  flex-wrap: wrap;
  gap: 48px clamp(40px, 6vw, 96px);
}

.theme-footer-brand {
  display: flex;
  flex: 1 1 260px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  max-width: 320px;

  > a {
    display: flex;
    align-items: center;
    min-height: 44px;
  }

  img {
    width: 137px;
    height: 24px;
  }

  p {
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
  }
}

.theme-footer-sponsor {
  margin-top: 16px;
}

.theme-footer-columns {
  display: grid;
  flex: 999 1 560px;
  grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
  gap: 32px;
  min-width: 0;
}

.theme-footer-column {
  h3 {
    margin-bottom: 6px;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 9px 0;
    line-height: 26px;
    color: var(--db-ink-2);
    transition: color 0.12s;

    &:hover {
      color: var(--db-ink);
    }

    svg {
      color: var(--db-muted);
    }
  }
}

.theme-footer-credits {
  display: flex;
  flex-direction: column;
  gap: 14px;

  ul {
    columns: 4 220px;
    column-gap: 32px;
  }

  li {
    break-inside: avoid;
    padding-bottom: 8px;
    font-size: 12px;
    line-height: 16px;
    color: var(--db-muted);
  }
}

.theme-footer-credits-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 24px;

  h3 {
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    color: var(--db-ink);
  }

  span {
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);
  }

  /* Inline padding adds to the target, not to the line: 24px for a finger. */
  a {
    padding-block: 4px;
    white-space: nowrap;
  }
}

.theme-footer-link {
  color: var(--db-ink-2);
  transition: color 0.12s;

  &:hover {
    color: var(--db-ink);
  }
}

.theme-footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  font-size: 13px;
  line-height: 18px;
  color: var(--db-muted);

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    /* 24px for a finger, without moving the line. */
    margin-block: -3px;
    padding-block: 3px;
  }
}

.theme-footer-dot {
  margin: 0 6px;
}
</style>
