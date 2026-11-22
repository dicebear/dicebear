<script setup lang="ts">
/**
 * The two contrast colors as hairline rows: a color input, the contrast ratio
 * against the picked color with its WCAG levels (filled when passed), and a
 * line under the one DiceBear picks.
 */
import { computed } from 'vue';
import { contrastRatio, luminance } from '@theme/utils/colorSpaces';

const props = defineProps<{
  pickedHex: string;
  picked: 'a' | 'b';
  contrastA: string;
  contrastB: string;
}>();

const emit = defineEmits<{
  'update:contrastA': [hex: string];
  'update:contrastB': [hex: string];
}>();

// WCAG 2.1 minimum ratios for normal text.
const levels = [
  { name: 'AA', min: 4.5 },
  { name: 'AAA', min: 7 },
];

const pickedLuminance = computed(() => luminance(props.pickedHex));

function ratioFor(hex: string): number {
  return contrastRatio(luminance(hex), pickedLuminance.value);
}

const targets = computed(() =>
  [
    { id: 'a' as const, label: 'Contrast color 1', value: props.contrastA },
    { id: 'b' as const, label: 'Contrast color 2', value: props.contrastB },
  ].map((target) => {
    const ratio = ratioFor(target.value);

    return {
      ...target,
      ratio: `${ratio.toFixed(2)}:1`,
      levels: levels.map((level) => ({
        name: level.name,
        passed: ratio >= level.min,
      })),
    };
  }),
);

function emitUpdate(id: 'a' | 'b', value: string) {
  if (id === 'a') emit('update:contrastA', value);
  else emit('update:contrastB', value);
}
</script>

<template>
  <div class="site-rows contrast-targets">
    <div
      v-for="target in targets"
      :key="target.id"
      class="site-row contrast-target"
    >
      <input
        :id="`contrast-${target.id}`"
        type="color"
        :value="target.value"
        class="site-swatch"
        @input="
          emitUpdate(target.id, ($event.target as HTMLInputElement).value)
        "
      />
      <span class="contrast-target-copy">
        <label :for="`contrast-${target.id}`" class="site-control">{{
          target.label
        }}</label>
        <span class="site-mono">{{ target.value }}</span>
      </span>
      <span class="site-heading contrast-target-ratio">{{ target.ratio }}</span>
      <span class="contrast-target-levels">
        <span
          v-for="level in target.levels"
          :key="level.name"
          class="site-tag"
          :class="level.passed ? 'site-tag-solid' : 'site-tag-outline'"
        >
          {{ level.name }}
          <span class="sr-only">{{ level.passed ? 'passed' : 'failed' }}</span>
        </span>
      </span>
      <span
        class="site-title contrast-target-pick"
        :class="{ 'is-hidden': picked !== target.id }"
        :aria-hidden="picked !== target.id"
        >DiceBear picks this</span
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contrast-target {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;

  &-copy {
    display: flex;
    flex: 1 1 130px;
    flex-direction: column;
    min-width: 0;

    .site-mono {
      color: var(--db-ink-2);
    }
  }

  &-ratio {
    font-variant-numeric: tabular-nums;
  }

  &-levels {
    display: flex;
    gap: 6px;
  }

  /* Hidden instead of removed, so the row keeps its height when the pick
     moves to the other color. */
  &-pick {
    flex: 1 0 100%;
    font-size: 15px;
    line-height: 22px;

    &.is-hidden {
      visibility: hidden;
    }
  }
}
</style>
