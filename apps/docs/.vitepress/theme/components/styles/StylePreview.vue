<script setup lang="ts">
import { computed } from 'vue';
import { kebabCase } from 'change-case';
import { Download } from '@lucide/vue';
import { getPreviewRowSeeds } from '@theme/config/previewRowSeeds';
import { useDefinitionDownload } from '@theme/composables/useDefinitionDownload';
import { UiAvatar, UiDemoFrame } from '../ui';

const props = defineProps<{
  styleName: string;
}>();

// Every style has its own row, searched against its own palette. Order matters:
// the initials spell DICEBEAR, which `initial-face` prints outright. Generated
// by scripts/generate-preview-seeds.ts, which documents the scoring.
const seeds = computed(() => getPreviewRowSeeds(props.styleName));

const playgroundUrl = computed(
  () => `/playground?style=${kebabCase(props.styleName)}`,
);

const {
  url: definitionUrl,
  download,
  pending,
} = useDefinitionDownload(() => props.styleName);
</script>

<template>
  <UiDemoFrame :playground-url="playgroundUrl">
    <template #actions>
      <button
        v-if="definitionUrl"
        class="ui-demo-frame-action"
        :disabled="pending"
        title="Download the style definition"
        @click="download"
      >
        <Download :size="14" />
        <span class="ui-demo-frame-action-label">Definition</span>
      </button>
    </template>
    <div class="style-preview">
      <UiAvatar
        v-for="seed in seeds"
        :key="seed"
        :size="72"
        :style-name="styleName"
        :style-options="{ seed }"
        class="style-preview-img"
      />
    </div>
  </UiDemoFrame>
</template>

<style scoped lang="scss">
.style-preview {
  display: grid;
  /* Fill the frame edge-to-edge: as many equal columns as fit (min 72px), each
     stretching to share the width so avatars scale up to use the space instead
     of leaving empty bands. Wraps responsively on narrow viewports. */
  grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
  gap: 8px;
}

/* Let each avatar fill its grid cell, overriding UiAvatar's fixed px size. The
   avatars are vector SVGs, so they stay crisp at any rendered size. */
.style-preview-img.ui-avatar {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
}
</style>
