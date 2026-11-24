<script setup lang="ts">
/**
 * The view of the playground as a segmented control in the toolbar: Simple
 * and Advanced for developers who set up avatars from seeds, the editor for
 * a person designing their own avatar. All three stay in sight, so nobody
 * has to open a menu to learn that there are three. Each segment shows the
 * drawing of its layout and its name; under 1280px, where the bar is short
 * of room, only the drawing, with the name for screen readers and as the
 * tooltip. A phone picks the view in its own bar (PlaygroundAppBar).
 */
import { computed, ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import useStore, { type PlaygroundMode } from '@theme/stores/playground';
import SiteSegmented from '../site/SiteSegmented.vue';
import PlaygroundModeSketch from './PlaygroundModeSketch.vue';

const store = useStore();
const wide = useMediaQuery('(min-width: 1280px)');
const compact = computed(() => !wide.value);

const MODES: { value: PlaygroundMode; label: string; tip: string }[] = [
  { value: 'simple', label: 'Simple', tip: 'Avatars from seeds' },
  { value: 'advanced', label: 'Advanced', tip: 'Every option of the style' },
  { value: 'editor', label: 'Editor', tip: 'Design your own avatar' },
];

const options = computed(() =>
  MODES.map((mode) => ({
    value: mode.value,
    label: mode.label,
    tip: compact.value ? mode.label : mode.tip,
  })),
);

const mode = computed({
  get: () => store.mode,
  set: (next: PlaygroundMode) => store.setMode(next, 'menu'),
});

const root = ref<HTMLElement | null>(null);

defineExpose({
  focus: () =>
    root.value?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus(),
});
</script>

<template>
  <div ref="root" class="pg-mode">
    <SiteSegmented
      v-model="mode"
      :options="options"
      aria-label="View"
      :size="wide ? 'lg' : 'md'"
    >
      <template #option="{ option, chosen }">
        <PlaygroundModeSketch
          :mode="option.value"
          :active="chosen"
          class="pg-mode-sketch"
        />
        <span :class="compact ? 'sr-only' : 'pg-mode-name'">{{
          option.label
        }}</span>
      </template>
    </SiteSegmented>
  </div>
</template>

<style scoped lang="scss">
.pg-mode {
  display: flex;

  :deep(.site-segmented-item) {
    gap: 10px;
  }

  &-sketch {
    width: 33px;
    height: 22px;
  }

  /* The drawings alone, where the bar is short of room. */
  @media (max-width: 1279px) {
    :deep(.site-segmented-item) {
      padding: 0 12px;
    }
  }
}
</style>
