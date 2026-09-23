<script setup lang="ts">
/**
 * The docs layout: sidebar, article, outline. A page can come without a
 * sidebar (no section lists it) or without the outline (`aside: false`), and
 * the grid follows. Below 960 px the sidebar becomes a drawer and the outline
 * a dropdown in a bar under the header.
 */
import { computed, ref, watch } from 'vue';
import { useData, useRoute } from 'vitepress';
import { getSidebar } from 'vitepress/dist/client/theme-default/support/sidebar.js';
import { useBodyScrollLock } from 'vitepress/dist/client/theme-default/composables/scroll-lock.js';
import { onKeyStroke } from '@vueuse/core';
import { AlignLeft, ChevronDown, X } from '@lucide/vue';
import { useOutline } from '@theme/composables/useOutline';
import type { ThemeOptions } from '@theme/types';
import DocsEditLink from '../docs/DocsEditLink.vue';
import DocsOutline from '../docs/DocsOutline.vue';
import DocsPageHeader from '../docs/DocsPageHeader.vue';
import DocsPager from '../docs/DocsPager.vue';
import DocsSidebar from '../docs/DocsSidebar.vue';
import ThemeFooter from './ThemeFooter.vue';
import ThemeSponsor from './ThemeSponsor.vue';

const { theme, page, frontmatter } = useData<ThemeOptions>();
const route = useRoute();

const hasSidebar = computed(
  () =>
    frontmatter.value.sidebar !== false &&
    getSidebar(theme.value.sidebar, page.value.relativePath).length > 0,
);
const hasAside = computed(() => frontmatter.value.aside !== false);
const hasEditLink = computed(
  () => frontmatter.value.editLink !== false && !!theme.value.editLink,
);

const { items, active } = useOutline([2, 2]);

const drawerOpen = ref(false);
const outlineOpen = ref(false);
const locked = useBodyScrollLock();

watch(drawerOpen, (value) => {
  locked.value = value;
});

watch(
  () => route.path,
  () => {
    drawerOpen.value = false;
    outlineOpen.value = false;
  },
);

onKeyStroke('Escape', () => {
  drawerOpen.value = false;
  outlineOpen.value = false;
});
</script>

<template>
  <div
    v-if="hasSidebar || (hasAside && items.length)"
    class="docs-local-nav"
  >
    <button
      v-if="hasSidebar"
      type="button"
      class="docs-local-nav-button"
      :aria-expanded="drawerOpen"
      @click="drawerOpen = true"
    >
      <AlignLeft :size="16" :stroke-width="1.8" aria-hidden="true" />
      Menu
    </button>
    <span v-else></span>
    <button
      v-if="hasAside && items.length"
      type="button"
      class="docs-local-nav-button"
      :aria-expanded="outlineOpen"
      @click="outlineOpen = !outlineOpen"
    >
      On this page
      <ChevronDown :size="14" aria-hidden="true" />
    </button>
    <div v-show="outlineOpen" class="docs-local-nav-outline">
      <DocsOutline
        :items="items"
        :active="active"
        @navigate="outlineOpen = false"
      />
    </div>
  </div>

  <div
    class="docs-shell"
    :class="{ 'has-sidebar': hasSidebar, 'has-aside': hasAside }"
  >
    <div
      v-if="hasSidebar"
      class="docs-sidebar"
      :class="{ 'is-open': drawerOpen }"
    >
      <div class="docs-sidebar-inner">
        <button
          type="button"
          class="docs-sidebar-close"
          aria-label="Close menu"
          @click="drawerOpen = false"
        >
          <X :size="20" :stroke-width="1.8" aria-hidden="true" />
        </button>
        <DocsSidebar />
      </div>
    </div>
    <div
      v-if="hasSidebar && drawerOpen"
      class="docs-sidebar-backdrop"
      @click="drawerOpen = false"
    ></div>

    <article class="docs-article">
      <DocsPageHeader />
      <Content class="vp-doc" />
      <footer class="docs-article-footer">
        <DocsEditLink v-if="hasEditLink" />
        <DocsPager />
      </footer>
    </article>

    <div v-if="hasAside" class="docs-aside">
      <div class="docs-aside-inner">
        <DocsOutline :items="items" :active="active" />
        <ThemeSponsor :logo-height="40" class="docs-aside-sponsor" />
      </div>
    </div>

    <ThemeFooter class="docs-shell-footer" />
  </div>
</template>

<style lang="scss" scoped>
.docs-shell {
  display: grid;
  grid-template-columns: minmax(0, 720px);
  justify-content: center;
  align-items: start;
  --docs-shell-pad: 40px;

  /* Two rows: the page, then its footer. The navigation column spans both. */
  grid-template-rows: auto auto;
  gap: 48px;
  max-width: var(--db-container);
  margin: 0 auto;
  padding: var(--docs-shell-pad) var(--db-gutter) 0;

  &.has-aside {
    grid-template-columns: minmax(0, 720px) 200px;
  }

  &.has-sidebar {
    grid-template-columns: 260px minmax(0, 720px);
    justify-content: space-between;
  }

  &.has-sidebar.has-aside {
    grid-template-columns: 260px minmax(0, 720px) 200px;
  }
}

