<script setup lang="ts">
/**
 * The two contrast colors as hairline rows: a color input, the contrast ratio
 * against the picked color with its WCAG levels, and a mark on the one
 * DiceBear picks.
 */
import { computed } from 'vue';
import { Color } from '@dicebear/core';

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

const pickedLuminance = computed(() => Color.luminance(props.pickedHex));

function ratioFor(hex: string): number {
  const l = Color.luminance(hex);
  const lp = pickedLuminance.value;
  return (Math.max(l, lp) + 0.05) / (Math.min(l, lp) + 0.05);
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
  <div class="contrast-targets">
    <div v-for="target in targets" :key="target.id" class="contrast-target">
      <input
        :id="`contrast-${target.id}`"
        type="color"
        :value="target.value"
        class="contrast-target-input hv-border"
        @input="
          emitUpdate(target.id, ($event.target as HTMLInputElement).value)
        "
      />
      <span class="contrast-target-copy">
        <label :for="`contrast-${target.id}`" class="contrast-target-label">{{
          target.label
        }}</label>
        <span class="contrast-target-hex">{{ target.value }}</span>
      </span>
      <span class="contrast-target-result">
        <span class="site-h3 contrast-target-ratio">{{ target.ratio }}</span>
        <span class="contrast-target-levels">
          <span
            v-for="level in target.levels"
            :key="level.name"
            class="site-chip"
            :class="level.passed ? 'site-chip-ok' : 'site-chip-muted'"
          >
            {{ level.name }}
            <span class="sr-only">{{
              level.passed ? 'passed' : 'failed'
            }}</span>
          </span>
        </span>
        <span
          class="contrast-target-pick"
          :class="{ 'is-hidden': picked !== target.id }"
          :aria-hidden="picked !== target.id"
          >DiceBear picks this</span
        >
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contrast-targets {
  border-bottom: 1px solid var(--db-line);
}

.contrast-target {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  padding: 20px 0;
  border-top: 1px solid var(--db-line);

  &-input {
    width: 48px;
    height: 48px;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--db-btn-border);
    border-radius: var(--db-radius-3);
    background: transparent;
    cursor: pointer;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
    }

    &::-moz-color-swatch {
      border: none;
    }
  }

  &-copy {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &-label {
    font-size: 15px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink);
  }

  &-hex {
    font-family: var(--db-font-mono);
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);
  }

  &-result {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  &-ratio {
    font-variant-numeric: tabular-nums;
  }

  &-levels {
    display: flex;
    gap: 6px;
  }

  // Hidden instead of removed, so the row keeps its height when the pick
  // moves to the other color.
  &-pick {
    margin-top: 2px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--db-brand-text);

    &.is-hidden {
      visibility: hidden;
    }
  }

  @media (max-width: 767px) {
    grid-template-columns: 40px minmax(0, 1fr) auto;
    gap: 12px;

    &-input {
      width: 40px;
      height: 40px;
      border-radius: var(--db-radius-2);
    }
  }
}
</style>
