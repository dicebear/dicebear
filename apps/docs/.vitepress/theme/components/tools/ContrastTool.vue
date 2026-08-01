<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  UiCard,
  UiContainer,
  UiHeadline,
  UiDescription,
} from '@theme/components/ui';
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

function updateHsv(next: Hsv) {
  hsv.value = next;
}
</script>

<template>
  <UiContainer size="sm" class="contrast-tool">
    <header class="contrast-tool-hero">
      <UiHeadline tag="h1"> <strong>WCAG</strong> Contrast Picker </UiHeadline>
      <UiDescription>
        See which of two contrast colors DiceBear picks for any color, using the
        exact WCAG 2.1 algorithm from <code>@dicebear/core</code>.
      </UiDescription>
    </header>

    <UiCard padding="lg" class="contrast-tool-pane contrast-tool-pane-targets">
      <ContrastTargets
        :picked-hex="hex"
        :contrast-a="contrastA"
        :contrast-b="contrastB"
        @update:contrast-a="contrastA = $event"
        @update:contrast-b="contrastB = $event"
      />
    </UiCard>

    <div class="contrast-tool-grid">
      <UiCard padding="lg" class="contrast-tool-pane contrast-tool-pane-canvas">
        <ContrastCanvas
          :hsv="hsv"
          :contrast-a="contrastA"
          :contrast-b="contrastB"
          @update:hsv="updateHsv"
        />
      </UiCard>

      <UiCard padding="lg" class="contrast-tool-pane contrast-tool-pane-form">
        <ContrastSliders :hsv="hsv" :hex="hex" @update:hsv="updateHsv" />

        <p class="contrast-tool-hint">
          The dashed line on the canvas marks where DiceBear's pick switches
          between the two contrast colors. Points above the line favor one
          color; points below favor the other.
        </p>
      </UiCard>
    </div>
  </UiContainer>
</template>

<style lang="scss">
html.dark {
  .contrast-tool-hint {
    background: var(--vp-c-bg);
  }
}
</style>

<style lang="scss" scoped>
.contrast-tool {
  padding-top: 80px;
  padding-bottom: 96px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &-hero {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 24px;

    code {
      background: var(--vp-c-bg-soft);
      padding: 2px 6px;
      border-radius: var(--vp-radius-xs);
      font-size: 0.9em;
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 24px;
    align-items: stretch;
  }

  &-pane {
    :deep(.ui-card-body) {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }

  &-hint {
    margin: auto 0 0;
    padding: 12px 14px;
    background: var(--vp-c-bg-soft);
    border-radius: var(--vp-radius-sm);
    font-size: 12px;
    line-height: 1.55;
    color: var(--ui-c-text-muted);
  }

  @media (max-width: 960px) {
    &-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    padding-top: 32px;

    &-hero {
      margin-bottom: 8px;
    }

    &-pane {
      --ui-card-padding: 20px;
    }
  }
}
</style>
