<script setup lang="ts">
import { useData, withBase } from 'vitepress';
import { useLayout } from 'vitepress/theme';
import { computed } from 'vue';
import { siGithub, siFigma } from 'simple-icons';
import { UiIcon } from '../ui';
import type { AvatarStyleMeta, ThemeOptions } from '@theme/types';
import { productLinks as exploreLinks, resourceLinks, legalLinks } from '../../config/footer-links';
import { safeHttpUrl } from '@theme/utils/url';

const { theme } = useData<ThemeOptions>();
const { hasSidebar } = useLayout();

const styles = computed(() => {
  const result: AvatarStyleMeta[] = [];
  const knownWork: string[] = [];

  for (const val of Object.values(theme.value.avatarStyles)) {
    if (
      val.meta.creator === 'Florian Körner' ||
      val.meta.creator === 'DiceBear'
    ) {
      continue;
    }

    if (val.meta.source) {
      if (knownWork.includes(val.meta.source)) {
        continue;
      }

      knownWork.push(val.meta.source);
    }

    result.push(val.meta);
  }

  return result;
});
</script>

<template>
  <footer class="layout-footer" :class="{ 'layout-footer-has-sidebar': hasSidebar }">
    <div class="layout-footer-divider"></div>

    <div class="layout-footer-main">
      <div class="layout-footer-container">
        <!-- Brand column -->
        <div class="layout-footer-brand">
          <a href="/" class="layout-footer-logo">
            <img
              class="layout-footer-logo-light"
              :src="withBase('/logo.svg')"
              alt="DiceBear"
            />
            <img
              class="layout-footer-logo-dark"
              :src="withBase('/logo-dark.svg')"
              alt="DiceBear"
            />
          </a>
          <p class="layout-footer-tagline">
            Open source SVG avatar library and avatar API for designers and developers.
          </p>

          <!-- Social links -->
          <div class="layout-footer-social">
            <a
              href="https://github.com/dicebear/dicebear"
              target="_blank"
              rel="me noopener"
              aria-label="GitHub"
              class="layout-footer-social-link"
            >
              <UiIcon :path="siGithub.path" />
            </a>
            <a
              href="https://www.figma.com/@dicebear_com"
              target="_blank"
              rel="me noopener"
              aria-label="Figma"
              class="layout-footer-social-link"
            >
              <UiIcon :path="siFigma.path" />
            </a>
          </div>
        </div>

        <!-- Link columns -->
        <div class="layout-footer-links">
          <div class="layout-footer-column">
            <h3 class="layout-footer-column-title">Explore</h3>
            <ul class="layout-footer-column-list">
              <li v-for="link in exploreLinks" :key="link.label">
                <a
                  :href="link.href"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener noreferrer' : undefined"
                  class="layout-footer-link"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <div class="layout-footer-column">
            <h3 class="layout-footer-column-title">Resources</h3>
            <ul class="layout-footer-column-list">
              <li v-for="link in resourceLinks" :key="link.label">
                <a
                  :href="link.href"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener noreferrer' : undefined"
                  class="layout-footer-link"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <div class="layout-footer-column">
            <h3 class="layout-footer-column-title">Legal</h3>
            <ul class="layout-footer-column-list">
              <li v-for="link in legalLinks" :key="link.label">
                <a
                  :href="link.href"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener noreferrer' : undefined"
                  class="layout-footer-link"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Sponsor -->
    <div class="layout-footer-sponsor">
      <div class="layout-footer-container">
        <div class="layout-footer-sponsor-inner">
          <a
            href="https://bunny.net/"
            target="_blank"
            rel="noopener sponsored"
            class="layout-footer-sponsor-logo"
          >
            <img
              class="layout-footer-sponsor-logo-light"
              :src="withBase('/sponsors/bunny-light.svg')"
              alt="bunny.net"
            />
            <img
              class="layout-footer-sponsor-logo-dark"
              :src="withBase('/sponsors/bunny-dark.svg')"
              alt="bunny.net"
            />
          </a>
          <span class="layout-footer-sponsor-meta">CDN sponsored by bunny.net · Advertisement</span>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="layout-footer-bottom">
      <div class="layout-footer-container">
        <div class="layout-footer-bottom-inner">
          <p class="layout-footer-attributions">
            <template v-for="(style, index) in styles" :key="style.source">
              <a v-if="safeHttpUrl(style.source)" class="layout-footer-attribution-link" :href="safeHttpUrl(style.source)" target="_blank" rel="noopener">{{
                style.title
              }}</a>
              <template v-else>{{ style.title }}</template>
              by {{ style.creator }} /
              <a v-if="safeHttpUrl(style.license?.url)" class="layout-footer-attribution-link" :href="safeHttpUrl(style.license?.url)" target="_blank" rel="noopener">{{
                style.license?.name
              }}</a>
              <template v-else>{{ style.license?.name }}</template><template v-if="index < styles.length - 1">. </template>
            </template>
            — All avatars are remixes of the original works.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
