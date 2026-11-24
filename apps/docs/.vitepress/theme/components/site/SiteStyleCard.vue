<script setup lang="ts">
/**
 * The aside of a style page head: one large sticker, moving if the style
 * can, and the two actions a style has, the playground and the definition
 * file to download. The avatar itself holds still for readers who ask for
 * reduced motion.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import { Download } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import { exampleSeeds } from '@theme/config/styleCategories';
import { useDefinitionDownload } from '@theme/composables/useDefinitionDownload';
import { styleLabel, track } from '@theme/utils/track';
import SiteAvatar from './SiteAvatar.vue';

const props = defineProps<{
  styleName: string;
}>();

const { theme } = useData<ThemeOptions>();

const seed = exampleSeeds[0];

const avatarOptions = computed(() =>
  theme.value.avatarStyles[kebabCase(props.styleName)]?.animated
    ? { seed, animation: true }
    : { seed },
);

const playgroundUrl = computed(
  () => `/playground/?style=${kebabCase(props.styleName)}`,
);

const {
  url: definitionUrl,
  pending,
  download,
} = useDefinitionDownload(() => props.styleName);

function onPlayground() {
  track('Style: Open Playground', { style: styleLabel(props.styleName) });
}
</script>

<template>
  <div class="site-style-card">
    <SiteAvatar
      sticker
      class="site-style-card-avatar"
      :style-name="styleName"
      :options="avatarOptions"
      :lazy="false"
      :alt="`${styleName} avatar for the seed ${seed}`"
    />
    <div class="site-actions site-style-card-actions">
      <a
        :href="playgroundUrl"
        class="site-btn site-btn-primary site-btn-lg"
        @click="onPlayground"
      >
        Playground
      </a>
      <button
        v-if="definitionUrl"
        type="button"
        class="site-btn site-btn-secondary site-btn-lg"
        :disabled="pending"
        @click="download"
      >
        <Download :size="18" aria-hidden="true" />
        Definition
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-style-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  &-avatar {
    --site-sticker-edge: 5%;

    width: min(400px, 90%);
    transform: rotate(3deg);
  }

  &-actions {
    justify-content: center;
  }
}
</style>
