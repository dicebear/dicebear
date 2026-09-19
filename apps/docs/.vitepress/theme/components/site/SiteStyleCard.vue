<script setup lang="ts">
/**
 * The card at the top of a style page: one large avatar and the two actions
 * a style has, the playground and the definition file to download.
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
      class="site-style-card-avatar"
      :style-name="styleName"
      :options="{ seed }"
      :size="358"
      :radius="18"
      :lazy="false"
      :alt="`${styleName} avatar for the seed ${seed}`"
    />
    <div class="site-style-card-actions">
      <a
        :href="playgroundUrl"
        class="site-btn site-btn-sm site-btn-primary site-btn-fluid"
        @click="onPlayground"
      >
        Playground
      </a>
      <button
        v-if="definitionUrl"
        type="button"
        class="site-btn site-btn-sm site-btn-secondary site-btn-fluid"
        :disabled="pending"
        @click="download"
      >
        <Download :size="16" />
        Definition
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-style-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--db-line);
  border-radius: var(--db-radius-6);
  background: var(--db-panel);

  /* The checkerboard shows where the style leaves the background empty. It
     lies on the tile color, which stays light in dark mode, so line work in
     black ink stays visible. */
  &-avatar {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 1;
    background:
      repeating-conic-gradient(
          rgba(11, 22, 32, 0.02) 0% 25%,
          rgba(11, 22, 32, 0.07) 0% 50%
        )
        50% / 12px 12px,
      var(--db-tile);
  }

  /* Two equal columns, whatever the button widths. The buttons are fluid
     as well, so they fill their column even if this rule is not applied. */
  &-actions {
    display: flex;
    gap: 10px;

    > * {
      flex: 1 1 0;
      min-width: 0;
      height: 40px;
      padding: 0 16px;
      white-space: nowrap;
    }
  }
}
</style>
