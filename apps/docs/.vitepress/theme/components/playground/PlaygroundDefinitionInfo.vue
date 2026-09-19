<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ArrowUpRight } from '@lucide/vue';
import useStore from '@theme/stores/playground';
import type { ThemeOptions } from '@theme/types';

const store = useStore();
const { theme } = useData<ThemeOptions>();

const definitionUrl = computed(
  () => theme.value.avatarStyles[store.avatarStyleName]?.definitionUrl,
);

const size = computed(
  () => theme.value.avatarStyleSizes.styles[store.avatarStyleName],
);

const fileName = computed(() => {
  const url = definitionUrl.value;

  if (!url) return null;

  const lastSlash = url.lastIndexOf('/');

  return lastSlash >= 0 ? url.slice(lastSlash + 1) : url;
});

function formatSize(bytes: number): string {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} kB`;

  return `${bytes} B`;
}
</script>

<template>
  <a
    v-if="definitionUrl && fileName"
    :href="definitionUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="pg-def hv-row"
  >
    <span class="pg-def-main">
      <span class="pg-def-name">{{ fileName }}</span>
      <span v-if="size" class="pg-def-size"
        >{{ formatSize(size.gzip) }} gzipped ·
        {{ formatSize(size.raw) }} raw</span
      >
    </span>
    <ArrowUpRight :size="16" class="pg-def-icon hv-chev" aria-hidden="true" />
  </a>
</template>

<style scoped lang="scss">
.pg-def {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--db-ink);
  text-decoration: none;
}

.pg-def-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pg-def-name {
  font-family: var(--db-font-mono);
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
  word-break: break-all;
}

.pg-def-size {
  font-size: 14px;
  line-height: 20px;
  font-variant-numeric: tabular-nums;
  color: var(--db-muted);
}

.pg-def-icon {
  flex-shrink: 0;
  color: var(--db-muted);
}

@media (max-width: 767px) {
  .pg-def-name {
    font-size: 14px;
    line-height: 20px;
  }

  .pg-def-size {
    font-size: 13px;
    line-height: 18px;
  }
}
</style>
