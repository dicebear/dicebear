<script setup lang="ts">
/**
 * Links to the Markdown mirror of the current page.
 *
 * The file it links to is generated in .vitepress/llms.ts, which also decides
 * which pages get one: a page that is only a component mount has nothing to
 * mirror. `llmsRoutes` carries that decision into the theme so the link
 * cannot point at a file that was never written.
 *
 * The link opens in a new tab, which also keeps the VitePress router out of
 * it. The router only ignores a link that carries `target`, `download`, or a
 * file extension it knows, and `md` is not on that list, so a plain link
 * would be routed as a page and served with `.html` appended.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { siMarkdown } from 'simple-icons';
import UiIcon from '@theme/components/ui/UiIcon.vue';
import type { ThemeOptions } from '@theme/types';

const { page, theme } = useData<ThemeOptions>();

const route = computed(
  () =>
    `/${page.value.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '/')}`,
);

const available = computed(() => theme.value.llmsRoutes?.includes(route.value));

const markdownUrl = computed(() => withBase(`${route.value}index.md`));
</script>

<template>
  <a
    v-if="available"
    class="docs-markdown-link"
    :href="markdownUrl"
    target="_blank"
    rel="noopener"
    aria-label="View as Markdown"
  >
    <!-- From Simple Icons rather than Lucide, which has no Markdown icon.
         Shown in place of the label on small screens. -->
    <UiIcon
      class="docs-markdown-link-icon"
      :path="siMarkdown.path"
      :size="20"
      aria-hidden="true"
    />
    <span class="docs-markdown-link-label">View as Markdown</span>
  </a>
</template>

<style lang="scss" scoped>
.docs-markdown-link {
  flex: none;
  color: var(--ui-c-text-muted);
  font-size: 13px;
  text-decoration: none;

  &:hover {
    color: var(--vp-c-brand-1);
    text-decoration: underline;
  }
}

.docs-markdown-link-icon {
  display: none;
}

@media (max-width: 767px) {
  .docs-markdown-link-icon {
    display: block;
  }

  .docs-markdown-link-label {
    display: none;
  }

  // The icon alone is too small a tap target, so grow the hit area without
  // moving anything around it.
  .docs-markdown-link {
    padding: 9px;
    margin: -9px;
  }
}
</style>
