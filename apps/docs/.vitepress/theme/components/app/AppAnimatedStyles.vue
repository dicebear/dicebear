<script setup lang="ts">
import { ref, computed } from 'vue';
import { useData } from 'vitepress';
import { capitalCase } from 'change-case';
import { ArrowRight, Shapes } from '@lucide/vue';
import Button from 'primevue/button';
import type { ThemeOptions } from '@theme/types';
import { UiAvatar, UiContainer, UiSection, UiSectionHeader } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.1 });

const { theme } = useData<ThemeOptions>();

// Seeds cycled through the grid for visual variety, reused from the style
// preview row where they were fingerprinted for distinct results.
const SEEDS = [
  'Jasper',
  'Aiden',
  'Nadia',
  'Isla',
  'Kai',
  'Bianca',
  'Riley',
  'Dante',
];

const animatedStyles = computed(() =>
  Object.entries(theme.value.avatarStyles)
    .filter(([, style]) => style.animated)
    .map(([slug], index) => ({
      slug,
      displayName: capitalCase(slug),
      seed: SEEDS[index % SEEDS.length],
    })),
);
</script>

<template>
  <UiSection
    id="animated-styles"
    ref="sectionRef"
    :class="{ visible: isVisible }"
    divider
  >
    <template #background>
      <div class="app-animated-styles-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-animated-styles-header"
        description="Every avatar below is a live SVG playing its own looping CSS animation. Click a style to see its options."
      >
        <template #headline>
          <strong>{{ animatedStyles.length }}</strong> Animated Styles
        </template>
      </UiSectionHeader>

      <div class="app-animated-styles-grid">
        <a
          v-for="(style, index) in animatedStyles"
          :key="style.slug"
          :href="`/styles/${style.slug}/`"
          class="app-animated-styles-item"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="app-animated-styles-avatar">
            <UiAvatar
              :size="116"
              :style-name="style.slug"
              :style-options="{
                seed: style.seed,
                size: 120,
                animationVariant: 'medium',
              }"
              :alt="`Animated ${style.displayName} avatar`"
            />
          </div>
          <span class="app-animated-styles-label">{{ style.displayName }}</span>
        </a>
      </div>

      <div class="app-animated-styles-cta">
        <Button as="a" href="/styles/" size="large" severity="contrast">
          <Shapes :size="20" />
          Browse All Styles
          <ArrowRight :size="20" />
        </Button>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-animated-styles {
  &-gradient {
    background:
      radial-gradient(
        ellipse 60% 80% at 0% 50%,
        color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
        transparent
      ),
      radial-gradient(
        ellipse 60% 80% at 100% 50%,
        color-mix(in srgb, var(--vp-c-indigo-1) 5%, transparent),
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

  &-grid {
    display: grid;
    /* Four columns so the 16 animated styles fill four even rows. Revisit the
       count when a new animated style ships. */
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    justify-items: center;
  }

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    opacity: 0;
    transition: transform var(--duration-mid) var(--ease-spring);

    .visible & {
      animation: reveal-up var(--duration-mid) var(--ease-spring) forwards;
    }

    &:hover {
      transform: translateY(-4px) scale(1.02);

      .app-animated-styles-avatar {
        box-shadow:
          var(--vp-shadow-5),
          0 0 40px -10px var(--vp-c-brand-1);
      }

      .app-animated-styles-label {
        color: var(--vp-c-brand-1);
      }
    }

    &::after {
      display: none !important;
    }
  }

  &-avatar {
    width: 116px;
    height: 116px;
    border-radius: var(--vp-radius-xl);
    overflow: hidden;
    background: var(--vp-c-bg-soft);
    box-shadow: var(--vp-shadow-3);
    transition: all var(--duration-mid) var(--ease-smooth);

    :deep(.ui-avatar) {
      width: 100%;
      height: 100%;
    }
  }

  &-label {
    font-size: 13px;
    color: var(--vp-c-text-3);
    font-weight: 500;
    max-width: 116px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color var(--duration-mid) ease;
  }

  &-cta {
    text-align: center;
    margin-top: 48px;
  }
}

@media (max-width: 768px) {
  .app-animated-styles {
    &-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    &-avatar {
      width: 88px;
      height: 88px;
      border-radius: var(--vp-radius-md);
    }

    &-label {
      max-width: 88px;
      font-size: 11px;
    }
  }
}

@media (max-width: 480px) {
  .app-animated-styles {
    &-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
