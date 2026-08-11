<script setup lang="ts">
/**
 * Copies the current page as Markdown, for pasting into an assistant.
 *
 * The file it fetches is generated in .vitepress/llms.ts, which also decides
 * which pages get one: a page that is only a component mount has nothing to
 * mirror. `llmsRoutes` carries that decision into the theme so the button
 * cannot offer a file that was never written.
 *
 * The view link opens in a new tab, which also keeps the VitePress router out
 * of it. The router only ignores a link that carries `target`, `download`, or
 * a file extension it knows, and `md` is not on that list, so a plain link
 * would be routed as a page and served with `.html` appended.
 */
import { computed, ref } from 'vue';
import { useData, withBase } from 'vitepress';
import { Check, Copy } from '@lucide/vue';
import copy from 'copy-to-clipboard';
import Button from 'primevue/button';
import { track } from '@theme/utils/track';
import type { ThemeOptions } from '@theme/types';

const { page, theme } = useData<ThemeOptions>();

const route = computed(
  () =>
    `/${page.value.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '/')}`,
);

const available = computed(() => theme.value.llmsRoutes?.includes(route.value));

const markdownUrl = computed(() => withBase(`${route.value}index.md`));

type State = 'idle' | 'loading' | 'copied' | 'failed';

const state = ref<State>('idle');

const label = computed(() => {
  switch (state.value) {
    case 'loading':
      return 'Copying…';
    case 'copied':
      return 'Copied';
    case 'failed':
      return 'Copy failed';
    default:
      return 'Copy as Markdown';
  }
});

async function onClick() {
  state.value = 'loading';

  try {
    const response = await fetch(markdownUrl.value);

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    if (!copy(await response.text())) {
      throw new Error('clipboard');
    }

    state.value = 'copied';
    track('Docs: Copy as Markdown', { page: route.value });
  } catch {
    state.value = 'failed';
  }

  // Long enough to read the confirmation, short enough that the button is
  // back to its normal label before anyone tries to use it again.
  setTimeout(() => (state.value = 'idle'), 2000);
}
</script>

<template>
  <div v-if="available" class="docs-copy-page">
    <a
      class="docs-copy-page-link"
      :href="markdownUrl"
      target="_blank"
      rel="noopener"
      >View as Markdown</a
    >
    <!-- aria-live announces the label change to Copied or Copy failed. -->
    <Button
      size="small"
      severity="secondary"
      outlined
      aria-live="polite"
      :disabled="state === 'loading'"
      :label="label"
      @click="onClick"
    >
      <template #icon>
        <Check v-if="state === 'copied'" :size="14" />
        <Copy v-else :size="14" />
      </template>
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.docs-copy-page {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  // The slot renders outside `.vp-doc`, so nothing else spaces this row from
  // the page title below it.
  margin-bottom: 8px;
}

.docs-copy-page-link {
  color: var(--ui-c-text-muted);
  font-size: 13px;
  text-decoration: none;

  &:hover {
    color: var(--vp-c-brand-1);
    text-decoration: underline;
  }
}

@media (max-width: 767px) {
  .docs-copy-page-link {
    display: none;
  }
}
</style>
