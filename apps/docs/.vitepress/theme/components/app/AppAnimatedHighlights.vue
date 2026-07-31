<script setup lang="ts">
import { ref } from 'vue';
import {
  UiContainer,
  UiSection,
  UiSectionHeader,
  UiIconBox,
  UiCard,
} from '../ui';
import {
  Accessibility,
  Clapperboard,
  Feather,
  Image,
  Target,
  ToggleLeft,
} from '@lucide/vue';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const highlights = [
  {
    icon: Clapperboard,
    title: 'CSS-Only Animation',
    description:
      'The keyframes live inside the SVG itself. There is nothing to export or encode, and nothing extra to load at runtime.',
    color: '#1689cc',
  },
  {
    icon: Image,
    title: 'Plays in an img Tag',
    description:
      'Browsers run CSS animations in SVG images, so a plain img element or CSS background is enough. You embed animated avatars exactly like static ones.',
    color: '#a855f7',
  },
  {
    icon: Accessibility,
    title: 'Reduced Motion Built In',
    description:
      'Every animation sits behind a prefers-reduced-motion media query. Visitors who turn off motion in their system settings get a static avatar instead.',
    color: '#22c55e',
  },
  {
    icon: ToggleLeft,
    title: 'Off by Default',
    description:
      'Avatars render static unless you request motion, so nothing in an existing integration starts moving just because a style supports animation.',
    color: '#f59e0b',
  },
  {
    icon: Target,
    title: 'Still Deterministic',
    description:
      'The same seed returns the same avatar, animated or not. Changing the speed changes the motion, never the artwork.',
    color: '#06b6d4',
  },
  {
    icon: Feather,
    title: 'A Few Kilobytes',
    description:
      'A looping animated avatar weighs a fraction of a comparable GIF or video and stays sharp at every size, from favicon to full screen.',
    color: '#ec4899',
  },
];
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-animated-highlights-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-animated-highlights-header"
        description="Animated profile pictures usually mean heavy GIFs or video files. DiceBear animates the SVG itself instead."
      >
        <template #headline
          >Motion Without <strong>the Weight</strong></template
        >
      </UiSectionHeader>

      <div class="app-animated-highlights-grid">
        <UiCard
          v-for="(highlight, index) in highlights"
          :key="highlight.title"
          padding="xl"
          class="app-animated-highlights-card"
          :style="{
            '--accent-color': highlight.color,
            animationDelay: `${index * 0.1}s`,
          }"
        >
          <UiIconBox
            size="lg"
            :color="highlight.color"
            class="app-animated-highlights-icon-wrapper"
          >
            <component :is="highlight.icon" />
          </UiIconBox>
          <h3 class="app-animated-highlights-title">{{ highlight.title }}</h3>
          <p class="app-animated-highlights-description">
            {{ highlight.description }}
          </p>
        </UiCard>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-animated-highlights {
  &-gradient {
    background:
      radial-gradient(
        ellipse 50% 50% at 50% 0%,
        color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
        transparent
      ),
      radial-gradient(
        ellipse 50% 50% at 50% 100%,
        color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
        transparent
      );
  }

  &-header {
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-card {
    opacity: 0;
    transform: translateY(30px);

    .visible & {
      animation: reveal-up var(--duration-mid) var(--ease-spring) forwards;
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  &-icon-wrapper {
    margin-bottom: 24px;
  }

  &-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 0 8px;
  }

  &-description {
    font-size: 14px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.6;
  }
}
@media (max-width: 1000px) {
  .app-animated-highlights {
    &-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 640px) {
  .app-animated-highlights {
    &-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
}
</style>
