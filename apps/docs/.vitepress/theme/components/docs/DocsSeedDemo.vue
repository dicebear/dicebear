<script setup lang="ts">
/**
 * Interactive seed demo for the quickstart: a text field and a row of
 * avatars that re-render on every keystroke. Rendering happens locally via
 * UiAvatar in library mode, so typing costs no API requests. Each avatar is
 * labeled with its style slug and selectable; the URL line below shows the
 * HTTP API equivalent for the selected style, so clicking a tile visibly
 * swaps one word in the URL.
 */
import { computed, ref } from 'vue';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import UiAvatar from '@theme/components/ui/UiAvatar.vue';
import UiCopyButton from '@theme/components/ui/UiCopyButton.vue';
import UiDemoFrame from '@theme/components/ui/UiDemoFrame.vue';

const props = withDefaults(
  defineProps<{
    styleNames?: string[];
    initialSeed?: string;
  }>(),
  {
    styleNames: () => ['lorelei', 'bottts', 'thumbs', 'pixel-art'],
    initialSeed: 'Alice',
  },
);

const seed = ref(props.initialSeed);
const selectedStyle = ref(props.styleNames[0]);

const apiUrl = computed(() =>
  getAvatarApiUrl(selectedStyle.value, { seed: seed.value }),
);
</script>

<template>
  <UiDemoFrame title="Try it" playground-url="/playground/">
    <div class="docs-seed-demo">
      <label class="docs-seed-demo-label">
        <span>Seed</span>
        <input
          v-model="seed"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="Type anything"
        />
      </label>

      <div class="docs-seed-demo-avatars">
        <button
          v-for="styleName in styleNames"
          :key="styleName"
          type="button"
          class="docs-seed-demo-tile"
          :class="{ 'is-selected': styleName === selectedStyle }"
          :aria-pressed="styleName === selectedStyle"
          @click="selectedStyle = styleName"
        >
          <UiAvatar
            :style-name="styleName"
            :style-options="{ seed }"
            :alt="`${styleName} avatar for the seed ${seed}`"
            mode="library"
          />
          <code>{{ styleName }}</code>
        </button>
      </div>

      <div class="docs-seed-demo-url">
        <code>{{ apiUrl }}</code>
        <UiCopyButton :text="apiUrl" class="docs-seed-demo-copy" />
      </div>
    </div>
  </UiDemoFrame>
</template>

<style lang="scss" scoped>
.docs-seed-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.docs-seed-demo-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-c-text-muted);

  input {
    flex: 1;
    min-width: 0;
    padding: 7px 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: var(--vp-radius-chrome);
    background: var(--vp-c-bg);
    font-family: inherit;
    font-size: 14px;
    color: var(--vp-c-text-1);
    transition: border-color var(--duration-fast) var(--ease-smooth);

    &:hover {
      border-color: var(--vp-c-brand-2);
    }

    &:focus {
      outline: none;
      border-color: var(--vp-c-brand-1);
    }
  }
}

.docs-seed-demo-avatars {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.docs-seed-demo-tile {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 6px 5px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--vp-radius-xs);
  background: var(--vp-c-bg);
  font-family: inherit;
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-smooth);

  &:hover {
    border-color: var(--vp-c-brand-2);
  }

  &.is-selected {
    border-color: var(--vp-c-brand-1);

    code {
      color: var(--vp-c-brand-1);
    }
  }

  .ui-avatar {
    /* A calm surface instead of UiAvatar's transparency checkerboard: the
       demo should show avatars the way an app embeds them, and the pattern
       eats dark styles like lorelei's hair in dark mode. */
    --ui-avatar-bg-1: var(--vp-c-default-soft);
    --ui-avatar-bg-2: var(--vp-c-default-soft);
    overflow: hidden;
    border-radius: calc(var(--vp-radius-xs) - 3px);
  }

  code {
    background: none;
    padding: 0;
    font-size: 11.5px;
    color: var(--ui-c-text-muted);
    transition: color var(--duration-fast) var(--ease-smooth);
  }
}

.docs-seed-demo-url {
  display: flex;
  align-items: center;
  gap: 8px;

  code {
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    padding: 6px 10px;
    border-radius: var(--vp-radius-chrome);
    background: var(--vp-c-bg);
    font-size: 12px;
    white-space: nowrap;
  }
}

.docs-seed-demo-copy {
  display: inline-flex;
  padding: 6px;
  border-radius: var(--vp-radius-chrome);
  color: var(--ui-c-text-muted);
  cursor: pointer;

  &:hover {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
  }
}
</style>
