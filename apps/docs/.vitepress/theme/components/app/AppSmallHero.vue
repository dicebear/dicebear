<script setup lang="ts">
import { ref, useSlots, computed } from 'vue';
import { Play, ArrowRight } from '@lucide/vue';
import { UiButton, UiHeadline, UiDescription, UiBadge, UiContainer, UiSection } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

withDefaults(defineProps<{
  badge?: string;
  headline?: string;
  description?: string;
}>(), {
  badge: 'Why DiceBear?',
  headline: 'Avatars That Stand Out',
  description: 'DiceBear is an open source avatar library that lets you generate unique, deterministic profile pictures in no time. Whether you need geometric shapes, cute characters, or pixel art — our privacy-focused SVG avatar library with 30+ styles brings your projects to life.',
});

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.1 });

const slots = useSlots();
const hasAside = computed(() => !!slots.aside);
const hasActions = computed(() => !!slots.actions);
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }">
    <template #background>
      <div class="app-small-hero-gradient"></div>
    </template>
    <UiContainer class="app-small-hero-container" :class="{ 'app-small-hero-container--has-aside': hasAside }">
      <div :class="{ 'app-small-hero-layout': hasAside }">
        <div>
          <UiBadge>{{ badge }}</UiBadge>
          <UiHeadline tag="h1">
            <slot name="headline">{{ headline }}</slot>
          </UiHeadline>
          <UiDescription class="app-small-hero-description">
            <slot name="description">{{ description }}</slot>
          </UiDescription>

          <div v-if="hasActions" class="app-small-hero-actions">
            <slot name="actions" />
          </div>
          <div v-else class="app-small-hero-actions">
            <UiButton href="/playground/" class="app-small-hero-action-btn">
              <Play :size="20" />
              Try Playground
            </UiButton>
            <UiButton href="/styles/" variant="secondary" class="app-small-hero-action-btn">
              Browse Styles
              <ArrowRight :size="20" class="app-small-hero-arrow-icon" />
            </UiButton>
          </div>

          <slot name="below-actions" />
        </div>

        <div v-if="hasAside" class="app-small-hero-aside">
          <slot name="aside" />
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-small-hero {
  &-gradient {
    background:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.12), transparent),
      radial-gradient(ellipse 60% 40% at 80% 50%, rgba(124, 58, 237, 0.08), transparent),
      radial-gradient(ellipse 60% 40% at 20% 80%, rgba(20, 184, 166, 0.06), transparent);

    &::before,
    &::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }

    &::before {
      width: 400px;
      height: 400px;
      top: -10%;
      right: -5%;
      background: radial-gradient(circle, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent) 0%, transparent 70%);
      animation: shape-float 18s ease-in-out infinite;
    }

    &::after {
      width: 300px;
      height: 300px;
      bottom: -5%;
      left: -3%;
      background: radial-gradient(circle, color-mix(in srgb, var(--vp-c-purple-1) 8%, transparent) 0%, transparent 70%);
      animation: shape-float 22s ease-in-out infinite reverse;
    }
  }

  &-container {
    text-align: center;
    opacity: 0;
    transform: translateY(30px);
    animation: fade-up var(--duration-reveal) var(--ease-smooth) both;

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }

    &--has-aside {
      text-align: left;

      .app-small-hero-description {
        margin-inline: 0;
      }

      .app-small-hero-actions {
        justify-content: flex-start;
      }

      .app-small-hero-avatars {
        justify-content: flex-start;
      }
    }
  }

  &-layout {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    align-items: center;

    > :first-child {
      grid-column: 1 / 7;
    }

    > :last-child {
      grid-column: 7 / 13;
    }
  }

  &-aside {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  &-description {
    margin-bottom: 40px;
    max-width: 550px;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.1s both;
  }

  &-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.2s both;
  }

  &-avatars {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.3s both;
  }

  &-avatar {
    width: 72px;
    height: 72px;
    border-radius: var(--vp-radius-md);
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    transition: all var(--duration-mid) var(--ease-spring);

    &::after {
      display: none !important;
    }

    .visible & {
      animation: app-small-hero-avatar-reveal 0.5s var(--ease-spring) forwards;
    }

    &:hover {
      transform: translateY(-8px) scale(1.1);
      box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.2);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
@keyframes app-small-hero-avatar-reveal {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .app-small-hero {
    &-gradient {
      &::before {
        width: 200px;
        height: 200px;
      }

      &::after {
        width: 150px;
        height: 150px;
      }
    }

    &-layout {
      grid-template-columns: 1fr;
      gap: 48px;

      > :first-child,
      > :last-child {
        grid-column: auto;
      }
    }

    &-container--has-aside {
      text-align: center;

      .app-small-hero-description {
        margin-inline: auto;
      }

      .app-small-hero-actions {
        justify-content: center;
      }

      .app-small-hero-avatars {
        justify-content: center;
      }
    }

    &-actions {
      flex-direction: column;
      align-items: center;

      .app-small-hero-action-btn {
        width: 100%;
        max-width: 280px;
      }
    }

    &-avatar {
      width: 56px;
      height: 56px;
      border-radius: var(--vp-radius-sm);
    }
  }
}
</style>