/* Every cell is placed by hand. An item that spans rows, as the navigation
   does, would otherwise push the ones after it into the wrong column. */
.docs-article {
  grid-column: 1;
  grid-row: 1;
}

.docs-aside {
  grid-column: 2;
  grid-row: 1;
  align-self: stretch;
}

/* The footer sits in the content column, the way the article does. */
.docs-shell-footer {
  grid-column: 1 / -1;
  grid-row: 2;
  margin-top: 120px;
}

/* The hairline sets the navigation apart from the article. The column spans
   the footer row as well, so the navigation runs down the whole page instead
   of stopping above it. */
.docs-sidebar {
  grid-column: 1;
  grid-row: 1 / -1;
  align-self: stretch;
  padding-right: 28px;
  border-right: 1px solid var(--db-line);
}

.docs-shell.has-sidebar {
  > .docs-article {
    grid-column: 2;
  }

  > .docs-aside {
    grid-column: 3;
  }

  > .docs-shell-footer {
    grid-column: 2 / -1;
  }
}

/* The box inside a column is what sticks, so its travel ends with its own
   column: the navigation runs past the footer, the outline stops at the end
   of the article. Both use the whole window below the header, and the space
   above the first line is padding inside the scroll box, so nothing moves
   once a box sticks. */
.docs-sidebar-inner,
.docs-aside-inner {
  position: sticky;
  top: var(--db-header-h);
  margin-top: calc(-1 * var(--docs-shell-pad));
  max-height: calc(100vh - var(--db-header-h));
  max-height: calc(100dvh - var(--db-header-h));
  padding: 44px 0 40px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
}

.docs-sidebar-close,
.docs-sidebar-backdrop,
.docs-local-nav {
  display: none;
}

.docs-article {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.docs-article-footer {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 62px;
}

.docs-aside-sponsor {
  margin-top: 40px;
}

@media (max-width: 1279px) {
  .docs-shell.has-sidebar.has-aside {
    grid-template-columns: 260px minmax(0, 720px);
  }

  .docs-shell.has-aside:not(.has-sidebar) {
    grid-template-columns: minmax(0, 720px);
  }

  .docs-aside {
    display: none;
  }
}

@media (max-width: 959px) {
  .docs-shell,
  .docs-shell.has-sidebar,
  .docs-shell.has-sidebar.has-aside {
    --docs-shell-pad: 24px;

    grid-template-columns: minmax(0, 1fr);
  }

  .docs-shell-footer,
  .docs-shell.has-sidebar > .docs-shell-footer {
    grid-column: 1 / -1;
    margin-top: 56px;
  }

  .docs-local-nav {
    position: sticky;
    top: var(--db-header-h);
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 0 var(--db-gutter);
    border-bottom: 1px solid var(--db-line);
    background: var(--db-paper);
  }

  .docs-local-nav-button {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    font-size: 14px;
    font-weight: 500;
    color: var(--db-ink-2);
  }

  .docs-local-nav-outline {
    position: absolute;
    top: 100%;
    right: var(--db-gutter);
    left: var(--db-gutter);
    max-height: 60vh;
    padding: 16px;
    border: 1px solid var(--db-line);
    border-radius: var(--db-radius-3);
    background: var(--db-paper);
    box-shadow: var(--db-shadow-pop);
    overflow-y: auto;
  }

  .docs-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 70;
    grid-row: auto;
    display: none;
    width: min(320px, 86vw);
    padding: 0;
    border-right: 0;
    background: var(--db-paper);
    box-shadow: var(--db-shadow-pop);
    overflow-y: auto;

    &.is-open {
      display: block;
    }
  }

  /* One column, so everything lines up in source order again. */
  .docs-shell,
  .docs-shell.has-sidebar,
  .docs-shell.has-sidebar.has-aside {
    grid-template-rows: none;
  }

  .docs-article,
  .docs-aside,
  .docs-shell-footer,
  .docs-shell.has-sidebar > .docs-article,
  .docs-shell.has-sidebar > .docs-aside,
  .docs-shell.has-sidebar > .docs-shell-footer {
    grid-column: 1;
    grid-row: auto;
  }

  .docs-sidebar-inner {
    position: static;
    max-height: none;
    margin-top: 0;
    padding: 64px 24px 32px;
    overflow: visible;
  }

  .docs-sidebar-close {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--db-radius-2);
    color: var(--db-ink);
  }

  .docs-sidebar-backdrop {
    position: fixed;
    inset: 0;
    z-index: 69;
    display: block;
    background: rgba(11, 22, 32, 0.45);
  }
}
</style>
