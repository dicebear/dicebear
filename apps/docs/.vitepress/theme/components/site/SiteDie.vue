<script setup lang="ts">
/**
 * One face of a die, the mark of the site. It numbers the sections of a page
 * and leads the rows of an accordion. The body takes the accent of its
 * ground and the pips the ground itself, so it fits any block.
 */
import { computed } from 'vue';

const props = withDefaults(defineProps<{ face: number; size?: number }>(), {
  size: 32,
});

/** Pip positions on a 3 by 3 grid, counted from the top left. */
const FACES: Record<number, number[]> = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const pips = computed(() =>
  (FACES[props.face] ?? FACES[1]).map((cell) => ({
    cx: 13 + (cell % 3) * 11,
    cy: 13 + Math.floor(cell / 3) * 11,
  })),
);
</script>

<template>
  <svg
    class="site-die"
    viewBox="0 0 48 48"
    :width="size"
    :height="size"
    aria-hidden="true"
  >
    <rect width="48" height="48" rx="12" class="site-die-body" />
    <circle
      v-for="(pip, index) in pips"
      :key="index"
      :cx="pip.cx"
      :cy="pip.cy"
      r="4.2"
      class="site-die-pip"
    />
  </svg>
</template>

<style scoped lang="scss">
.site-die {
  display: block;
  flex-shrink: 0;

  &-body {
    fill: var(--db-accent);
  }

  &-pip {
    fill: var(--db-paper);
  }
}
</style>
