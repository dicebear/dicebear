<script setup lang="ts">
/**
 * The bar across the top of the playground: the style on the left, above
 * the list whose entries depend on it, undo, redo, reset and a menu for
 * option files at the right edge of the picture, and the menu of views over
 * the right column. On a phone the menu moves next to the style.
 */
import { computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import {
  Ellipsis,
  FileDown,
  FileUp,
  Redo2,
  RotateCcw,
  Undo2,
} from '@lucide/vue';
import useStore from '@theme/stores/playground';
import { track, styleLabel } from '@theme/utils/track';
import SiteMenu, { type SiteMenuItem } from '../site/SiteMenu.vue';
import PlaygroundModePicker from './PlaygroundModePicker.vue';
import PlaygroundStyleSelect from './PlaygroundStyleSelect.vue';

const emit = defineEmits<{
  export: [];
  import: [];
}>();

const store = useStore();

// A phone's bar has no room for the reset button, which moves into the
// menu there.
const phone = useMediaQuery('(max-width: 767px)');

function onReset() {
  track('Playground: Reset', { style: styleLabel(store.avatarStyleName) });
  store.resetOptions();
}

// Something to reset: any option set by hand.
const hasChanges = computed(
  () => Object.keys(store.avatarStyleOptionsWithoutDefaults).length > 0,
);

const menuItems = computed<SiteMenuItem[]>(() => [
  {
    label: 'Export options',
    hint: 'JSON file',
    icon: FileDown,
    command: () => emit('export'),
  },
  { label: 'Import options', icon: FileUp, command: () => emit('import') },
  ...(phone.value
    ? ([
        { separator: true },
        {
          label: 'Reset everything',
          icon: RotateCcw,
          command: onReset,
          disabled: !hasChanges.value,
        },
      ] satisfies SiteMenuItem[])
    : []),
]);
</script>

<template>
  <div class="pg-toolbar">
    <div class="pg-toolbar-inner">
      <div class="pg-toolbar-grid">
        <div class="pg-toolbar-left">
          <PlaygroundStyleSelect class="pg-toolbar-style" />
        </div>

        <div class="pg-toolbar-middle">
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
          <span class="pg-toolbar-divider pg-toolbar-wide" aria-hidden="true" />
          <button
            type="button"
            class="site-btn site-btn-ghost site-btn-icon pg-toolbar-wide"
            aria-label="Reset everything"
            data-tip="Reset everything"
            data-tip-side="bottom"
            :disabled="!hasChanges"
            @click="onReset"
          >
            <RotateCcw :size="18" aria-hidden="true" />
          </button>
          <SiteMenu :items="menuItems" label="More">
            <template #trigger="{ open, toggle }">
              <button
                type="button"
                class="site-btn site-btn-ghost site-btn-icon"
                aria-label="More"
                data-tip="More"
                data-tip-side="bottom"
                aria-haspopup="menu"
                :aria-expanded="open"
                @click="toggle"
              >
                <Ellipsis :size="18" aria-hidden="true" />
              </button>
            </template>
          </SiteMenu>
        </div>

        <div class="pg-toolbar-right">
          <PlaygroundModePicker class="pg-toolbar-view" />
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

  /* The same three columns as the body below: the style over the list, the
     history over the picture, the switch over the column on the right. That
     column keeps its place in both views, so nothing in the bar moves when
     the list comes and goes. */
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

  &-middle,
  &-right {
    justify-content: flex-end;
  }

  &-divider {
    width: 1px;
    height: 22px;
    margin: 0 4px;
    background: var(--db-line);
  }

  /* As wide as the text of the list below, which starts on the same edge.
     The field is one of several roots of its component, so the class
     arrives without this file's scope. */
  &-left :deep(.pg-toolbar-style) {
    width: calc(100% - 24px);
    min-width: 0;
  }

  @media (min-width: 960px) {
    &-inner {
      padding: 0 calc(var(--db-gutter) - 12px);
    }

    /* The buttons end as far before the column's line as its content
       starts after it. */
    &-middle {
      margin-right: -12px;
    }

    /* As wide as the content of the column below. */
    &-right :deep(.pg-toolbar-view) {
      width: calc(100% - 24px);
    }
  }

  @media (max-width: 1279px) {
    &-grid {
      grid-template-columns: 224px minmax(0, 1fr) 324px;
    }
  }

  @media (max-width: 959px) {
    &-grid {
      grid-template-columns: minmax(0, 1fr) auto auto;
      padding: 0;
    }

    &-left :deep(.pg-toolbar-style) {
      width: 100%;
      max-width: 260px;
    }
  }

  /* One row on a phone: the style across the width, the view as a small
     button next to it, then undo, redo and the menu. */
  @media (max-width: 767px) {
    &-grid {
      gap: 4px;
    }

    &-right {
      order: 1;
    }

    &-middle {
      order: 2;
    }

    &-wide {
      display: none;
    }

    &-left :deep(.pg-toolbar-style) {
      max-width: none;
    }
  }
}
</style>
