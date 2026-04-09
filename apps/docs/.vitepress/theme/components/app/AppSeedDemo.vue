<script setup lang="ts">
import { ref, computed } from 'vue';
import { kebabCase, camelCase, capitalCase } from 'change-case';
import { Dice5, ChevronDown, Sparkles } from '@lucide/vue';
import { UiAvatar, UiHeadline, UiDescription, UiBadge, UiContainer, UiSection, UiWindow } from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import { useAvatarStyleList, useAvatarStyleMeta } from '../../composables/avatar';
import { formatLicenseName } from '../../utils/format';
import { safeHttpUrl } from '../../utils/url';
import AppSeedDemoCode from './AppSeedDemoCode.vue';
import AppSeedDemoStylePicker from './AppSeedDemoStylePicker.vue';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef);
const activeStyleIndex = ref(0);
const styleDialogOpen = ref(false);

const avatarStyleList = useAvatarStyleList();
const currentStyle = computed(() => kebabCase(avatarStyleList.value[activeStyleIndex.value] || 'lorelei'));
const currentStyleCamel = computed(() => camelCase(avatarStyleList.value[activeStyleIndex.value] || 'lorelei'));
const currentStyleDisplay = computed(() => capitalCase(avatarStyleList.value[activeStyleIndex.value] || 'lorelei'));
const currentStyleLink = computed(() => `/styles/${currentStyle.value}/`);
const avatarStyleMeta = useAvatarStyleMeta(computed(() => avatarStyleList.value[activeStyleIndex.value] || 'lorelei'));

// Preset seed cards to demonstrate determinism
const seedCards = [
  { name: 'Felix', emoji: 'F' },
  { name: 'Aneka', emoji: 'A' },
  { name: 'Milo', emoji: 'M' },
  { name: 'Luna', emoji: 'L' },
  { name: 'Sophie', emoji: 'S' },
];

const activeSeedIndex = ref<number | null>(0);
const seed = ref(seedCards[0].name);

function selectSeed(index: number) {
  activeSeedIndex.value = index;
  seed.value = seedCards[index].name;
}

function onSeedInput(event: Event) {
  const input = event.target as HTMLInputElement;
  seed.value = input.value;
  // Deselect card if typed seed doesn't match any preset
  const matchIndex = seedCards.findIndex(c => c.name === input.value);
  activeSeedIndex.value = matchIndex >= 0 ? matchIndex : null;
}

const mainAvatarLink = computed(() =>
  `https://api.dicebear.com/10.x/${currentStyle.value}/svg?seed=${encodeURIComponent(seed.value)}`
);

const sourceUrl = computed(() => safeHttpUrl(avatarStyleMeta.value?.source));
const homepageUrl = computed(() => safeHttpUrl(avatarStyleMeta.value?.homepage));
const licenseUrl = computed(() => safeHttpUrl(avatarStyleMeta.value?.license?.url));

const allStyleAvatars = computed(() =>
  avatarStyleList.value.map((style, index) => ({
    index,
    style: kebabCase(style),
    seed: seed.value,
  }))
);

function randomizeSeed() {
  const nextIndex = ((activeSeedIndex.value ?? -1) + 1) % seedCards.length;
  selectSeed(nextIndex);
}

