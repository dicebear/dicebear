<script setup lang="ts">
import { ref } from 'vue';
import { UiAvatar } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const gridRef = ref<HTMLElement>();
const isVisible = useVisibility(gridRef, { threshold: 0.1 });

// One tile per animated style family: a creature, a planet, an abstract
// pattern, and a face, so the hero shows the range of motion at a glance.
// Seeds picked by eye for friendly faces and distinct background colors.
const tiles = [
  { styleName: 'critters', seed: 'Aneka' },
  { styleName: 'planets', seed: 'Luna' },
  { styleName: 'loops', seed: 'Felix' },
  { styleName: 'moods', seed: 'Leo' },
];
</script>

<template>
  <div
    ref="gridRef"
    class="app-hero-aside-animated"
    :class="{ visible: isVisible }"
  >
    <div
      v-for="(tile, index) in tiles"
      :key="tile.styleName"
      class="app-hero-aside-animated-tile"
      :style="{ animationDelay: `${index * 0.12}s` }"
    >
      <UiAvatar
        class="app-hero-aside-animated-avatar"
        :size="160"
        :style-name="tile.styleName"
        :style-options="{
          seed: tile.seed,
          size: 160,
          animationVariant: 'medium',
        }"
        mode="library"
        :alt="`Animated ${tile.styleName} avatar`"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-hero-aside-animated {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 340px;
  transform: perspective(800px) rotateY(-8deg) rotateX(4deg);
  transform-style: preserve-3d;

  &-tile {
    border-radius: var(--vp-radius-lg);
    overflow: hidden;
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.08),
      0 1px 3px rgba(0, 0, 0, 0.05);
    opacity: 0;

    .visible & {
      animation: reveal-up 0.5s var(--ease-smooth) forwards;
    }
  }

  &-avatar.ui-avatar {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    border-radius: 0;
  }
}

.dark .app-hero-aside-animated-tile {
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .app-hero-aside-animated {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
