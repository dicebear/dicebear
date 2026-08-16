<script setup lang="ts">
/**
 * One preset in the gallery grid: a row of avatars over the preset's name.
 * Every tile draws the same seeds, so the rows stay comparable across the
 * grid, and everything else about a preset lives in the dialog this opens.
 *
 * The avatars keep gaps and their own corners rather than butting together
 * into one strip. A seamless row only holds up while a preset paints every
 * avatar the same background: a preset that varies the background turns into
 * hard color seams, and one that crops to a circle leaves its avatars visibly
 * stuck to each other. Separated avatars survive both, and a gallery that is
 * meant to grow cannot assume anything about the next preset's palette.
 */
import { computed } from 'vue';
import type { StylePreset } from '@theme/config/presets';
import { UiAvatar } from '../ui';

const props = withDefaults(
  defineProps<{
    styleName: string;
    preset: StylePreset;
    seeds: readonly string[];
    /**
     * The gallery opens a dialog on click; the playground picker applies the
     * preset and closes the dialog it already sits in. Announcing a popup in
     * the second case tells a screen reader the opposite of what happens.
     */
    opensDialog?: boolean;
  }>(),
  { opensDialog: true },
);

defineEmits<{
  open: [];
}>();

// One option set per avatar, held rather than built in the template: an object
// literal there would be a new one on every render, and UiAvatar re-renders its
// SVG whenever that prop changes identity. A grid of tiles re-renders whenever
// the gallery around it does, e.g. when the dialog opens.
const avatarOptions = computed(() =>
  props.seeds.map((seed) => ({ seed, ...props.preset.options })),
);
</script>

<template>
  <button
    type="button"
    class="preset-tile"
    :aria-haspopup="opensDialog ? 'dialog' : undefined"
    @click="$emit('open')"
  >
    <span class="preset-tile-band">
      <UiAvatar
        v-for="options in avatarOptions"
        :key="options.seed"
        :size="72"
        :style-name="styleName"
        :style-options="options"
        mode="library"
        alt=""
      />
    </span>
    <span class="preset-tile-label">
      <span class="preset-tile-name">{{ preset.name }}</span>
      <span class="preset-tile-summary">{{ preset.summary }}</span>
    </span>
  </button>
</template>

<style scoped lang="scss">
.preset-tile {
  display: block;
  width: 100%;
  padding: 0;
  text-align: left;
  /* A bare <button> would otherwise render the label in the browser's own
     button font instead of the page face. */
  font-family: inherit;
  background: var(--ui-card-bg);
  border: 1px solid var(--ui-card-border-color);
  border-radius: var(--ui-card-radius);
  color: var(--vp-c-text-1);
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color var(--duration-fast) var(--ease-smooth),
    box-shadow var(--duration-mid) var(--ease-smooth);

  &:hover {
    border-color: var(--vp-c-brand-1);
    box-shadow: var(--vp-shadow-2);
  }

  &:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 2px;
  }

  &-band {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    padding: 12px 12px 0;

    /* UiAvatar's checkerboard stays. Some presets set no background at all, and
       the chequer is what tells you the avatar is transparent rather than
       white, which is a real difference once you paste it onto your own page. */
    :deep(.ui-avatar) {
      width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
      border-radius: var(--vp-radius-xs);
    }
  }

  &-label {
    display: block;
    padding: 10px 12px 12px;
  }

  &-name {
    display: block;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
  }

  /* Clamped to two lines so one long summary cannot stretch a whole grid row.
     The tiles themselves already line up, because grid items stretch to the
     tallest in their row. A summary that needs a third line is too long for a
     tile anyway, and the full reasoning is one click away. */
  &-summary {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    margin-top: 2px;
    font-size: 12.5px;
    line-height: 1.45;
    color: var(--ui-c-text-muted);
  }
}
</style>
