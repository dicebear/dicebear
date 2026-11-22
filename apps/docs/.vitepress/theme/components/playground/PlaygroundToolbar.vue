<script setup lang="ts">
/**
 * The bar across the top of the playground: the style on the left, above
 * the list whose entries depend on it, undo, redo, reset and a menu for
 * option files at the right edge of the picture, and the menu of views over
 * the right column. On a phone the menu moves next to the style.
 */
import { computed, ref } from 'vue';
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

// A phone's bar has no room for redo and reset, which move into the menu
// there, above the option files. Undo stays in the bar.
const phone = useMediaQuery('(max-width: 767px)');

function onReset() {
  track('Playground: Reset', { style: styleLabel(store.avatarStyleName) });
  store.resetOptions();
}

// Something to reset: any option set by hand.
const hasChanges = computed(
  () => Object.keys(store.avatarStyleOptionsWithoutDefaults).length > 0,
);

const fileItems: SiteMenuItem[] = [
  {
    label: 'Export options',
    hint: 'JSON file',
    icon: FileDown,
    command: () => emit('export'),
  },
  { label: 'Import options', icon: FileUp, command: () => emit('import') },
];

const menuItems = computed<SiteMenuItem[]>(() =>
  phone.value
    ? [
        {
          label: 'Redo',
          icon: Redo2,
          command: () => store.redo(),
          disabled: !store.canRedo,
        },
        {
          label: 'Reset everything',
          icon: RotateCcw,
          command: onReset,
          disabled: !hasChanges.value,
        },
        { separator: true },
        ...fileItems,
      ]
    : fileItems,
);

const modePicker = ref<InstanceType<typeof PlaygroundModePicker> | null>(null);

defineExpose({ focusView: () => modePicker.value?.focus() });
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
            class="site-btn site-btn-ghost site-btn-icon pg-toolbar-wide"
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
          <PlaygroundModePicker ref="modePicker" class="pg-toolbar-view" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* The toolbar keeps to the container like the header above it, and its
   line runs across the page like the header's. It is the title bar of the
   playground: the style as its heading on the left, the history in the
   middle, the three views on the right. */
.pg-toolbar {
  box-sizing: border-box;
  height: 88px;
  /* A line above as well: the bar starts the playground, apart from the
     site's header. */
  border-top: 1px solid var(--db-line);
  border-bottom: 1px solid var(--db-line);

  &-inner {
    box-sizing: border-box;
    width: 100%;
    max-width: var(--db-container);
    height: 100%;
    margin: 0 auto;
    padding: 0 var(--db-wrap);
  }

  &-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 24px;
    box-sizing: border-box;
    height: 100%;
  }

  &-left,
  &-middle,
  &-right {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  &-divider {
    width: 1px;
    height: 22px;
    margin: 0 4px;
    background: var(--db-line);
  }

  @media (max-width: 1279px) {
    &-grid {
      grid-template-columns: minmax(180px, 1fr) auto auto;
      gap: 12px;
    }
  }

  /* Two rows on a phone: the style and the history, then the views across
     the width. */
  @media (max-width: 767px) {
    height: auto;

    &-grid {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px 4px;
      padding: 10px 0 12px;
    }

    &-right {
      grid-column: 1 / -1;
      order: 3;
    }

    &-wide {
      display: none;
    }
  }
}
</style>
