<script setup lang="ts">
import { computed } from 'vue';
import { seriesCoords } from '../../utils/chartGeometry';

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

const coords = computed(() =>
  seriesCoords(props.values, {
    width: props.width,
    height: props.height,
    padX: PAD,
    padTop: PAD,
    padBottom: PAD,
  }),
);

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
