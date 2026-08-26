<script setup lang="ts">
import { ref, computed } from 'vue';
import { useData } from 'vitepress';
import { capitalCase } from 'change-case';
import { ArrowRight, Shapes } from '@lucide/vue';
import Button from 'primevue/button';
import type { ThemeOptions } from '@theme/types';
import { getPreviewRowSeeds } from '@theme/config/previewRowSeeds';
import { UiAvatar, UiContainer, UiSection, UiSectionHeader } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.1 });

const { theme } = useData<ThemeOptions>();

const animatedStyles = computed(() =>
  Object.entries(theme.value.avatarStyles)
    .filter(([, style]) => style.animated)
    // Each tile draws the seed its own style's preview row put in this slot, so
    // the grid varies down the column while every avatar still comes from a row
    // searched for that style. Walking the slot by index rather than fixing it
    // keeps neighboring tiles off the same letter.
    .map(([slug], index) => ({
      slug,
      displayName: capitalCase(slug),
      seed: getPreviewRowSeeds(slug)[index % 8],
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
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* Five tiles per row, set by capping the width rather than by a column
       count, so a row that does not fill up centers its tiles instead of
       leaving a hole on the right. 900px is 5 x 116px of tile plus 4 x 80px
       of gap. Five divides the animated styles more evenly than six does,
       but nothing breaks at another count. */
    max-width: 900px;
    margin: 0 auto;
    gap: 24px 80px;
  }

  &-item {
    display: flex;
    flex: 0 0 auto;
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
      /* Three 88px tiles and two 32px gaps. */
      max-width: 328px;
      gap: 16px 32px;
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
      max-width: 208px;
    }
  }
}
</style>
