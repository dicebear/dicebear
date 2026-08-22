<script setup lang="ts">
import { ref } from 'vue';
import {
  UiContainer,
  UiSection,
  UiSectionHeader,
  UiIconBox,
  UiCard,
  UiIcon,
} from '../ui';
import {
  Target,
  Palette,
  Shapes,
  Globe,
  Library,
  Terminal,
  SlidersHorizontal,
} from '@lucide/vue';
import { siGithub, siFigma } from 'simple-icons';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { useVisibility } from '../../composables/useVisibility';

const { theme } = useData<ThemeOptions>();

withDefaults(
  defineProps<{
    headline?: string;
    description?: string;
  }>(),
  {
    headline: 'Built for Developers, Loved by Users',
    description:
      'Everything you need to create beautiful, unique avatars for your applications.',
  },
);

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const highlights = [
  // Row 1: the avatars themselves
  {
    icon: Target,
    title: 'Deterministic Avatars',
    description:
      'Same seed always generates the same avatar. Perfect for user profiles and consistent identities.',
    color: '#1689cc',
  },
  {
    icon: Palette,
    title: `${theme.value.styleCount} Avatar Styles`,
    description:
      'Hand-drawn characters from independent artists, plus abstract, pixel art, and geometric designs.',
    color: '#a855f7',
  },
  {
    icon: Shapes,
    title: 'Scalable SVG',
    description:
      'Pure SVG output stays razor-sharp at any size, from tiny favicons to full-screen, and weighs just a few kilobytes.',
    color: '#06b6d4',
  },
  // Row 2: how you generate them
  {
    icon: Globe,
    title: 'Free Avatar API',
    description:
      'Our profile picture API handles millions of daily requests. Global CDN delivers random user avatars in milliseconds.',
    color: '#22c55e',
  },
  {
    // One box for the language libraries (JS / PHP / Python / Rust / Go /
    // Dart / C#).
    // Generic Library icon with no language logos, so the named languages stay
    // pure nominative use with no trademark/logo-modification questions.
    icon: Library,
    title: 'Official Libraries',
    description:
      'JavaScript, PHP, Python, Rust, Go, Dart, and C# share one identical API across every language. The same seed gives the same result, and no data leaves your servers.',
    color: '#f59e0b',
  },
  {
    icon: Terminal,
    title: 'CLI',
    description:
      'Generate avatars directly from the command line. Perfect for batch processing and build pipelines.',
    color: '#64748b',
  },
  // Row 3: design & trust
  {
    iconPath: siFigma.path,
    title: 'Figma Plugin',
    description:
      'Design custom avatar styles in Figma and export them as ready-to-use DiceBear definitions, with no code required.',
    color: 'var(--logo-monochrome)',
  },
  {
    icon: SlidersHorizontal,
    title: 'Fully Customizable',
    description:
      'Colors, accessories, backgrounds, and more. Fine-tune every detail to match your brand.',
    color: '#ec4899',
  },
  {
    iconPath: siGithub.path,
    title: '100% Open Source',
    description:
      'MIT licensed core, transparent development. Contribute, fork, or self-host with confidence.',
    color: 'var(--logo-monochrome)',
  },
];
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-highlights-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader class="app-highlights-header" :description="description">
        <template #headline>
          <slot name="headline">{{ headline }}</slot>
        </template>
      </UiSectionHeader>

      <div class="app-highlights-grid">
        <UiCard
          v-for="(highlight, index) in highlights"
          :key="index"
          padding="xl"
          class="app-highlights-card"
          :style="{
            '--accent-color': highlight.color,
            animationDelay: `${index * 0.1}s`,
          }"
        >
          <UiIconBox
            size="lg"
            :color="highlight.color"
            class="app-highlights-icon-wrapper"
          >
            <UiIcon v-if="highlight.iconPath" :path="highlight.iconPath" />
            <component v-else :is="highlight.icon" />
          </UiIconBox>
          <h3 class="app-highlights-title">{{ highlight.title }}</h3>
          <p class="app-highlights-description">{{ highlight.description }}</p>
        </UiCard>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-highlights {
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
  .app-highlights {
    &-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 640px) {
  .app-highlights {
    &-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
}
</style>
