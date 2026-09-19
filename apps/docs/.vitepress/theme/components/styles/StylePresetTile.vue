<script setup lang="ts">
/**
 * One preset in a picker grid: its avatars over the name and the summary.
 * Every tile draws the same seeds, so the tiles stay comparable across the
 * grid. The parent marks the applied preset with `aria-pressed`.
 */
import { computed } from 'vue';
import type { StylePreset } from '@theme/config/presets';
import PlaygroundThumb from '../playground/PlaygroundThumb.vue';

const props = withDefaults(
  defineProps<{
    styleName: string;
    preset: StylePreset;
    seeds: readonly string[];
    /**
     * Whether a click opens a dialog. The playground picker applies the preset
     * and closes the dialog it sits in, and announcing a popup there would
     * tell a screen reader the opposite of what happens.
     */
    opensDialog?: boolean;
  }>(),
  { opensDialog: true },
);

defineEmits<{
  open: [];
}>();

// One option set per avatar, held here. An object literal in the template
// would be a new one on every render, and the thumbnail renders again whenever
// its options change identity.
const avatarOptions = computed(() =>
  props.seeds.map((seed) => ({ seed, ...props.preset.options })),
);
</script>

<template>
  <button
    type="button"
    class="preset-tile hv-tile"
    :aria-haspopup="opensDialog ? 'dialog' : undefined"
    @click="$emit('open')"
  >
    <!-- The checkerboard stays visible where a preset sets no background. -->
    <span
      class="preset-tile-band"
      :style="{ '--preset-tile-columns': Math.max(avatarOptions.length, 1) }"
    >
      <PlaygroundThumb
        v-for="options in avatarOptions"
        :key="options.seed"
        :style-name="styleName"
        :options="options"
      />
    </span>
    <span class="preset-tile-name">{{ preset.name }}</span>
    <span class="preset-tile-summary">{{ preset.summary }}</span>
  </button>
</template>

<style scoped lang="scss">
.preset-tile {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
  min-width: 0;
  padding: 8px 8px 12px;
  border: 1px solid var(--db-line);
  border-radius: 14px;
  background: transparent;
  font: inherit;
  color: var(--db-ink);
  text-align: left;
  cursor: pointer;

  // The ring is drawn inside the border, so the applied preset keeps its size.
  &[aria-pressed='true'] {
    border-color: var(--db-brand);
    box-shadow: inset 0 0 0 1px var(--db-brand);
  }

  &:focus-visible {
    outline: 2px solid var(--db-brand);
    outline-offset: 2px;
  }

  &-band {
    display: grid;
    grid-template-columns: repeat(var(--preset-tile-columns), minmax(0, 1fr));
    gap: 6px;
    width: 100%;
  }

  &-name {
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
  }

  &-summary {
    font-size: 12px;
    line-height: 16px;
    color: var(--db-muted);
  }
}
</style>
