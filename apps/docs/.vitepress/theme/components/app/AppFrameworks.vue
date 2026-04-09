<script setup lang="ts">
import { ref } from 'vue';
import { siReact, siVuedotjs, siAngular, siSvelte } from 'simple-icons';
import { UiContainer, UiSection, UiSectionHeader, UiIconBox, UiIcon } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const frameworks = [
  { name: 'React', icon: siReact.path, href: '/guides/use-the-library-with-react/', color: `#${siReact.hex}` },
  { name: 'Vue', icon: siVuedotjs.path, href: '/guides/use-the-library-with-vue/', color: `#${siVuedotjs.hex}` },
  { name: 'Angular', icon: siAngular.path, href: '/guides/use-the-library-with-angular/', color: '#dd0031' },
  { name: 'Svelte', icon: siSvelte.path, href: '/guides/use-the-library-with-svelte/', color: `#${siSvelte.hex}` },
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
        badge="Framework Support"
        description="Use DiceBear with React, Vue, Svelte, Angular and more. Simply use our HTTP-API as image source or install the JS-library."
      >
        <template #headline>Works with Your <strong>Favorite</strong> Framework</template>
      </UiSectionHeader>

      <div class="app-frameworks-grid">
        <a
          v-for="(framework, index) in frameworks"
          :key="framework.name"
          :href="framework.href"
          class="app-frameworks-item"
          :style="{ '--framework-color': framework.color, animationDelay: `${index * 0.1}s` }"
        >
          <UiIconBox size="lg" :color="framework.color">
            <UiIcon :path="framework.icon" />
          </UiIconBox>
          <span class="app-frameworks-name">{{ framework.name }}</span>
        </a>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss">
:root {
  --app-frameworks-item-border: rgba(0, 0, 0, 0.08);
}
.dark {
  --app-frameworks-item-border: rgba(255, 255, 255, 0.08);
}
</style>

<style lang="scss" scoped>
.app-frameworks {
  &-dots {
    background-image: radial-gradient(circle, var(--vp-c-text-3) 1px, transparent 1px);
    background-size: 32px 32px;
    background-repeat: repeat !important;
    opacity: 0.2;
    mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
    -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);
  }

  &-gradient {
    background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent);
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    padding: 28px 36px;
    min-width: 150px;
    border-radius: var(--vp-radius-lg);
    background: var(--vp-c-bg-elv);
    border: 1px solid var(--app-frameworks-item-border);
    transition: all var(--duration-mid) var(--ease-spring);
    opacity: 0;
    transform: translateY(20px);

    .visible & {
      animation: reveal-up var(--duration-mid) var(--ease-spring) forwards;
    }

    &::after {
      display: none !important;
    }

    &:hover {
      transform: translateY(-4px) scale(1.02);
      border-color: var(--framework-color);
      box-shadow:
        var(--vp-shadow-3),
        0 0 0 3px color-mix(in srgb, var(--framework-color) 15%, transparent);
    }
  }

  &-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }
}

</style>
