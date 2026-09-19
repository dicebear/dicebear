<script setup lang="ts">
/**
 * The two actions of the page, in the head and in the closing block: the
 * plugin in the Figma Community and the guide in the docs.
 */
import { withBase } from 'vitepress';
import { siFigma } from 'simple-icons';
import UiIcon from '@theme/components/ui/UiIcon.vue';
import { STUDIO_GUIDE_PATH, STUDIO_PLUGIN_URL } from './types';

interface StudioAction {
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
  external: boolean;
  icon?: string;
}

const actions: StudioAction[] = [
  {
    text: 'Open in Figma',
    href: STUDIO_PLUGIN_URL,
    variant: 'primary',
    external: true,
    icon: siFigma.path,
  },
  {
    text: 'Read the guide',
    href: withBase(STUDIO_GUIDE_PATH),
    variant: 'secondary',
    external: false,
  },
];
</script>

<template>
  <div class="studio-actions">
    <a
      v-for="action in actions"
      :key="action.text"
      :class="['site-btn', 'site-btn-lg', `site-btn-${action.variant}`]"
      :href="action.href"
      :target="action.external ? '_blank' : undefined"
      :rel="action.external ? 'noopener noreferrer' : undefined"
    >
      <UiIcon
        v-if="action.icon"
        :path="action.icon"
        :size="20"
        aria-hidden="true"
      />
      {{ action.text }}
    </a>
  </div>
</template>

<style scoped lang="scss">
.studio-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
