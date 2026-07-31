<script setup lang="ts">
import { computed } from 'vue';
import { kebabCase } from 'change-case';
import { UiAvatar, UiDemoFrame } from '../ui';

const props = defineProps<{
  styleName: string;
}>();

// Seeds chosen to maximize visual variety in the preview row. Picked by
// fingerprinting candidate seeds against the dylan style (the hardest case: its
// default palette has only 3 backgrounds + 2 skin tones) and balancing
// background, hair color and skin tone; ordered so no two neighbors repeat a
// background or hair color and skin alternates. Verified distinct across other
// styles too (lorelei, avataaars, bottts, …).
const seeds = [
  'Jasper',
  'Aiden',
  'Nadia',
  'Isla',
  'Kai',
  'Bianca',
  'Riley',
  'Dante',
];

const playgroundUrl = computed(
  () => `/playground?style=${kebabCase(props.styleName)}`,
);
</script>

<template>
  <UiDemoFrame :playground-url="playgroundUrl">
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
