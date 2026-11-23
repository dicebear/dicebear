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
import { onKeyStroke, useMediaQuery } from '@vueuse/core';
import { Menu, Search, X } from '@lucide/vue';
import { useOverlayFocus } from '@theme/composables/useOverlayFocus';
import { useSearch } from '@theme/composables/useSearch';
import type { ThemeOptions } from '@theme/types';
import ThemeGithubButton from './ThemeGithubButton.vue';
import ThemeSwitch from './ThemeSwitch.vue';

const { theme, page, frontmatter } = useData<ThemeOptions>();
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

// A tablet turned sideways has no menu button any more: the menu must not
// stay open, unseen, with the page locked behind it.
const roomForNav = useMediaQuery('(min-width: 1024px)');

watch(roomForNav, (wide) => {
  if (wide) menuOpen.value = false;
});

const menuButton = ref<HTMLButtonElement>();
const menuPanel = ref<HTMLElement>();

useOverlayFocus(
  menuOpen,
  () => menuPanel.value,
  () => menuButton.value,
  () => menuButton.value,
);
</script>

<template>
  <header class="theme-header" :class="{ 'is-app': frontmatter.appBar }">
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
          class="site-btn site-btn-secondary theme-header-search"
          @click="show"
        >
          <Search :size="18" aria-hidden="true" />
          Search
          <span class="site-kbd" aria-hidden="true">
            <span class="only-mac">⌘</span
            ><span class="only-other">Ctrl</span>&nbsp;K
          </span>
        </button>
        <button
          type="button"
          class="site-btn site-btn-ghost site-btn-icon theme-header-search-icon"
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
            class="site-pill site-pill-quiet site-pill-lg"
            :aria-current="link.active ? 'page' : undefined"
            >{{ link.text }}</a
          >
        </nav>
        <ThemeSwitch class="theme-header-switch" />
        <ThemeGithubButton class="theme-header-github" />
        <ThemeGithubButton class="theme-header-github-compact" compact />
        <button
          ref="menuButton"
          type="button"
          class="site-btn site-btn-ghost site-btn-icon theme-header-menu-button"
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

    <div
      v-show="menuOpen"
      id="theme-header-menu"
      ref="menuPanel"
      class="theme-header-menu"
    >
      <nav class="theme-header-menu-nav" aria-label="Main">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="site-pill site-pill-quiet site-pill-lg theme-header-menu-link"
          :aria-current="link.active ? 'page' : undefined"
          @click="menuOpen = false"
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
  background: var(--db-paper);

  /* A page with a bar of its own, the playground, shows it in place of
     the header on a phone; its menu leads back to the site. */
  &.is-app {
    @media (max-width: 767px) {
      display: none;
    }
  }
}

.theme-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: var(--db-container);
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--db-wrap);
}

.theme-header-left {
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 28px);
  min-width: 0;
}

.theme-header-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-height: 44px;

  img {
    width: 137px;
    height: 24px;
  }
}

/* The search only opens the search dialog, so it is a button like the others
   and does not pose as a field. The shortcut sits on the paper, as a small
   key on the button's tint. */
.theme-header-search {
  padding: 0 8px 0 16px;

  .site-kbd {
    margin-left: 2px;
    border-color: transparent;
    background: var(--db-paper);
    color: var(--db-ink-2);
  }
}

.theme-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-header-nav {
  display: flex;
  align-items: center;
  gap: 2px;
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
  padding: 16px var(--db-wrap) 32px;
  background: var(--db-paper);
  overflow-y: auto;
}

.theme-header-menu-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.theme-header-menu-link {
  height: 52px;
  font-size: 22px;
}

.theme-header-menu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding: 20px 18px;
  border-top: 2px solid var(--db-rule);
  font-family: var(--db-font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--db-ink);
}

/* Between the menu and the full width the search folds into its icon, so it
   never runs into the navigation. */
@media (max-width: 1199px) {
  .theme-header-search {
    display: none;
  }

  .theme-header-search-icon {
    display: inline-flex;
  }
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
  .theme-header-switch,
  .theme-header-github {
    display: none;
  }

  .theme-header-search-icon,
  .theme-header-menu-button,
  .theme-header-github-compact {
    display: inline-flex;
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
