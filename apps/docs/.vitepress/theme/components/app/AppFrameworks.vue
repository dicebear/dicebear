<script setup lang="ts">
import { ref } from 'vue';
import { siReact, siVuedotjs, siAngular, siSvelte } from 'simple-icons';
import {
  UiCard,
  UiContainer,
  UiSection,
  UiSectionHeader,
  UiIconBox,
  UiIcon,
} from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const frameworks = [
  {
    name: 'React',
    icon: siReact.path,
    href: '/integrations/javascript/react/',
    color: `#${siReact.hex}`,
  },
  {
    name: 'Vue',
    icon: siVuedotjs.path,
    href: '/integrations/javascript/vue/',
    color: `#${siVuedotjs.hex}`,
  },
  {
    name: 'Angular',
    icon: siAngular.path,
    href: '/integrations/javascript/angular/',
    // Angular forbids its former (red) logo; black/white are its default
    // variations. simple-icons already ships the current shield shape.
    color: 'var(--logo-monochrome)',
  },
  {
    name: 'Svelte',
    icon: siSvelte.path,
    href: '/integrations/javascript/svelte/',
    color: `#${siSvelte.hex}`,
  },
];
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-frameworks-dots"></div>
      <div class="app-frameworks-gradient"></div>
    </template>
    <UiContainer class="app-frameworks-container">
      <UiSectionHeader
        description="Use DiceBear with React, Vue, Svelte, Angular and more. Simply use our HTTP-API as image source or install the JS-library."
      >
        <template #headline
          >Works with Your <strong>Favorite</strong> Framework</template
        >
      </UiSectionHeader>

      <div class="app-frameworks-grid">
        <UiCard
          v-for="(framework, index) in frameworks"
          :key="framework.name"
          :href="framework.href"
          padding="lg"
          class="app-frameworks-item"
          :style="{
            '--framework-color': framework.color,
            '--ui-card-hover-border-color': framework.color,
            animationDelay: `${index * 0.1}s`,
          }"
        >
          <UiIconBox size="lg" :color="framework.color">
            <UiIcon :path="framework.icon" />
          </UiIconBox>
          <span class="app-frameworks-name">{{ framework.name }}</span>
        </UiCard>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-frameworks {
  &-dots {
    background-image: radial-gradient(
      circle,
      var(--vp-c-text-3) 1px,
      transparent 1px
    );
    background-size: 32px 32px;
    background-repeat: repeat !important;
    opacity: 0.2;
    mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
    -webkit-mask-image: radial-gradient(
      ellipse 70% 50% at 50% 50%,
      black,
      transparent
    );
  }

  &-gradient {
    background: radial-gradient(
      ellipse 80% 60% at 50% 0%,
      color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent),
      transparent
    );
  }

  &-container {
    text-align: center;
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
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
  }

  &-item {
    min-width: 150px;
    opacity: 0;
    transform: translateY(20px);

    :deep(.ui-card-body) {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .visible & {
      animation: reveal-up var(--duration-mid) var(--ease-spring) forwards;
    }
  }

  &-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }
}
</style>
