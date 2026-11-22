<script setup lang="ts">
/**
 * The aside of a style page head: one large sticker and the two actions a
 * style has, the playground and the definition file to download.
 */
import { computed } from 'vue';
import { kebabCase } from 'change-case';
import { Download } from '@lucide/vue';
import { exampleSeeds } from '@theme/config/styleCategories';
import { useDefinitionDownload } from '@theme/composables/useDefinitionDownload';
import { styleLabel, track } from '@theme/utils/track';
import SiteAvatar from './SiteAvatar.vue';

const props = defineProps<{
  styleName: string;
}>();

const seed = exampleSeeds[0];

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
      :options="{ seed }"
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
    width: min(400px, 90%);
    padding: 5%;
    transform: rotate(3deg);
  }

  &-actions {
    justify-content: center;
  }
}
</style>
