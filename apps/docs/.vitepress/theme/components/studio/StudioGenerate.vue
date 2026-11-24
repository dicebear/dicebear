<script setup lang="ts">
/**
 * The Generate tab: filling selected layers, then three more steps as a
 * small accordion. The screenshot on the right follows the open row and
 * shows the fill when none is open.
 */
import { ref } from 'vue';
import SiteDisclosure from '../site/SiteDisclosure.vue';
import StudioRow from './StudioRow.vue';
import StudioShot from './StudioShot.vue';
import type { StudioShotImage, StudioShotName, StudioTheme } from './types';

interface StudioStep {
  title: string;
  text: string;
  shot: StudioShotImage;
}

const fill: StudioStep = {
  title: 'Fill selected layers',
  text: 'Select the placeholders: rectangles, ellipses, frames or any other shape. Each layer keeps its shape, corners and masks and gets the avatar as an image fill. One undo reverts the whole batch, and a filled layer remembers its style and seed, so you can draw new seeds or switch the style later.',
  shot: {
    name: 'fill',
    alt: 'The Generate tab with five selected layers: Fill 5 selected, seeds from the layer names, and a preview of five Lorelei avatars named Aneka, Felix, Jade, Leo and Mia',
  },
};

const steps: StudioStep[] = [
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
  {
    title: 'Bring your own style',
    text: 'The gallery has a second tab, Library. Upload a definition file there and the style sits next to the collection in every Figma file you open. The plugin shows the license the file names, but it cannot check it.',
    shot: {
      name: 'library',
      alt: 'The Library tab of the style gallery with two uploaded definitions and the Upload definition button',
    },
  },
];

const shots = [fill.shot, ...steps.map((step) => step.shot)];
const open = ref<StudioShotName>();

function toggle(name: StudioShotName, isOpen: boolean) {
  if (isOpen) {
    open.value = name;
  } else if (open.value === name) {
    open.value = undefined;
  }
}

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
      <h3 class="site-heading">{{ fill.title }}</h3>
      <p class="site-body">{{ fill.text }}</p>
      <div
        class="site-disclosures studio-steps"
        @pointerenter="warmUp"
        @focusin="warmUp"
      >
        <SiteDisclosure
          v-for="step in steps"
          :key="step.shot.name"
          name="studio-steps"
          :title="step.title"
          :open="open === step.shot.name"
          @update:open="toggle(step.shot.name, $event)"
        >
          {{ step.text }}
        </SiteDisclosure>
      </div>
    </template>
    <template #shot>
      <StudioShot :images="shots" :current="open ?? 'fill'" :eager="warm" />
    </template>
  </StudioRow>
</template>

<style scoped lang="scss">
.studio-steps {
  margin-top: 10px;
}
</style>
