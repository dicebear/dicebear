<script setup lang="ts">
import { ref } from 'vue';
import { Globe, Code, Terminal } from '@lucide/vue';
import { UiContainer, UiSection, UiSectionHeader, UiCard, UiIconBox, UiCode } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const plainCode = {
  js: `import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json';

const style = new Style(lorelei);
const svg = new Avatar(style, {
  seed: 'Mia',
}).toString();`,
  api: `https://api.dicebear.com/10.x/lorelei/svg?seed=Mia`,
  cli: `npx dicebear lorelei --seed "Mia" --format svg`,
};
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-integration-dots"></div>
      <div class="app-integration-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-integration-header"
        badge="Easy to Use"
        description="Choose the integration that works best for your project."
      >
        <template #headline>Integrate in <strong>Minutes</strong></template>
      </UiSectionHeader>

      <!-- JS Library - Featured / Full Width -->
      <div class="app-integration-featured app-integration-item" :style="{ animationDelay: '0s' }">
        <UiCard padding="lg" radius="md" class="app-integration-card app-integration-card-featured">
          <div class="app-integration-featured-layout">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#1689cc">
                <Code />
              </UiIconBox>
              <h3 class="app-integration-title">JS Library</h3>
              <p class="app-integration-description">No data sent externally. Full control over your avatar creation with a simple API.</p>
              <a href="/how-to-use/js-library/" class="app-integration-link">
                Library Documentation &rarr;
              </a>
            </div>

            <UiCode :code="plainCode.js" lang="js" class="app-integration-code-block" />
          </div>
        </UiCard>
      </div>

      <!-- HTTP API & CLI - Side by Side -->
      <div class="app-integration-grid">
        <div class="app-integration-item" :style="{ animationDelay: '0.15s' }">
          <UiCard padding="lg" radius="md" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#22c55e">
                <Globe />
              </UiIconBox>
              <h3 class="app-integration-title">Avatar API</h3>
              <p class="app-integration-description">Free avatar API for profile pictures. Handles millions of requests daily via global CDN.</p>
            </div>

            <UiCode :code="plainCode.api" class="app-integration-code-block" />

            <a href="/how-to-use/http-api/" class="app-integration-link">
              API Documentation &rarr;
            </a>
          </UiCard>
        </div>

        <div class="app-integration-item" :style="{ animationDelay: '0.3s' }">
          <UiCard padding="lg" radius="md" class="app-integration-card">
            <div class="app-integration-card-header">
              <UiIconBox size="lg" color="#a855f7">
                <Terminal />
              </UiIconBox>
              <h3 class="app-integration-title">CLI</h3>
              <p class="app-integration-description">Generate avatars from the command line. Perfect for scripts and automation.</p>
            </div>

            <UiCode :code="plainCode.cli" class="app-integration-code-block" />

            <a href="/how-to-use/cli/" class="app-integration-link">
              CLI Documentation &rarr;
            </a>
          </UiCard>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-integration {
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

  &-header {
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-item {
    opacity: 0;
    transform: translateY(30px);

    .visible & {
      animation: reveal-up 0.6s var(--ease-smooth) forwards;
    }
  }

  /* Featured JS Library card */
  &-featured {
    margin-bottom: 24px;

    &-layout {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 32px;
      align-items: center;
    }
  }

  &-card-featured {
    .app-integration-card-header {
      margin-bottom: 0;
    }

    .app-integration-code-block {
      margin-bottom: 0;
    }

    .app-integration-link {
      display: inline-block;
      margin-top: 24px;
    }
  }

  /* Grid for HTTP API & CLI */
  &-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    > * {
      min-width: 0;
    }
  }

  &-card {
    display: flex;
    flex-direction: column;
    height: 100%;

    &-header {
      margin-bottom: 24px;
    }
  }

  &-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 16px 0 8px;
  }

  &-description {
    font-size: 15px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.6;
  }

  &-code-block {
    flex: 1;
    margin-bottom: 20px;
    min-height: 48px;
  }

  &-link {
    font-size: 14px;
    font-weight: 700;
    color: var(--vp-c-brand-1);
    text-decoration: none;
    transition: all var(--duration-fast) ease;
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &::after {
      display: none !important;
    }

    &:hover {
      color: var(--vp-c-brand-2);
      gap: 8px;
    }
  }
}
@media (max-width: 1000px) {
  .app-integration {
    &-featured-layout {
      grid-template-columns: 1fr;
    }

    &-grid {
      grid-template-columns: 1fr;
      max-width: 500px;
      margin: 0 auto;
    }

    &-featured {
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 24px;
    }
  }
}
</style>
