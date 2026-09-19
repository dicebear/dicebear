<script setup lang="ts">
/**
 * Three steps of the Generate tab share one plugin window: the accordion on
 * the left picks the step, the screenshot on the right follows. One step is
 * always open.
 */
import { ref } from 'vue';
import { ChevronDown } from '@lucide/vue';
import StudioRow from './StudioRow.vue';
import StudioShot from './StudioShot.vue';
import type { StudioShotImage, StudioTheme } from './types';

interface StudioStep {
  title: string;
  text: string;
  shot: StudioShotImage;
}

const steps: StudioStep[] = [
  {
    title: 'Fill selected layers',
    text: 'Select the placeholders: rectangles, ellipses, frames or any other shape. Each layer keeps its shape, corners and masks and gets the avatar as an image fill. One undo reverts the whole batch, and a filled layer remembers its style and seed, so you can draw new seeds or switch the style later.',
    shot: {
      name: 'fill',
      alt: 'The Generate tab with five selected layers: Fill 5 selected, seeds from the layer names, and a preview of five Lorelei avatars named Aneka, Felix, Jade, Leo and Mia',
    },
  },
  {
    title: 'Choose where the seeds come from',
    text: 'The seed decides which avatar a layer gets. Random draws a name per layer. Layer names use the name of each layer, so a placeholder called Felix shows the same face in every mockup. From a list takes one seed per line, Numbered builds them from a prefix and a counter.',
    shot: {
      name: 'seeds',
      alt: 'The seed dropdown of the Generate tab, open, with Random, Layer names, From a list and Numbered',
    },
  },
  {
    title: 'Insert new avatars',
    text: 'With nothing selected, the tab switches to Insert new. Set how many avatars you want, their size, columns and gap, and the plugin inserts them as vector frames, ready to edit, turn into components or export.',
    shot: {
      name: 'insert',
      alt: 'The Generate tab set to Insert new, with six Shapes avatars in the preview and the layout settings',
    },
  },
];

const shots = steps.map((step) => step.shot);
const open = ref(steps[0].shot.name);

// Hidden screenshots load lazily, which for a hidden image means not at all.
// The first pointer or focus on the accordion fetches them for the theme in
// use, so a step change swaps to an image that is already there.
const warm = ref<StudioTheme>();

function warmUp() {
  warm.value ??= document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light';
}
</script>

<template>
  <StudioRow>
    <template #text>
      <div class="studio-steps" @pointerenter="warmUp" @focusin="warmUp">
        <div
          v-for="step in steps"
          :key="step.shot.name"
          class="studio-steps-item"
        >
          <h3 class="site-h3">
            <button
              :id="`studio-step-${step.shot.name}`"
              type="button"
              class="studio-steps-button hv-row"
              :aria-expanded="open === step.shot.name"
              :aria-disabled="open === step.shot.name"
              :aria-controls="`studio-step-${step.shot.name}-panel`"
              @click="open = step.shot.name"
            >
              {{ step.title }}
              <ChevronDown
                class="studio-steps-chev hv-chev"
                :size="22"
                aria-hidden="true"
              />
            </button>
          </h3>
          <p
            v-show="open === step.shot.name"
            :id="`studio-step-${step.shot.name}-panel`"
            class="site-body studio-steps-panel"
            role="region"
            :aria-labelledby="`studio-step-${step.shot.name}`"
          >
            {{ step.text }}
          </p>
        </div>
      </div>
    </template>
    <template #shot>
      <StudioShot :images="shots" :current="open" :eager="warm" />
    </template>
  </StudioRow>
</template>

<style scoped lang="scss">
.studio-steps {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--db-line);

  &-item {
    border-top: 1px solid var(--db-line);
  }

  &-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 24px 0;
    border: 0;
    background: transparent;
    font: inherit;
    letter-spacing: inherit;
    color: var(--db-muted);
    text-align: left;
    cursor: pointer;

    &[aria-expanded='true'] {
      color: var(--db-ink);
      cursor: default;
    }
  }

  &-chev {
    flex-shrink: 0;
    color: var(--db-muted);
    transition: transform var(--duration-fast) var(--ease-smooth);

    [aria-expanded='true'] > & {
      transform: rotate(180deg);
    }
  }

  /* Scoped rules outrank the shared hv-row hover, so it is repeated here. */
  &-button[aria-expanded='false']:hover,
  &-button[aria-expanded='false']:hover &-chev {
    color: var(--db-brand-text);
  }

  &-panel {
    padding-bottom: 28px;
  }

  @media (prefers-reduced-motion: reduce) {
    &-chev {
      transition: none;
    }
  }
}
</style>