function selectStyle(index: number) {
  activeStyleIndex.value = index;
}
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-seed-demo-glow"></div>
    </template>

    <UiContainer class="app-seed-demo-container">
      <div class="app-seed-demo-header">
        <UiBadge variant="green">
          <Sparkles :size="16" />
          Deterministic Avatars
        </UiBadge>
        <UiHeadline class="app-seed-demo-title">
          Same Seed, Same Avatar.
          <strong>Every Time.</strong>
        </UiHeadline>
        <UiDescription class="app-seed-demo-subtitle">
          Use any string as a seed — usernames, emails, IDs — and DiceBear generates the identical avatar consistently across all platforms.
        </UiDescription>
      </div>

      <!-- Interactive Demo -->
      <div class="app-seed-demo-window-wrapper">
        <UiWindow title="Seed Explorer">
          <div class="app-seed-demo-body">
            <!-- Left: Avatar Showcase -->
            <div class="app-seed-demo-left">
              <div class="app-seed-demo-showcase">
                <div class="app-seed-demo-avatar-stage">
                  <div class="app-seed-demo-avatar-glow"></div>
                  <a :href="mainAvatarLink" target="_blank" rel="noopener"><UiAvatar :style-name="currentStyle" :style-options="{ seed, size: 256 }" alt="Avatar preview" class="app-seed-demo-avatar-main" mode="library" /></a>
                </div>

                <button class="app-seed-demo-style-picker-trigger" @click="styleDialogOpen = true">
                  <span class="app-seed-demo-style-picker-label">Style</span>
                  <span class="app-seed-demo-style-picker-value">{{ currentStyle }}</span>
                  <ChevronDown :size="14" />
                </button>

                <div class="app-seed-demo-seed-display">
                  <span class="app-seed-demo-seed-label">Seed</span>
                  <input
                    class="app-seed-demo-seed-input"
                    :value="seed"
                    @input="onSeedInput"
                    placeholder="Enter a seed…"
                    spellcheck="false"
                    autocomplete="off"
                  />
                  <button class="app-seed-demo-dice-btn" @click="randomizeSeed" title="Next seed">
                    <Dice5 :size="16" />
                  </button>
                </div>
              </div>

              <!-- Seed Cards -->
              <div class="app-seed-demo-seeds">
                <button
                  v-for="(card, index) in seedCards"
                  :key="card.name"
                  class="app-seed-demo-seed-card"
                  :class="{ active: index === activeSeedIndex }"
                  @click="selectSeed(index)"
                >
                  <UiAvatar :style-name="currentStyle" :style-options="{ seed: card.name, size: 96 }" :alt="card.name" class="app-seed-demo-seed-card-avatar" />
                  <span class="app-seed-demo-seed-card-name">{{ card.name }}</span>
                </button>
              </div>
            </div>

            <!-- Right: Code Examples -->
            <AppSeedDemoCode :seed="seed" :style="currentStyle" :style-camel="currentStyleCamel" />
          </div>
        </UiWindow>

        <p class="app-seed-demo-license">
          <a :href="currentStyleLink">{{ currentStyleDisplay }}</a>
          <template v-if="avatarStyleMeta?.creator !== 'DiceBear'">
            <template v-if="avatarStyleMeta?.license?.name !== 'MIT' && avatarStyleMeta?.title">
              is a remix of
            </template>
            <template v-else> is based on </template>
            <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener noreferrer">{{ avatarStyleMeta?.title ?? 'Design' }}</a>
            <template v-else>{{ avatarStyleMeta?.title ?? 'Design' }}</template>
          </template>
          by
          <a v-if="homepageUrl" :href="homepageUrl" target="_blank" rel="noopener noreferrer">{{ avatarStyleMeta?.creator }}</a>
          <template v-else>{{ avatarStyleMeta?.creator }}</template>, licensed under
          <a v-if="licenseUrl" :href="licenseUrl" target="_blank" rel="noopener noreferrer">{{ formatLicenseName(avatarStyleMeta?.license?.name) }}</a>
          <template v-else>{{ formatLicenseName(avatarStyleMeta?.license?.name) }}</template>.
        </p>
      </div>

    </UiContainer>

    <!-- Style Picker Dialog -->
    <AppSeedDemoStylePicker
      v-model:open="styleDialogOpen"
      :avatars="allStyleAvatars"
      :active-style-index="activeStyleIndex"
      @select-style="selectStyle"
    />
  </UiSection>
</template>

