<script setup lang="ts">
/**
 * The contrast picker: the saturation and brightness square on the left, the
 * two contrast colors with their ratios and the exact color values on the
 * right.
 */
import { computed, ref } from 'vue';
import { contrastRatio, hsvToHex, luminance } from '@theme/utils/colorSpaces';
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

// The core keeps the first color on a tie.
const picked = computed<'a' | 'b'>(() => {
  const l = luminance(hex.value);
  const ratioA = contrastRatio(luminance(contrastA.value), l);
  const ratioB = contrastRatio(luminance(contrastB.value), l);

  return ratioA >= ratioB ? 'a' : 'b';
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
        <p class="site-text">
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
  grid-template-columns: repeat(auto-fit, minmax(min(380px, 100%), 1fr));
  gap: 40px clamp(32px, 5vw, 80px);
  align-items: start;
  padding-top: clamp(40px, 5vw, 72px);
  padding-bottom: clamp(56px, 6.4vw, 96px);

  &-side {
    display: flex;
    flex-direction: column;
    gap: 28px;
    min-width: 0;
  }

  &-preview {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px 24px;

    .site-text {
      flex: 1 1 220px;
    }
  }

  /* An Initials avatar in miniature, in the face of the site. */
  &-swatch {
    display: flex;
    flex: 0 0 clamp(96px, 10vw, 136px);
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    border-radius: 24%;
    font-family: var(--db-font-display);
    font-size: clamp(34px, 3.8vw, 52px);
    line-height: 1;
    font-weight: 800;
    user-select: none;
  }
}
</style>
