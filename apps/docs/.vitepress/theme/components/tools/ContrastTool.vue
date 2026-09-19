<script setup lang="ts">
/**
 * The contrast picker: the saturation and brightness square on the left, the
 * two contrast colors with their ratios and the exact color values on the
 * right.
 */
import { computed, ref } from 'vue';
import { Color } from '@dicebear/core';
import { hsvToHex } from '@theme/utils/colorSpaces';
import type { Hsv } from '@theme/utils/colorSpaces';
import ContrastCanvas from './ContrastCanvas.vue';
import ContrastSliders from './ContrastSliders.vue';
import ContrastTargets from './ContrastTargets.vue';

// HSV is the canonical source of truth: storing HEX would collapse the hue
// at S=0 (grays), causing the canvas crosshair to jump to red.
const hsv = ref<Hsv>({ h: 210, s: 68, v: 92 });
const contrastA = ref('#000000');
const contrastB = ref('#ffffff');

const hex = computed(() => hsvToHex(hsv.value));

// sortByContrast keeps the first color on a tie.
const picked = computed<'a' | 'b'>(() => {
  const sorted = Color.sortByContrast(
    [contrastA.value, contrastB.value],
    hex.value,
  );
  return sorted[0] === contrastA.value ? 'a' : 'b';
});

const previewStyle = computed(() => ({
  background: hex.value,
  color: picked.value === 'a' ? contrastA.value : contrastB.value,
}));

function updateHsv(next: Hsv) {
  hsv.value = next;
}
</script>

<template>
  <section class="site-container contrast-tool">
    <ContrastCanvas
      :hsv="hsv"
      :hex="hex"
      :contrast-a="contrastA"
      :contrast-b="contrastB"
      @update:hsv="updateHsv"
    />

    <div class="contrast-tool-side">
      <div class="contrast-tool-preview">
        <span
          class="contrast-tool-swatch"
          :style="previewStyle"
          role="img"
          aria-label="Initials avatar with the picked text color"
          >IR</span
        >
        <p class="contrast-tool-hint">
          Initials uses the same rule: its text color is whichever of black and
          white contrasts more with the background.
        </p>
      </div>

      <ContrastTargets
        :picked-hex="hex"
        :picked="picked"
        :contrast-a="contrastA"
        :contrast-b="contrastB"
        @update:contrast-a="contrastA = $event"
        @update:contrast-b="contrastB = $event"
      />

      <ContrastSliders :hsv="hsv" :hex="hex" @update:hsv="updateHsv" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contrast-tool {
  display: grid;
  grid-template-columns: minmax(0, 560px) minmax(0, 1fr);
  gap: 80px;
  align-items: start;
  padding-top: 64px;
  padding-bottom: 168px;

  &-side {
    display: flex;
    flex-direction: column;
    gap: 40px;
    min-width: 0;
  }

  &-preview {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  &-swatch {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    border-radius: 52px;
    font-size: 96px;
    line-height: 1;
    font-weight: 500;
    user-select: none;
  }

  &-hint {
    margin: 0;
    font-size: 16px;
    line-height: 26px;
    color: var(--db-muted);
  }

  @media (max-width: 1279px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 48px;

    &-swatch {
      width: 144px;
      height: 144px;
      border-radius: 36px;
      font-size: 68px;
    }
  }

  @media (max-width: 959px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 48px;
  }

  @media (max-width: 767px) {
    padding-top: 48px;
    padding-bottom: 96px;

    &-preview {
      gap: 20px;
    }

    &-swatch {
      width: 96px;
      height: 96px;
      border-radius: 24px;
      font-size: 44px;
    }

    &-hint {
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
