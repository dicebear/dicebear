<script setup lang="ts">
/**
 * The bar of the playground on a phone, in place of the site header and the
 * toolbar: the bear leads home, the style opens its list, the drawing of the
 * view opens the three views with what each is for, and the menu holds what
 * is used less often (how to use outside the editor, reset, option files),
 * the pages of the site and the license. Undo, redo and the download stand on
 * the stage.
 */
import { computed, ref } from 'vue';
import { useData, withBase } from 'vitepress';
import type { DefaultTheme } from 'vitepress';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  Ellipsis,
  FileDown,
  FileUp,
  RotateCcw,
} from '@lucide/vue';
import useStore, { type PlaygroundMode } from '@theme/stores/playground';
import { track, styleLabel } from '@theme/utils/track';
import { legalLinks } from '@theme/config/footer-links';
import SiteDialog from '../site/SiteDialog.vue';
import PlaygroundLicenseText from './PlaygroundLicenseText.vue';
import PlaygroundModeSketch from './PlaygroundModeSketch.vue';
import PlaygroundStyleSelect from './PlaygroundStyleSelect.vue';

const emit = defineEmits<{
  export: [];
  import: [];
  'how-to-use': [];
}>();

const { theme } = useData();
const store = useStore();

const MODES: { value: PlaygroundMode; label: string; description: string }[] = [
  {
    value: 'simple',
    label: 'Simple',
    description:
      'Avatars from seeds: each user name always gets the same avatar. Start from a finished look.',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description:
      'The same seed-based avatars with every option of the style: probabilities, weights, colors and animation.',
  },
  {
    value: 'editor',
    label: 'Editor',
    description:
      'Design your own avatar. Pick each part and color, then download it.',
  },
];

const current = computed(
  () => MODES.find((mode) => mode.value === store.mode) ?? MODES[0],
);

const viewsOpen = ref(false);
const menuOpen = ref(false);

function pickMode(mode: PlaygroundMode) {
  store.setMode(mode, 'menu');
  viewsOpen.value = false;
}

const hasChanges = computed(() => store.canReset);

// Each entry closes the menu first, so a dialog it opens is not stacked on
// the sheet.
function run(action: () => void) {
  menuOpen.value = false;
  action();
}

function reset() {
  track('Playground: Reset', { style: styleLabel(store.avatarStyleName) });
  store.resetOptions();
}

type NavLink = DefaultTheme.NavItemWithLink;

const links = computed(() => [
  { text: 'Home', href: withBase('/') },
  ...((theme.value.nav ?? []) as NavLink[])
    .filter((item) => item.link !== '/playground/')
    .map((item) => ({
      text: item.text,
      href: withBase(typeof item.link === 'string' ? item.link : '/'),
    })),
]);
</script>

