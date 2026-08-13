<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    values: number[];
    width?: number;
    height?: number;
  }>(),
  { width: 96, height: 28 },
);

// Keeps the stroke and the end dot inside the viewBox.
const PAD = 3;

// The scale runs from zero to the series' own peak. A min-to-max scale
// would blow every wiggle up to the full height and make a noisy small
// style look as dramatic as a real climb; anchored at zero, the amplitude
// reflects the change relative to the style's own level, so the shapes of
// different rows can be compared.
const coords = computed(() => {
  const { values, width, height } = props;

  if (values.length < 2) {
    return [];
  }

  const max = Math.max(...values) || 1;
  const stepX = (width - PAD * 2) / (values.length - 1);

  return values.map((value, index) => ({
    x: PAD + index * stepX,
    y: height - PAD - (value / max) * (height - PAD * 2),
  }));
});

const points = computed(() =>
  coords.value.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
);

const last = computed(() => coords.value[coords.value.length - 1] ?? null);
</script>

<template>
  <svg
    class="app-stats-sparkline"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    aria-hidden="true"
  >
    <polyline
      :points="points"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle
      v-if="last"
      :cx="last.x"
      :cy="last.y"
      r="2.25"
      fill="currentColor"
    />
  </svg>
</template>

<style lang="scss" scoped>
.app-stats-sparkline {
  display: block;
}
</style>
