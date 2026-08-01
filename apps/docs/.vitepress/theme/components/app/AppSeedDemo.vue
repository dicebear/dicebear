<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { kebabCase, camelCase, capitalCase } from 'change-case';
import { track } from '@theme/utils/track';
import { exampleSeeds } from '@theme/config/styleCategories';
import {
  UiHeadline,
  UiDescription,
  UiContainer,
  UiSection,
  UiWindow,
} from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import {
  useAvatarStyleList,
  useAvatarStyleMeta,
} from '../../composables/avatar';
import { formatLicenseName } from '../../utils/format';
import { safeHttpUrl } from '../../utils/url';
import AppSeedDemoCode from './AppSeedDemoCode.vue';
import AppSeedDemoPreview from './AppSeedDemoPreview.vue';

const DEFAULT_STYLE = 'lorelei';

const RANDOM_SEEDS: readonly string[] = [...exampleSeeds, 'Sophie'];

const sectionRef = ref();
const isVisible = useVisibility(sectionRef);

const avatarStyleList = useAvatarStyleList();
const availableStyles = computed(() =>
  avatarStyleList.value.map((s) => kebabCase(s)),
);
const currentStyle = ref<string>(DEFAULT_STYLE);
const activeStyleName = computed(
  () =>
    avatarStyleList.value.find((s) => kebabCase(s) === currentStyle.value) ??
    DEFAULT_STYLE,
);
const currentStyleCamel = computed(() => camelCase(activeStyleName.value));
const currentStyleDisplay = computed(() => capitalCase(activeStyleName.value));
const currentStyleLink = computed(() => `/styles/${currentStyle.value}/`);
const avatarStyleMeta = useAvatarStyleMeta(activeStyleName);

const seed = ref<string>(RANDOM_SEEDS[0]);

// Never send the seed text itself, only that the user edited it. Debounced so
// typing counts as one interaction.
const trackSeedEdited = useDebounceFn(() => {
  track('Home Demo: Seed Edited', { style: currentStyle.value });
}, 700);

function onSeedUpdate(value: string) {
  seed.value = value;
  trackSeedEdited();
}

function randomizeSeed() {
  const currentIndex = RANDOM_SEEDS.indexOf(seed.value);
  const nextIndex = (currentIndex + 1) % RANDOM_SEEDS.length;
  seed.value = RANDOM_SEEDS[nextIndex];

  track('Home Demo: Seed Randomized', { style: currentStyle.value });
}

watch(currentStyle, (style) => {
  track('Home Demo: Style Selected', { style });
});

const sourceUrl = computed(() => safeHttpUrl(avatarStyleMeta.value?.source));
const homepageUrl = computed(() =>
  safeHttpUrl(avatarStyleMeta.value?.homepage),
);
const licenseUrl = computed(() =>
  safeHttpUrl(avatarStyleMeta.value?.license?.url),
);
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-seed-demo-glow"></div>
    </template>

    <UiContainer class="app-seed-demo-container">
      <div class="app-seed-demo-header">
        <UiHeadline class="app-seed-demo-title">
          Same Seed, Same Avatar.<br />
          <strong>Every Time.</strong>
        </UiHeadline>
        <UiDescription class="app-seed-demo-subtitle">
          Use any string as a seed, such as usernames, emails, or IDs, and
          DiceBear generates the identical avatar consistently across all
          platforms.
        </UiDescription>
      </div>

      <div class="app-seed-demo-window-wrapper">
        <UiWindow title="Seed Explorer">
          <div class="app-seed-demo-body">
            <AppSeedDemoPreview
              v-model:style-name="currentStyle"
              :styles="availableStyles"
              :model-value="seed"
              @update:model-value="onSeedUpdate"
              @randomize-seed="randomizeSeed"
            />

            <AppSeedDemoCode
              :seed="seed"
              :style="currentStyle"
              :style-camel="currentStyleCamel"
            />
          </div>
        </UiWindow>

        <p class="app-seed-demo-license">
          <a :href="currentStyleLink">{{ currentStyleDisplay }}</a>
          <template v-if="avatarStyleMeta?.creator !== 'DiceBear'">
            <template
              v-if="
                avatarStyleMeta?.license?.name !== 'MIT' &&
                avatarStyleMeta?.title
              "
            >
              is a remix of
            </template>
            <template v-else> is based on </template>
            <a
              v-if="sourceUrl"
              :href="sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              >{{ avatarStyleMeta?.title ?? 'Design' }}</a
            >
            <template v-else>{{ avatarStyleMeta?.title ?? 'Design' }}</template>
          </template>
          by
          <a
            v-if="homepageUrl"
            :href="homepageUrl"
            target="_blank"
            rel="noopener noreferrer"
            >{{ avatarStyleMeta?.creator }}</a
          >
          <template v-else>{{ avatarStyleMeta?.creator }}</template
          >, licensed under
          <a
            v-if="licenseUrl"
            :href="licenseUrl"
            target="_blank"
            rel="noopener noreferrer"
            >{{ formatLicenseName(avatarStyleMeta?.license?.name) }}</a
          >
          <template v-else>{{
            formatLicenseName(avatarStyleMeta?.license?.name)
          }}</template
          >.
        </p>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss">
:root {
  --app-seed-demo-avatar-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}
.dark {
  --app-seed-demo-avatar-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.app-seed-demo {
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
      ),
      radial-gradient(
        ellipse 50% 40% at 80% 60%,
        color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent),
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

  &-header {
    text-align: center;
    margin-bottom: 48px;
  }

  &-title {
    --hl-display: block;
  }

  &-subtitle {
    max-width: 540px;
  }

  &-license {
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

  &-control {
    width: 220px;
  }

  &-seed-field {
    .p-inputtext {
      width: 100%;
    }
  }

  &-dice-icon {
    cursor: pointer;
    color: var(--vp-c-text-3);
    transition: color var(--duration-fast) ease;
    outline: none;
    user-select: none;
    -webkit-user-select: none;

    svg {
      transition: transform var(--duration-mid) var(--ease-spring);
    }

    &:hover {
      color: var(--vp-c-brand-1);

      svg {
        transform: rotate(90deg);
      }
    }

    &:active svg {
      transform: rotate(180deg) scale(0.9);
    }

    &:focus-visible {
      color: var(--vp-c-brand-1);
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
    padding: 40px 24px 40px;
    gap: 10px;
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
    animation: app-seed-demo-glow-pulse 3s ease-in-out infinite;
  }

  &-avatar-main {
    width: 148px;
    height: 148px;
    border-radius: var(--vp-radius-xl);
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
    box-shadow: var(--app-seed-demo-avatar-shadow);
    transition: transform var(--duration-mid) var(--ease-smooth);

    &:hover {
      transform: scale(1.05);
    }
  }
}

@keyframes app-seed-demo-glow-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .app-seed-demo {
    &-body {
      grid-template-columns: 1fr;
    }

    &-showcase {
      padding: 32px 16px 24px;
    }

    &-avatar-main {
      width: 88px;
      height: 88px;
      border-radius: var(--vp-radius-md);
    }

    &-avatar-glow {
      width: 110px;
      height: 110px;
    }
  }
}

@media (max-width: 480px) {
  .app-seed-demo {
    &-showcase {
      padding: 24px 12px 20px;
      gap: 16px;
    }

    &-avatar-main {
      width: 80px;
      height: 80px;
      border-radius: var(--vp-radius-md);
    }

    &-avatar-glow {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