<template>
  <div class="pg-appbar">
    <a :href="withBase('/')" class="pg-appbar-home" aria-label="DiceBear home">
      <!-- The mark of the wordmark, in one color: the tile in the mark's
           color, the bear cut out of it. With a single color nothing can
           shine through its rounded corners. -->
      <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="currentColor"
          d="M2 0C0.895637 0.000243231 0 0.895581 0 2V30C0 31.1044 0.895637 31.9998 2 32H19.1187C20.127 32 20.7699 30.9239 20.2804 30.0423C18.9648 27.6728 17.7083 25.5811 16.917 24.6768C14.6623 22.1 4.08154 24.5028 3.74685 16.0962C3.72487 15.5442 4.09608 15.0614 4.62019 14.8867L9.7823 13.1657C10.0841 13.0651 10.3394 12.86 10.5116 12.5925C10.9993 11.8346 12.0883 10.2358 13.084 9.42676C14.026 8.66138 15.5502 7.68769 18.3327 7.241C18.8892 7.15167 19.3312 6.73699 19.6023 6.24285C20.2531 5.05655 21.5433 4.33664 22.9033 4.53223C24.6799 4.78792 25.9026 6.50922 25.6338 8.37695C25.614 8.51463 25.659 8.65455 25.7626 8.74726C26.9469 9.806 28.199 11.2718 29.4383 12.9274C30.2334 13.9896 32 13.4517 32 12.1248V2C32 0.895431 31.1046 0 30 0H2Z"
        />
        <circle
          cx="1.66667"
          cy="1.66667"
          r="1.66667"
          transform="matrix(-1 0 0 1 17.8335 11.167)"
          fill="currentColor"
        />
      </svg>
    </a>

    <PlaygroundStyleSelect class="pg-appbar-style" />

    <button
      type="button"
      class="pg-appbar-view"
      :aria-label="`View: ${current.label}`"
      aria-haspopup="dialog"
      :aria-expanded="viewsOpen"
      @click="viewsOpen = true"
    >
      <PlaygroundModeSketch :mode="current.value" class="pg-appbar-sketch" />
      <ChevronDown :size="16" :stroke-width="2.4" aria-hidden="true" />
    </button>

    <button
      type="button"
      class="site-btn site-btn-ghost site-btn-icon"
      aria-label="Menu"
      aria-haspopup="dialog"
      :aria-expanded="menuOpen"
      @click="menuOpen = true"
    >
      <Ellipsis :size="20" aria-hidden="true" />
    </button>

    <SiteDialog v-model:open="viewsOpen" sheet header="View">
      <div class="pg-appbar-list">
        <button
          v-for="mode in MODES"
          :key="mode.value"
          type="button"
          class="pg-appbar-mode"
          :aria-current="mode.value === current.value ? 'true' : undefined"
          @click="pickMode(mode.value)"
        >
          <PlaygroundModeSketch
            :mode="mode.value"
            :active="mode.value === current.value"
            class="pg-appbar-mode-sketch"
          />
          <span class="pg-appbar-mode-text">
            <span class="pg-appbar-mode-name">{{ mode.label }}</span>
            <span class="pg-appbar-mode-description">{{
              mode.description
            }}</span>
          </span>
          <Check
            v-if="mode.value === current.value"
            :size="18"
            aria-hidden="true"
            class="pg-appbar-mode-check"
          />
        </button>
      </div>
    </SiteDialog>

    <SiteDialog v-model:open="menuOpen" sheet header="Menu">
      <div class="pg-appbar-list">
        <p class="pg-appbar-group">Playground</p>
        <button
          v-if="store.mode !== 'editor'"
          type="button"
          class="pg-appbar-item"
          @click="run(() => emit('how-to-use'))"
        >
          <Code :size="20" aria-hidden="true" />
          <span>How to use</span>
          <span class="pg-appbar-hint">code for this avatar</span>
        </button>
        <button
          type="button"
          class="pg-appbar-item"
          :disabled="!hasChanges"
          @click="run(reset)"
        >
          <RotateCcw :size="20" aria-hidden="true" />
          <span>Reset everything</span>
        </button>
        <button
          type="button"
          class="pg-appbar-item"
          @click="run(() => emit('export'))"
        >
          <FileDown :size="20" aria-hidden="true" />
          <span>Export options</span>
          <span class="pg-appbar-hint">JSON file</span>
        </button>
        <button
          type="button"
          class="pg-appbar-item"
          @click="run(() => emit('import'))"
        >
          <FileUp :size="20" aria-hidden="true" />
          <span>Import options</span>
        </button>

        <p class="pg-appbar-group">DiceBear</p>
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="pg-appbar-item"
        >
          <ChevronRight :size="20" aria-hidden="true" />
          <span>{{ link.text }}</span>
        </a>

        <PlaygroundLicenseText class="pg-appbar-license" />
        <p v-if="legalLinks.length" class="pg-appbar-legal">
          <template v-for="(link, index) in legalLinks" :key="link.href">
            <span v-if="index > 0" aria-hidden="true"> · </span>
            <a
              :href="link.href"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener noreferrer' : undefined"
              >{{ link.label }}</a
            >
          </template>
        </p>
      </div>
    </SiteDialog>
  </div>