:root {
  --layout-footer-logo-light-display: inline-block;
  --layout-footer-logo-dark-display: none;
  --layout-footer-sponsor-logo-light-display: none;
  --layout-footer-sponsor-logo-dark-display: inline-block;
}
.dark {
  --layout-footer-logo-light-display: none;
  --layout-footer-logo-dark-display: inline-block;
  --layout-footer-sponsor-logo-light-display: inline-block;
  --layout-footer-sponsor-logo-dark-display: none;
}
</style>

<style lang="scss" scoped>
.layout-footer {
  position: relative;
  background: var(--vp-c-bg);

  &-divider {
    height: 1px;
    max-width: 800px;
    margin: 0 auto;
    background: linear-gradient(90deg, transparent, var(--vp-c-divider), transparent);
  }

  &-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 32px;

    @media (min-width: 960px) {
      .layout-footer-has-sidebar & {
        padding-left: calc(var(--vp-sidebar-width) + 32px);
      }
    }
  }

  // Main section
  &-main {
    padding: 64px 0 48px;

    .layout-footer-container {
      display: flex;
      gap: 64px;
    }
  }

  // Brand
  &-brand {
    flex-shrink: 0;
    max-width: 260px;
  }

  &-logo {
    display: inline-block;
    margin-bottom: 16px;

    img {
      height: 24px;
    }

    &-light {
      display: var(--layout-footer-logo-light-display);
    }

    &-dark {
      display: var(--layout-footer-logo-dark-display);
    }
  }

  &-tagline {
    font-size: 14px;
    line-height: 1.6;
    color: var(--vp-c-text-2);
    margin: 0 0 20px;
  }

  &-social {
    display: flex;
    gap: 4px;

    &-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: var(--vp-radius-sm);
      color: var(--vp-c-text-2);
      transition: all var(--duration-mid) var(--ease-spring);

      &:hover {
        color: var(--vp-c-brand-1);
        background: var(--vp-c-brand-soft);
        transform: translateY(-2px);
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  // Link columns
  &-links {
    display: flex;
    gap: 64px;
    flex: 1;
    justify-content: flex-end;
  }

  &-column {
    &-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--vp-c-text-1);
      margin: 0 0 16px;
    }

    &-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }

  &-link {
    font-size: 14px;
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color var(--duration-fast) ease;

    &:hover {
      color: var(--vp-c-brand-1);
    }

    &::after {
      display: none !important;
    }
  }

  // Sponsor
  &-sponsor {
    padding: 14px 0;
    border-top: 1px solid var(--vp-c-divider);

    .layout-footer-container {
      display: flex;
      justify-content: center;
    }

    &-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    &-logo {
      display: inline-flex;
      align-items: center;
      line-height: 0;

      &::after {
        display: none !important;
      }

      img {
        height: 52px;
      }

      &-light {
        display: var(--layout-footer-sponsor-logo-light-display);
      }

      &-dark {
        display: var(--layout-footer-sponsor-logo-dark-display);
      }
    }

    &-meta {
      font-size: 11px;
      color: var(--vp-c-text-3);
    }
  }

  // Bottom bar
  &-bottom {
    padding: 24px 0;
    border-top: 1px solid var(--vp-c-divider);

    &-inner {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  &-credit-link {
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color var(--duration-fast) ease;

    &:hover {
      color: var(--vp-c-brand-1);
    }

    &::after {
      display: none !important;
    }
  }

  // Attributions
  &-attributions {
    margin: 0;
    font-size: 12px;
    color: var(--vp-c-text-3);
    line-height: 1.7;
  }

  &-attribution-link {
    color: var(--vp-c-text-2);
    text-decoration: none;
    border-bottom: 1px dashed var(--vp-c-text-3);
    transition: all var(--duration-fast) ease;

    &:hover {
      color: var(--vp-c-brand-1);
      border-bottom-color: var(--vp-c-brand-1);
    }

    &::after {
      display: none !important;
    }
  }

  // Responsive: with sidebar (sidebar adds ~300px)
  @media (min-width: 960px) {
    &-has-sidebar .layout-footer-main .layout-footer-container {
      flex-direction: column;
      gap: 40px;
    }

    &-has-sidebar .layout-footer-brand {
      max-width: 100%;
    }

    &-has-sidebar .layout-footer-links {
      justify-content: flex-start;
      gap: 40px;
    }
  }

  @media (min-width: 1340px) {
    &-has-sidebar .layout-footer-main .layout-footer-container {
      flex-direction: row;
      gap: 64px;
    }

    &-has-sidebar .layout-footer-brand {
      max-width: 260px;
    }

    &-has-sidebar .layout-footer-links {
      justify-content: flex-end;
      gap: 64px;
    }
  }

  // Responsive: without sidebar
  @media (max-width: 768px) {
    .layout-footer-main .layout-footer-container {
      flex-direction: column;
      gap: 40px;
    }

    .layout-footer-brand {
      max-width: 100%;
    }

    .layout-footer-links {
      justify-content: flex-start;
      gap: 40px;
    }

    .layout-footer-copyright {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 480px) {
    .layout-footer-links {
      flex-direction: column;
      gap: 32px;
    }
  }
}
</style>
