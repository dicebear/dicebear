<script setup lang="ts">
/**
 * The bar across the top of the playground: the menu with everything that
 * concerns the whole setup and the name of the tool on the left, the style
 * as a field in the middle, undo, redo and reset on the right.
 */
import { computed } from 'vue';
import { capitalCase, kebabCase } from 'change-case';
import {
  Code,
  ExternalLink,
  FileDown,
  FileUp,
  Menu,
  Redo2,
  RotateCcw,
  Undo2,
} from '@lucide/vue';
import useStore from '@theme/stores/playground';
import { track, styleLabel } from '@theme/utils/track';
import SiteMenu, { type SiteMenuItem } from '../site/SiteMenu.vue';
import PlaygroundStyleSelect from './PlaygroundStyleSelect.vue';

const emit = defineEmits<{
  export: [];
  import: [];
  'how-to-use': [];
}>();

const store = useStore();

function onReset() {
  track('Playground: Reset', { style: styleLabel(store.avatarStyleName) });
  store.resetOptions();
}

// Something to reset: any option set by hand.
const hasChanges = computed(
  () => Object.keys(store.avatarStyleOptionsWithoutDefaults).length > 0,
);

function openStylePage() {
  window.location.assign(`/styles/${kebabCase(store.avatarStyleName)}/`);
}

const menuItems = computed<SiteMenuItem[]>(() => [
  {
    label: 'Export options',
    hint: 'JSON file',
    icon: FileDown,
    command: () => emit('export'),
  },
  { label: 'Import options', icon: FileUp, command: () => emit('import') },
  { label: 'Reset everything', icon: RotateCcw, command: onReset },
  { separator: true },
  {
    label: 'How to use',
    hint: 'code in 9 languages',
    icon: Code,
    command: () => emit('how-to-use'),
  },
  {
    label: 'Style page',
    hint: store.isCustomStyle ? undefined : capitalCase(store.avatarStyleName),
    icon: ExternalLink,
    command: openStylePage,
    disabled: store.isCustomStyle,
  },
]);
</script>

<template>
  <div class="pg-toolbar">
    <div class="pg-toolbar-inner">
      <div class="pg-toolbar-grid">
        <div class="pg-toolbar-left">
          <SiteMenu :items="menuItems" label="Playground menu">
            <template #trigger="{ open, toggle }">
              <button
                type="button"
                class="site-btn site-btn-secondary site-btn-icon"
                aria-label="Menu"
                aria-haspopup="menu"
                :aria-expanded="open"
                @click="toggle"
              >
                <Menu :size="18" aria-hidden="true" />
              </button>
            </template>
          </SiteMenu>
          <span class="pg-toolbar-title">Playground</span>
        </div>

        <div class="pg-toolbar-middle">
          <PlaygroundStyleSelect class="pg-toolbar-style" />
        </div>

        <div class="pg-toolbar-right">
          <button
            type="button"
            class="site-btn site-btn-ghost site-btn-icon"
            aria-label="Undo"
            data-tip="Undo"
            data-tip-side="bottom"
            :disabled="!store.canUndo"
            @click="store.undo()"
          >
            <Undo2 :size="18" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="site-btn site-btn-ghost site-btn-icon"
            aria-label="Redo"
            data-tip="Redo"
            data-tip-side="bottom"
            :disabled="!store.canRedo"
            @click="store.redo()"
          >
            <Redo2 :size="18" aria-hidden="true" />
          </button>
          <span class="pg-toolbar-divider" aria-hidden="true" />
          <button
            type="button"
            class="site-btn site-btn-ghost site-btn-icon"
            aria-label="Reset everything"
            data-tip="Reset everything"
            data-tip-side="bottom"
            :disabled="!hasChanges"
            @click="onReset"
          >
            <RotateCcw :size="18" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* The toolbar keeps to the container like the header above it, and its
   line runs across the page like the header's. */
.pg-toolbar {
  box-sizing: border-box;
  height: 56px;
  border-bottom: 1px solid var(--db-line);

  &-inner {
    box-sizing: border-box;
    width: 100%;
    max-width: var(--db-container);
    height: 100%;
    margin: 0 auto;
    padding: 0 var(--db-gutter);
  }

  /* The same three columns as the body below, so the style and the preset
     stand centred over the picture, not over the whole bar. */
  &-grid {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr) 360px;
    align-items: center;
    gap: 12px;
    box-sizing: border-box;
    height: 100%;
    padding: 0 12px;
  }

  &-left,
  &-middle,
  &-right {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  &-left {
    gap: 12px;
  }

  &-middle {
    justify-content: center;
    gap: 4px;
  }

  &-right {
    justify-content: flex-end;
  }

  &-title {
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink);
    white-space: nowrap;
  }

  &-divider {
    width: 1px;
    height: 22px;
    margin: 0 4px;
    background: var(--db-line);
  }

  &-style {
    min-width: 0;
  }

  @media (min-width: 960px) {
    &-inner {
      padding: 0 calc(var(--db-gutter) - 12px);
    }
  }

  @media (max-width: 1279px) {
    &-grid {
      grid-template-columns: 224px minmax(0, 1fr) 324px;
    }
  }

  @media (max-width: 959px) {
    &-grid {
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      padding: 0;
    }
  }

  /* One row on a phone: the menu, the style across the width, undo and
     redo. The name makes room for the style. */
  @media (max-width: 767px) {
    &-grid {
      grid-template-columns: auto minmax(0, 1fr) auto;
    }

    &-title {
      display: none;
    }

    &-middle {
      justify-content: stretch;
    }

    &-style {
      width: 100%;
    }
  }
}
</style>