</template>

<style scoped lang="scss">
.pg-appbar {
  position: relative;
  z-index: 6;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 60px;
  padding: 0 8px 0 14px;
  border-bottom: 1px solid var(--db-line);
  background: var(--db-paper);

  &-home {
    display: flex;
    flex-shrink: 0;
    border-radius: 4px;
    color: var(--db-mark);

    svg {
      display: block;
    }

    &:focus-visible {
      outline: 2px solid var(--db-focus);
      outline-offset: 2px;
    }
  }

  /* The style takes what the bar has left. The field is one of several
     roots of its component, so the class arrives without this scope. */
  :deep(.pg-appbar-style) {
    flex: 0 1 auto;
    min-width: 0;
    margin-left: 4px;
    margin-right: auto;
  }

  &-view {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 6px;
    height: 44px;
    padding: 0 10px 0 12px;
    border: 0;
    border-radius: 22px;
    background: color-mix(in srgb, var(--db-ink) 7%, transparent);
    color: var(--db-ink);
    cursor: pointer;

    &:hover {
      background: color-mix(in srgb, var(--db-ink) 12%, transparent);
    }

    &:focus-visible {
      outline: 2px solid var(--db-focus);
      outline-offset: 2px;
    }
  }

  &-sketch {
    width: 30px;
    height: 20px;
  }

  &-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 8px 8px;
  }

  &-group {
    margin: 12px 0 4px;
    padding: 0 12px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--db-ink-2);

    &:first-child {
      margin-top: 0;
    }
  }

  /* One row of the menu: icon, label and a quiet hint, 48px for the thumb. */
  &-item {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 48px;
    padding: 0 12px;
    border: 0;
    border-radius: 24px;
    background: transparent;
    font-family: var(--db-font-display);
    font-size: 17px;
    font-weight: 600;
    color: var(--db-ink);
    text-align: left;
    text-decoration: none;
    cursor: pointer;

    > svg {
      flex-shrink: 0;
      color: var(--db-ink-2);
    }

    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--db-ink) 10%, transparent);
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }

    &:focus-visible {
      outline: 2px solid var(--db-focus);
      outline-offset: -2px;
    }
  }

  &-hint {
    margin-left: auto;
    font-family: var(--db-font);
    font-size: 13px;
    font-weight: 400;
    color: var(--db-ink-2);
  }

  &-license {
    margin: 14px 0 0;
    padding: 14px 12px 0;
    border-top: 1px solid var(--db-line);
    font-size: 13px;
    line-height: 19px;
    color: var(--db-ink-2);
  }

  &-legal {
    margin: 8px 0 0;
    padding: 0 12px;
    font-size: 13px;
    line-height: 19px;
    color: var(--db-ink-2);

    a {
      color: var(--db-ink);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  /* A view: its drawing, its name and what it is for. */
  &-mode {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 12px;
    border: 0;
    border-radius: 18px;
    background: transparent;
    color: var(--db-ink);
    text-align: left;
    cursor: pointer;

    &:hover,
    &[aria-current='true'] {
      background: color-mix(in srgb, var(--db-ink) 10%, transparent);
    }

    &:focus-visible {
      outline: 2px solid var(--db-focus);
      outline-offset: -2px;
    }
  }

  &-mode-sketch {
    flex-shrink: 0;
    width: 54px;
    height: 36px;
  }

  &-mode-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  &-mode-name {
    font-family: var(--db-font-display);
    font-size: 17px;
    line-height: 22px;
    font-weight: 700;
  }

  &-mode-description {
    font-size: 14px;
    line-height: 20px;
    color: var(--db-ink-2);
  }

  &-mode-check {
    flex-shrink: 0;
    margin-top: 2px;
  }
}
</style>
