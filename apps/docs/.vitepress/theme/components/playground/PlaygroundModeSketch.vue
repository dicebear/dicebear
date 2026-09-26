<script setup lang="ts">
/**
 * A small drawing of a view's layout: where the avatar sits and what lies
 * around it. The shapes come from data rather than markup, so the drawing
 * stays one component for all three views.
 */
import { computed } from 'vue';
import type { PlaygroundMode } from '@theme/stores/playground';

const props = defineProps<{
  mode: PlaygroundMode;
  /** The chosen view draws its avatar and one part in the brand color. */
  active?: boolean;
}>();

type Shape =
  | {
      tag: 'rect';
      x: number;
      y: number;
      width: number;
      height: number;
      kind: string;
    }
  | { tag: 'circle'; cx: number; cy: number; r: number; kind: string }
  | { tag: 'line'; x1: number; y1: number; x2: number; y2: number };

const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
  kind = 'part',
): Shape => ({ tag: 'rect', x, y, width, height, kind });

const divider = (x1: number, y1: number, x2: number, y2: number): Shape => ({
  tag: 'line',
  x1,
  y1,
  x2,
  y2,
});

const SKETCHES: Record<PlaygroundMode, Shape[]> = {
  // The avatar on top, a row of tiles under it.
  editor: [
    { tag: 'circle', cx: 36, cy: 15, r: 6, kind: 'avatar' },
    divider(4, 26, 68, 26),
    rect(9, 30, 8, 8),
    rect(19, 30, 8, 8),
    rect(29, 30, 8, 8, 'pick'),
    rect(39, 30, 8, 8),
    rect(49, 30, 8, 8),
    rect(59, 30, 5, 8),
  ],
  // The avatar with its seed, the looks in a column on the right.
  simple: [
    { tag: 'circle', cx: 24, cy: 21, r: 8, kind: 'avatar' },
    rect(15, 33, 18, 4),
    divider(46, 4, 46, 44),
    rect(50, 9, 6, 6, 'pick'),
    rect(58, 9, 6, 6),
    rect(50, 17, 6, 6),
    rect(58, 17, 6, 6),
    rect(50, 27, 14, 3),
    rect(50, 33, 14, 3),
  ],
  // A list on the left, the avatar, the inspector on the right.
  advanced: [
    divider(20, 4, 20, 44),
    rect(8, 10, 9, 3, 'pick'),
    rect(8, 16, 9, 3),
    rect(8, 22, 9, 3),
    rect(8, 28, 9, 3),
    { tag: 'circle', cx: 36, cy: 22, r: 7, kind: 'avatar' },
    divider(52, 4, 52, 44),
    rect(56, 10, 9, 3),
    rect(56, 16, 9, 6),
    rect(56, 25, 9, 3),
    rect(56, 31, 9, 6),
  ],
};

const shapes = computed(() =>
  SKETCHES[props.mode].map((shape) => {
    const { tag, ...rest } = shape;
    const kind = 'kind' in rest ? rest.kind : 'line';
    const attrs = Object.fromEntries(
      Object.entries(rest).filter(([key]) => key !== 'kind'),
    );

    return { tag, attrs, kind };
  }),
);
</script>

<template>
  <svg
    class="pg-sketch"
    :class="{ 'is-active': active }"
    viewBox="0 0 72 48"
    aria-hidden="true"
  >
    <rect class="pg-sketch-frame" x="4" y="4" width="64" height="40" rx="4" />
    <component
      :is="shape.tag"
      v-for="(shape, index) in shapes"
      :key="index"
      v-bind="shape.attrs"
      :class="`pg-sketch-${shape.kind}`"
      :rx="shape.tag === 'rect' ? 1.5 : undefined"
    />
  </svg>
</template>

<style scoped lang="scss">
.pg-sketch {
  display: block;
  flex-shrink: 0;
  border-radius: 6px;
  background: var(--db-soft);

  &-frame {
    fill: var(--db-paper);
    stroke: var(--db-field-border);
  }

  &-line {
    stroke: var(--db-line);
  }

  &-avatar {
    fill: var(--db-hover-border);
  }

  &-part,
  &-pick {
    fill: var(--db-field-border);
  }

  &.is-active &-frame {
    stroke: var(--db-brand);
  }

  &.is-active &-avatar {
    fill: var(--db-brand);
  }

  &.is-active &-pick {
    fill: color-mix(in srgb, var(--db-brand) 50%, transparent);
  }
}
</style>
