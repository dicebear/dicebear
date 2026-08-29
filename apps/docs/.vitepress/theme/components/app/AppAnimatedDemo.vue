<script setup lang="ts">
import { ref, computed } from 'vue';
import { useData } from 'vitepress';
import { camelCase } from 'change-case';
import { ArrowRight } from '@lucide/vue';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import type { ThemeOptions } from '@theme/types';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import {
  UiAvatar,
  UiCode,
  UiContainer,
  UiSection,
  UiSectionHeader,
  UiStyleSelect,
  UiWindow,
} from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const DEMO_SEED = 'Felix';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.1 });

const { theme } = useData<ThemeOptions>();

const animatedStyles = computed(() =>
  Object.entries(theme.value.avatarStyles)
    .filter(([, style]) => style.animated)
    .map(([slug]) => slug),
);

const speeds = ['none', 'slowest', 'slow', 'medium', 'fast', 'fastest'];
const speed = ref('medium');
const styleName = ref('planets');

// "none" is the default, so the option is simply omitted in that case.
const demoOptions = computed(() => ({
  seed: DEMO_SEED,
  ...(speed.value === 'none' ? {} : { animationVariant: speed.value }),
}));

const apiUrl = computed(() =>
  getAvatarApiUrl(styleName.value, demoOptions.value),
);

const jsCode = computed(() => {
  const importName = camelCase(styleName.value);
  const animationLine =
    speed.value === 'none' ? '' : `\n  animationVariant: '${speed.value}',`;

  return `import { Style, Avatar } from '@dicebear/core';
import ${importName} from '@dicebear/styles/${styleName.value}.json' with { type: 'json' };

const style = new Style(${importName});
const svg = new Avatar(style, {
  seed: '${DEMO_SEED}',${animationLine}
}).toString();`;
});
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-animated-demo-glow"></div>
    </template>

    <UiContainer class="app-animated-demo-container">
      <UiSectionHeader
        class="app-animated-demo-header"
        description="Animation is a regular variant option. Pick a speed from slowest to fastest, or leave it out for a static avatar."
      >
        <template #headline>One Option, <strong>Six Speeds</strong></template>
      </UiSectionHeader>

      <div class="app-animated-demo-window-wrapper">
        <UiWindow title="Animation Speed">
          <div class="app-animated-demo-body">
            <div class="app-animated-demo-showcase">
              <div class="app-animated-demo-avatar-stage">
                <div class="app-animated-demo-avatar-glow"></div>
                <UiAvatar
                  :key="`${styleName}-${speed}`"
                  class="app-animated-demo-avatar-main"
                  :size="148"
                  :style-name="styleName"
                  :style-options="{ ...demoOptions, size: 160 }"
                  alt="Animated avatar preview"
                />
              </div>

              <SelectButton
                v-model="speed"
                :options="speeds"
                :allow-empty="false"
                class="app-animated-demo-speeds"
                size="small"
              />

              <UiStyleSelect
                v-model="styleName"
                :styles="animatedStyles"
                :seed="DEMO_SEED"
                class="app-animated-demo-style-select"
              />
            </div>

            <div class="app-animated-demo-code">
              <span class="app-animated-demo-code-label">HTTP API</span>
              <UiCode :code="apiUrl" class="app-animated-demo-code-block" />

              <span class="app-animated-demo-code-label">JavaScript</span>
              <UiCode
                :code="jsCode"
                lang="js"
                class="app-animated-demo-code-block"
              />

              <div class="app-animated-demo-links">
                <Button
                  as="a"
                  href="/integrations/http-api/"
                  severity="secondary"
                  variant="outlined"
                >
                  API Documentation
                  <ArrowRight :size="18" />
                </Button>
                <Button
                  as="a"
                  :href="`/styles/${styleName}/`"
                  severity="secondary"
                  variant="outlined"
                >
                  All Options
                  <ArrowRight :size="18" />
                </Button>
              </div>
            </div>
          </div>
        </UiWindow>

        <p class="app-animated-demo-note">
          For a random speed per avatar, filter variants with
          <a href="/customize/tags/"
            ><code>tags=animation</code></a
          >
          instead.
        </p>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-animated-demo {
  &-glow {
    background:
      radial-gradient(
        ellipse 60% 60% at 50% 0%,
        color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent),
        transparent
      ),
      radial-gradient(
        ellipse 50% 40% at 20% 80%,
        color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
        transparent
      );
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

  &-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 420px;
  }

  &-showcase {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    gap: 20px;
    background: radial-gradient(
      ellipse 70% 60% at 50% 40%,
      color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
      transparent
    );
  }

  &-avatar-stage {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-avatar-glow {
    position: absolute;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent),
      transparent 70%
    );
  }

  &-avatar-main {
    border-radius: var(--vp-radius-xl);
    position: relative;
    z-index: 1;
    box-shadow: var(
      --app-seed-demo-avatar-shadow,
      0 12px 40px rgba(0, 0, 0, 0.12)
    );
  }

  &-speeds {
    flex-wrap: wrap;
    justify-content: center;
  }

  &-style-select {
    width: 220px;
  }

  &-code {
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding: 32px;
    gap: 8px;
    border-left: 1px solid var(--vp-c-divider);

    &-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--vp-c-text-3);
    }

    &-block {
      margin-bottom: 16px;
    }
  }

  &-links {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: auto;
  }

  &-note {
    margin-top: 20px;
    font-size: 13px;
    color: var(--vp-c-text-3);
    text-align: center;

    a {
      color: color-mix(in srgb, var(--vp-c-text-2) 50%, var(--vp-c-text-3));
      font-weight: 400;
      text-decoration: underline;
      text-decoration-style: dotted;
      text-decoration-color: var(--vp-c-border);
      transition: color var(--duration-fast) ease;

      &:hover {
        color: var(--vp-c-brand-1);
      }
    }
  }
}

@media (max-width: 768px) {
  .app-animated-demo {
    &-body {
      grid-template-columns: 1fr;
    }

    &-showcase {
      padding: 32px 16px;
    }

    &-code {
      padding: 24px 16px;
      border-left: none;
      border-top: 1px solid var(--vp-c-divider);
    }
  }
}
</style>
