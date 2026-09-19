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
import ThemeSponsor from './ThemeSponsor.vue';

const { theme } = useData<ThemeOptions>();

/** One credit per source work. Styles made in-house need none. */
const credits = computed(() => {
  const result: AvatarStyleMeta[] = [];
  const seen: string[] = [];

  for (const style of Object.values(theme.value.avatarStyles)) {
    const meta = style.meta;

    if (meta.creator === 'Florian Körner' || meta.creator === 'DiceBear') {
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
            <h3>{{ column.title }}</h3>
            <ul>
              <li v-for="link in column.links" :key="link.label">
                <a
                  :href="href(link)"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener noreferrer' : undefined"
                  class="hv-fade"
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

      <section class="theme-footer-credits" aria-label="Styles by other artists">
        <div class="theme-footer-credits-head">
          <h3>Styles by other artists</h3>
          <span>
            All avatars are remixes of the original works.
            <a :href="withBase('/licenses/')" class="hv-link">All licenses</a>
          </span>
        </div>
        <ul>
          <li v-for="style in credits" :key="style.source ?? style.title">
            <a
              v-if="safeHttpUrl(style.source)"
              :href="safeHttpUrl(style.source)"
              target="_blank"
              rel="noopener"
              class="hv-link"
              >{{ style.title }}</a
            >
            <template v-else>{{ style.title }}</template>
            by {{ style.creator }} /
            <a
              v-if="safeHttpUrl(style.license?.url)"
              :href="safeHttpUrl(style.license?.url)"
              target="_blank"
              rel="noopener"
              class="hv-link"
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
            class="hv-link"
            >{{ olderDocs.label }}
            <ArrowUpRight :size="12" aria-hidden="true" />
          </a>
        </span>
        <span>
          Code under the
          <a :href="withBase('/licenses/')" class="hv-link">MIT license</a>
        </span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.theme-footer {
  border-top: 1px solid var(--db-line);
}

.theme-footer-inner {
  display: flex;
  flex-direction: column;
  gap: 80px;
  max-width: var(--db-container);
  margin: 0 auto;
  padding: 80px var(--db-gutter) 40px;
}

.theme-footer-top {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 96px;
}

.theme-footer-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  max-width: 300px;

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
  margin-top: 24px;
}

.theme-footer-columns {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px;
}

.theme-footer-column {
  display: flex;
  flex-direction: column;
  gap: 16px;

  h3 {
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;
    color: var(--db-ink);
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 16px;
    line-height: 26px;
    color: var(--db-ink-2);

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
    columns: 4;
    column-gap: 32px;
  }

  li {
    break-inside: avoid;
    padding-bottom: 8px;
    font-size: 12px;
    line-height: 16px;
    color: var(--db-muted);
  }

  li a {
    color: var(--db-ink-2);
  }
}

.theme-footer-credits-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;

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

  a {
    font-weight: 500;
    color: var(--db-brand-text);
  }
}

.theme-footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 13px;
  line-height: 18px;
  color: var(--db-muted);

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--db-ink-2);
  }
}

.theme-footer-dot {
  margin: 0 6px;
  color: var(--db-chevron);
}

@media (max-width: 1023px) {
  .theme-footer-top {
    grid-template-columns: minmax(0, 1fr);
    gap: 56px;
  }

  .theme-footer-credits ul {
    columns: 2;
  }
}

@media (max-width: 767px) {
  .theme-footer-inner {
    gap: 56px;
    padding-top: 48px;
    padding-bottom: 32px;
  }

  .theme-footer-columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 40px 24px;
  }

  .theme-footer-credits ul {
    columns: 1;
  }

  .theme-footer-credits-head,
  .theme-footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
