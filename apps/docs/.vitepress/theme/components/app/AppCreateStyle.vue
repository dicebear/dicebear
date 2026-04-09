<script setup lang="ts">
import { ref } from 'vue';
import { ArrowRight } from '@lucide/vue';
import { UiButton, UiContainer, UiSection, UiSectionHeader, UiCard } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef);

const steps = [
  {
    title: 'Design in Figma',
    description: 'Create your avatar components visually. Group colors and parts using our simple naming conventions.',
  },
  {
    title: 'Export with Plugin',
    description: 'Use the DiceBear Figma plugin to configure options and export your style as a ready-to-use package.',
  },
  {
    title: 'Build & Use',
    description: 'Run npm install and npm run build. Your custom style is ready to generate avatars.',
  },
];
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-create-style-bg-grid"></div>
      <div class="app-create-style-gradient"></div>
    </template>

    <UiContainer class="app-create-style-container">
      <UiSectionHeader
        badge="For Artists"
        badge-variant="green"
        description="Design your avatar style visually in Figma. Our plugin handles the technical export – no coding required."
      >
        <template #headline>Create Your Own Style<br /><strong>with Figma</strong></template>
      </UiSectionHeader>

      <div class="app-create-style-grid">
        <div class="app-create-style-content">
          <div class="app-create-style-steps">
            <UiCard
              v-for="(step, index) in steps"
              :key="index"
              padding="sm"
              radius="sm"
              class="app-create-style-step-card"
              :style="{ animationDelay: `${index * 0.15}s` }"
            >
              <div class="app-create-style-step-number">{{ index + 1 }}</div>
              <div class="app-create-style-step-content">
                <h3 class="app-create-style-step-title">{{ step.title }}</h3>
                <p class="app-create-style-step-description">{{ step.description }}</p>
              </div>
            </UiCard>
          </div>

          <div class="app-create-style-actions">
            <UiButton href="/guides/create-an-avatar-style-with-figma/">
              Read the Figma Guide
              <ArrowRight :size="20" />
            </UiButton>
            <UiButton href="https://www.figma.com/community/plugin/1005765655729342787" variant="secondary" target="_blank">
              Get the Plugin
              <ArrowRight :size="20" />
            </UiButton>
          </div>
        </div>

        <div class="app-create-style-visual">
          <div class="app-create-style-figma-mockup">
            <div class="app-create-style-figma-sidebar">
              <div class="app-create-style-figma-layers">
                <div class="app-create-style-layer-group">
                  <span class="app-create-style-layer-icon app-create-style-layer-icon-folder"></span>
                  <span>face</span>
                </div>
                <div class="app-create-style-layer-item">
                  <span class="app-create-style-layer-icon app-create-style-layer-icon-component"></span>
                  <span>face/round</span>
                </div>
                <div class="app-create-style-layer-item">
                  <span class="app-create-style-layer-icon app-create-style-layer-icon-component"></span>
                  <span>face/oval</span>
                </div>
                <div class="app-create-style-layer-group">
                  <span class="app-create-style-layer-icon app-create-style-layer-icon-folder"></span>
                  <span>eyes</span>
                </div>
                <div class="app-create-style-layer-item">
                  <span class="app-create-style-layer-icon app-create-style-layer-icon-component"></span>
                  <span>eyes/happy</span>
                </div>
                <div class="app-create-style-layer-item active">
                  <span class="app-create-style-layer-icon app-create-style-layer-icon-component"></span>
                  <span>eyes/wink</span>
                </div>
                <div class="app-create-style-layer-group">
                  <span class="app-create-style-layer-icon app-create-style-layer-icon-folder"></span>
                  <span>mouth</span>
                </div>
                <div class="app-create-style-layer-item">
                  <span class="app-create-style-layer-icon app-create-style-layer-icon-component"></span>
                  <span>mouth/smile</span>
                </div>
              </div>
            </div>
            <div class="app-create-style-figma-canvas">
              <div class="app-create-style-canvas-avatar">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="28" fill="#FFD93D"/>
                  <circle cx="22" cy="28" r="4" fill="#1a1a2e"/>
                  <path d="M38 26 L42 30 L38 34" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20 42 Q32 52 44 42" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round" fill="none"/>
                </svg>
              </div>
              <div class="app-create-style-canvas-guides">
                <div class="app-create-style-guide app-create-style-guide-h"></div>
                <div class="app-create-style-guide app-create-style-guide-v"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-create-style {
  &-bg-grid {
    background-image:
      linear-gradient(var(--vp-c-border) 1px, transparent 1px),
      linear-gradient(90deg, var(--vp-c-border) 1px, transparent 1px);
    background-size: 60px 60px;
    background-repeat: repeat !important;
    opacity: 0.3;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent);
  }

  &-gradient {
    background: radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--vp-c-green-1) 8%, transparent), transparent);
  }

  &-container {
    opacity: 0;
    transform: translateY(40px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: start;
  }

  &-content {
    display: flex;
    flex-direction: column;
  }

  &-steps {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
  }

  &-step-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    opacity: 0;
    transform: translateX(-20px);

    .visible & {
      animation: reveal-up 0.6s var(--ease-smooth) forwards;
    }
  }

  &-step-number {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-2);
    font-size: 13px;
    font-weight: 700;
    border-radius: 50%;
    border: 1px solid var(--vp-c-border);
  }

  &-step-content {
    flex: 1;
    min-width: 0;
  }

  &-step-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 0 8px;
  }

  &-step-description {
    font-size: 14px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.6;
  }

  &-actions {
    display: flex;
    gap: 12px;
  }

  /* Figma Mockup Visual */
  &-visual {
    display: flex;
    justify-content: flex-end;
  }

  &-figma-mockup {
    display: flex;
    width: 100%;
    max-width: 520px;
    height: 420px;
    background: #2c2c2c;
    border-radius: var(--vp-radius-sm);
    overflow: hidden;
    box-shadow: var(--vp-shadow-5);
  }

  &-figma-sidebar {
    width: 180px;
    background: #1e1e1e;
    border-right: 1px solid #3c3c3c;
    padding: 16px 0;
    overflow: hidden;
  }

  &-figma-layers {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12px;
    font-family: var(--vp-font-family-mono);
  }

  &-layer-group,
  &-layer-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    color: #b3b3b3;
    white-space: nowrap;
  }

  &-layer-group {
    color: #e0e0e0;
    font-weight: 500;
  }

  &-layer-item {
    padding-left: 28px;

    &.active {
      background: rgba(24, 160, 251, 0.2);
      color: #18a0fb;
    }
  }

  &-layer-icon {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;

    &-folder {
      background: #f5a623;
    }

    &-component {
      background: #a259ff;
    }
  }

  &-figma-canvas {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background:
      linear-gradient(90deg, #3c3c3c 1px, transparent 1px),
      linear-gradient(#3c3c3c 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: center center;
  }

  &-canvas-avatar {
    width: 160px;
    height: 160px;
    background: white;
    border-radius: var(--vp-radius-sm);
    padding: 20px;
    box-shadow: var(--vp-shadow-4);
    position: relative;
    z-index: 1;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &-canvas-guides {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &-guide {
    position: absolute;
    background: rgba(255, 0, 85, 0.5);

    &-h {
      left: 0;
      right: 0;
      top: 50%;
      height: 1px;
    }

    &-v {
      top: 0;
      bottom: 0;
      left: 50%;
      width: 1px;
    }
  }
}
@media (max-width: 960px) {
  .app-create-style {
    &-grid {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    &-actions {
      justify-content: center;
    }

    &-visual {
      justify-content: center;
    }

    &-figma-mockup {
      max-width: 480px;
    }
  }
}

@media (max-width: 640px) {
  .app-create-style {
    &-actions {
      flex-direction: column;
      align-items: stretch;
    }

    &-figma-mockup {
      height: 320px;
    }

    &-figma-sidebar {
      width: 140px;
    }

    &-canvas-avatar {
      width: 120px;
      height: 120px;
    }

    &-layer-group,
    &-layer-item {
      font-size: 10px;
      padding: 6px 8px;
    }

    &-layer-item {
      padding-left: 20px;
    }
  }
}
</style>
