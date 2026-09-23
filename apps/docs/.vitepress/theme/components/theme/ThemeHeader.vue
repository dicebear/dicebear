<script setup lang="ts">
/**
 * Site header. Logo and search on the left, the pages, the theme switch and
 * the GitHub button on the right. Below 1024 px the pages move into a menu.
 */
import { computed, ref, watch } from 'vue';
import { useData, useRoute, withBase } from 'vitepress';
import type { DefaultTheme } from 'vitepress';
import { isActive } from 'vitepress/dist/client/shared.js';
import { useBodyScrollLock } from 'vitepress/dist/client/theme-default/composables/scroll-lock.js';
import { onKeyStroke } from '@vueuse/core';
import { Menu, Search, X } from '@lucide/vue';
import { useSearch } from '@theme/composables/useSearch';
import type { ThemeOptions } from '@theme/types';
import ThemeGithubButton from './ThemeGithubButton.vue';
import ThemeSwitch from './ThemeSwitch.vue';

const { theme, page } = useData<ThemeOptions>();
const route = useRoute();
const { show } = useSearch();

type NavLink = DefaultTheme.NavItemWithLink;

const links = computed(() =>
  ((theme.value.nav ?? []) as NavLink[]).map((item) => {
    const link = typeof item.link === 'string' ? item.link : '/';

    return {
      text: item.text,
      href: withBase(link),
      active: isActive(
        page.value.relativePath,
        '',
        item.activeMatch || link,
        !!item.activeMatch,
      ),
    };
  }),
);

const menuOpen = ref(false);
const locked = useBodyScrollLock();

watch(menuOpen, (value) => {
  locked.value = value;
});

watch(
  () => route.path,
  () => {
    menuOpen.value = false;
  },
);

onKeyStroke('Escape', () => {
  menuOpen.value = false;
});
</script>

<template>
  <header class="theme-header">
    <div class="theme-header-inner">
      <div class="theme-header-left">
        <a
          :href="withBase('/')"
          class="theme-header-logo"
          aria-label="DiceBear home"
        >
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
        <button
          type="button"
          class="theme-header-search hv-border"
          @click="show"
        >
          <Search :size="18" :stroke-width="1.8" aria-hidden="true" />
          <span class="theme-header-search-label">Search</span>
          <span class="theme-header-search-keys" aria-hidden="true">
            <kbd class="only-mac">⌘</kbd><kbd class="only-other">Ctrl</kbd
            ><kbd>K</kbd>
          </span>
        </button>
        <button
          type="button"
          class="theme-header-icon theme-header-search-icon hv-ghost"
          aria-label="Search"
          @click="show"
        >
          <Search :size="20" :stroke-width="1.8" aria-hidden="true" />
        </button>
      </div>

      <div class="theme-header-right">
        <nav class="theme-header-nav" aria-label="Main">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="theme-header-link"
            :class="{ 'is-active': link.active }"
            :aria-current="link.active ? 'page' : undefined"
            >{{ link.text }}</a
          >
        </nav>
        <span class="theme-header-divider" aria-hidden="true"></span>
        <ThemeSwitch class="theme-header-switch" />
        <ThemeGithubButton class="theme-header-github" />
        <ThemeGithubButton class="theme-header-github-compact" compact />
        <button
          type="button"
          class="theme-header-icon theme-header-menu-button hv-ghost"
          :aria-expanded="menuOpen"
          aria-controls="theme-header-menu"
          :aria-label="menuOpen ? 'Close menu' : 'Menu'"
          @click="menuOpen = !menuOpen"
        >
          <X
            v-if="menuOpen"
            :size="22"
            :stroke-width="1.8"
            aria-hidden="true"
          />
          <Menu v-else :size="22" :stroke-width="1.8" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div v-show="menuOpen" id="theme-header-menu" class="theme-header-menu">
      <nav class="theme-header-menu-nav" aria-label="Main">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="theme-header-menu-link"
          :class="{ 'is-active': link.active }"
          :aria-current="link.active ? 'page' : undefined"
          >{{ link.text }}</a
        >
      </nav>
      <div class="theme-header-menu-row">
        <span>Dark theme</span>
        <ThemeSwitch />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.theme-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--db-header-h);
  border-bottom: 1px solid var(--db-line);
  background: var(--db-paper);
}

.theme-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: var(--db-container);
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--db-gutter);
}

.theme-header-left {
  display: flex;
  align-items: center;
  gap: 28px;
  min-width: 0;
}

.theme-header-logo {
  display: flex;
  flex-shrink: 0;

  img {
    width: 137px;
    height: 24px;
  }
}

/* The search is a field of the set: the soft ground with the quiet line,
   40px like every other field. */
.theme-header-search {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 220px;
  height: 40px;
  padding: 0 8px 0 12px;
  box-sizing: border-box;
  border: 1px solid var(--db-field-border);
  border-radius: var(--db-radius-2);
  background: var(--db-soft);
  color: var(--db-muted);
  font-size: 13px;
  line-height: 1;
}

.theme-header-search-label {
  flex: 1;
  text-align: left;
}

.theme-header-search-keys {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  border: 1px solid var(--db-line);
  border-radius: 4px;
  font-size: 12px;

  kbd {
    font-family: inherit;
    font-weight: 500;
  }
}

.theme-header-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.theme-header-nav {
  display: flex;
  align-items: center;
  height: 100%;
}

.theme-header-link {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  // The size of the breadcrumb and the sidebar: all three say where you are.
  font-size: 16px;
  line-height: 26px;
  font-weight: 500;
  color: var(--db-ink);
  transition: color 0.12s;

  &:hover,
  &.is-active {
    color: var(--db-brand-text);
  }
}

.theme-header-divider {
  width: 1px;
  height: 24px;
  margin: 0 16px 0 8px;
  background: var(--db-line);
}

.theme-header-github {
  margin-left: 16px;
}

.theme-header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--db-radius-2);
  color: var(--db-ink);
}

.theme-header-search-icon,
.theme-header-github-compact,
.theme-header-menu-button {
  display: none;
}

.theme-header-menu {
  position: fixed;
  inset: var(--db-header-h) 0 0;
  z-index: 49;
  padding: 16px var(--db-gutter) 32px;
  background: var(--db-paper);
  overflow-y: auto;
}

.theme-header-menu-nav {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--db-line);
}

.theme-header-menu-link {
  padding: 14px 0;
  border-top: 1px solid var(--db-line);
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
  color: var(--db-ink);

  &:first-child {
    border-top: 0;
  }

  &.is-active {
    color: var(--db-brand-text);
  }
}

.theme-header-menu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  font-size: 16px;
  color: var(--db-ink-2);
}

@media (max-width: 1023px) {
  .theme-header-left {
    gap: 8px;
  }

  .theme-header-logo img {
    width: 125px;
    height: 22px;
  }

  .theme-header-search,
  .theme-header-nav,
  .theme-header-divider,
  .theme-header-switch,
  .theme-header-github {
    display: none;
  }

  .theme-header-search-icon,
  .theme-header-menu-button,
  .theme-header-github-compact {
    display: flex;
  }

  .theme-header-right {
    gap: 4px;
  }

  .theme-header-menu-button {
    margin-right: -8px;
  }
}

@media (min-width: 1024px) {
  .theme-header-menu {
    display: none !important;
  }
}
</style>
