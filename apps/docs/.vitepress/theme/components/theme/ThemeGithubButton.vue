<script setup lang="ts">
/** The star button: the one filled button of the header. */
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
    class="site-btn site-btn-primary theme-github"
    :class="{ 'theme-github-compact': compact }"
    :aria-label="
      stars
        ? `Star DiceBear on GitHub, ${stars} stars`
        : 'Star DiceBear on GitHub'
    "
  >
    <UiIcon :path="siGithub.path" :size="18" aria-hidden="true" />
    <span v-if="!compact">Star</span>
    <span v-if="stars" class="theme-github-count">{{ stars }}</span>
  </a>
</template>

<style lang="scss" scoped>
.theme-github {
  flex-shrink: 0;
}

.theme-github-count {
  padding-left: 8px;
  border-left: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  font-variant-numeric: tabular-nums;
}

.theme-github-compact {
  padding: 0 14px;

  .theme-github-count {
    padding-left: 0;
    border-left: 0;
  }

  /* The narrowest phones have no room for the count beside the logo, the
     search and the menu. It stays in the button's name. */
  @media (max-width: 339px) {
    width: 44px;
    padding: 0;

    .theme-github-count {
      display: none;
    }
  }
}
</style>
