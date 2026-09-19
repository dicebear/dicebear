<script setup lang="ts">
/** The star button: the one filled control in the header. */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { siGithub } from 'simple-icons';
import UiIcon from '@theme/components/ui/UiIcon.vue';
import type { ThemeOptions } from '@theme/types';

defineProps<{ compact?: boolean }>();

const { theme } = useData<ThemeOptions>();

const stars = computed(
  () => theme.value.githubStars?.['dicebear/dicebear'] ?? '',
);
</script>

<template>
  <a
    href="https://github.com/dicebear/dicebear"
    target="_blank"
    rel="noopener noreferrer"
    class="theme-github hv-primary"
    :class="{ 'theme-github-compact': compact }"
    :aria-label="
      stars ? `Star DiceBear on GitHub, ${stars} stars` : 'Star DiceBear on GitHub'
    "
  >
    <UiIcon :path="siGithub.path" :size="18" aria-hidden="true" />
    <span v-if="!compact">Star</span>
    <span v-if="stars" class="theme-github-count">{{ stars }}</span>
  </a>
</template>

<style lang="scss" scoped>
.theme-github {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border-radius: var(--db-radius-2);
  background: var(--db-btn-bg);
  color: var(--db-btn-fg);
  font-size: 14px;
  line-height: 1;
  font-weight: 600;
  white-space: nowrap;
}

.theme-github-count {
  padding-left: 8px;
  border-left: 1px solid color-mix(in srgb, var(--db-btn-fg) 28%, transparent);
  font-variant-numeric: tabular-nums;
}

.theme-github-compact {
  padding: 0 12px;

  .theme-github-count {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