<style lang="scss">
:root {
  --app-seed-demo-avatar-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  --app-seed-demo-card-avatar-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.dark {
  --app-seed-demo-avatar-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  --app-seed-demo-card-avatar-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>

<style lang="scss" scoped>
.app-seed-demo {
  &-glow {
    background:
      radial-gradient(ellipse 60% 60% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent), transparent),
      radial-gradient(ellipse 50% 40% at 20% 80%, color-mix(in srgb, var(--vp-c-green-1) 6%, transparent), transparent),
      radial-gradient(ellipse 50% 40% at 80% 60%, color-mix(in srgb, var(--vp-c-purple-1) 5%, transparent), transparent);
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

  /* Header */
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

  /* License */
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

  /* Demo Window */
  &-window-wrapper {
    --window-radius: 20px;
  }

  /* Style Picker & Seed Input: same width */
  &-style-picker-trigger,
  &-seed-display {
    width: 220px;
  }

  &-style-picker-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 42px;
    padding: 0 10px 0 14px;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: var(--vp-radius-xs);
    cursor: pointer;
    transition: all var(--duration-fast) ease;
    font-size: 14px;

    &:hover {
      border-color: var(--vp-c-text-3);
    }

    svg {
      color: var(--vp-c-text-3);
    }
  }

  &-style-picker-label {
    color: var(--vp-c-text-3);
    font-weight: 400;
    margin-right: -2px;
  }

  &-style-picker-value {
    color: var(--vp-c-text-1);
    font-weight: 500;
    flex: 1;
    text-align: left;
  }

  /* Body: horizontal split */
  &-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 420px;
  }

  &-left {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &-showcase {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px 40px;
    gap: 10px;
    background:
      radial-gradient(ellipse 70% 60% at 50% 40%, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent);
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
    background: radial-gradient(circle, color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent), transparent 70%);
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

  &-seed-display {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 42px;
    padding: 0 6px 0 14px;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: calc(var(--vp-radius-sm) - 2px);
    transition: border-color var(--duration-fast) var(--ease-smooth);

    &:hover {
      border-color: var(--vp-c-text-3);
    }

    &:focus-within {
      border-color: var(--vp-c-brand-1);
    }
  }

  &-seed-label {
    color: var(--vp-c-text-3);
    font-size: 14px;
    font-weight: 400;
  }

  &-seed-input {
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-1);
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    flex: 1;
    min-width: 0;

    &::placeholder {
      color: var(--vp-c-text-3);
      font-weight: 400;
    }
  }

  &-dice-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: var(--vp-radius-xs);
    border: none;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-3);
    cursor: pointer;
    transition: all var(--duration-mid) var(--ease-spring);

    &:hover {
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-brand-1);
      transform: rotate(90deg);
    }

    &:active {
      transform: rotate(180deg) scale(0.9);
    }
  }

  /* Seed Cards */
  &-seeds {
    display: flex;
    gap: 8px;
    padding: 8px;
    background: var(--vp-c-bg-soft);
    border-top: 1px solid var(--vp-c-border);
  }

  &-seed-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 4px;
    border: none;
    border-radius: var(--vp-radius-sm);
    background: transparent;
    cursor: pointer;
    transition: all var(--duration-mid) var(--ease-spring);

    &:hover {
      background: var(--vp-c-bg);

      .app-seed-demo-seed-card-name {
        color: var(--vp-c-text-1);
      }
    }

    &.active {
      background: var(--vp-c-brand-soft);

      .app-seed-demo-seed-card-avatar {
        transform: scale(1.1);
      }

      .app-seed-demo-seed-card-name {
        color: var(--vp-c-brand-1);
      }
    }

    &-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--vp-radius-sm);
      border: 2px solid transparent;
      transition: all var(--duration-fast) var(--ease-smooth);
      box-shadow: var(--app-seed-demo-card-avatar-shadow);
    }

    &-name {
      font-size: 11px;
      font-weight: 600;
      color: var(--vp-c-text-3);
      transition: color var(--duration-fast) ease;
    }
  }
}

@keyframes app-seed-demo-glow-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
}

/* Responsive */
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

    &-seed-card-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--vp-radius-xs);
    }

    &-seed-card {
      padding: 10px 4px;
    }

    &-seed-card-name {
      font-size: 10px;
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

    &-seeds {
      gap: 0;
      padding: 4px;
    }

    &-seed-card {
      padding: 8px 2px;
      gap: 4px;
    }

    &-seed-card-avatar {
      width: 30px;
      height: 30px;
      border-radius: var(--vp-radius-xs);
    }
  }
}
</style>
