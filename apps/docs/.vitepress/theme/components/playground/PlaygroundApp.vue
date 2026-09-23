<script setup lang="ts">
/**
 * The playground as one screen: the toolbar across the top, the entries on
 * the left, the picture in the middle, the inspector on the right. The
 * dialogs that concern the whole setup live here, so the menu in the toolbar
 * and the button under the inspector open the same ones. A style definition
 * dropped anywhere on the playground becomes a style of one's own.
 */
import { nextTick, provide, ref, watch } from 'vue';
import { Upload } from '@lucide/vue';
import { storeToRefs } from 'pinia';
import { useMediaQuery } from '@vueuse/core';
import { kebabCase } from 'change-case';
import useStore from '@theme/stores/playground';
import { loadStylePreset } from '@theme/config/presets';
import {
  playgroundEntriesKey,
  usePlaygroundEntries,
} from '@theme/composables/usePlaygroundEntries';
import {
  entryKey,
  usePlaygroundSelection,
  type PlaygroundEntry,
} from '@theme/composables/usePlaygroundSelection';
import {
  componentPreviewKey,
  navigateToColorKey,
} from '@theme/components/styles/styleOptionsKeys';
import PlaygroundToolbar from './PlaygroundToolbar.vue';
import PlaygroundEntries from './PlaygroundEntries.vue';
import PlaygroundStage from './PlaygroundStage.vue';
import PlaygroundInspector from './PlaygroundInspector.vue';
import PlaygroundActions from './PlaygroundActions.vue';
import SiteDialog from '@theme/components/site/SiteDialog.vue';
import PlaygroundButtonExport from './PlaygroundButtonExport.vue';
import PlaygroundButtonImport from './PlaygroundButtonImport.vue';
import PlaygroundButtonHowToUse from './PlaygroundButtonHowToUse.vue';
import PlaygroundCustomStyleUpload from './PlaygroundCustomStyleUpload.vue';
import { usePlaygroundStyles } from '@theme/composables/usePlaygroundStyles';
import './playground.scss';

const store = useStore();
const { avatarStyleName, seed } = storeToRefs(store);

const entries = usePlaygroundEntries(avatarStyleName);

provide(playgroundEntriesKey, entries);
provide(componentPreviewKey, entries.preview);

// Another style has other entries, so nothing stays selected across the
// switch.
const { selected, select } = usePlaygroundSelection();

// On a phone the inspector is a sheet. It opens when a person picks an
// entry, not when the playground picks one for them, and closing it keeps
// the selection. The full list of entries is a sheet behind the first chip.
const phone = useMediaQuery('(max-width: 767px)');
const inspectorOpen = ref(false);
const listOpen = ref(false);
let preselecting = false;

watch(
  selected,
  (entry) => {
    if (entry && phone.value && !preselecting) inspectorOpen.value = true;
  },
  { flush: 'sync' },
);

// The presets are selected from the start, and again for every other
// style. They arrive a moment after the style, so Canvas stands in until
// then, and gives way as long as nobody has picked anything else.
let standIn = '';

function preselect() {
  const entry: PlaygroundEntry =
    entries.presets.value.length > 0
      ? { kind: 'general', id: 'presets' }
      : { kind: 'general', id: 'canvas' };

  preselecting = true;
  select(entry);
  preselecting = false;
  standIn = entryKey(entry);
}

preselect();
watch(avatarStyleName, preselect);
watch(
  () => entries.presets.value.length,
  () => {
    if (entryKey(selected.value) === standIn) preselect();
  },
);

// The contrast hint in a color section links to the color it contrasts with.
provide(navigateToColorKey, (name: string) => select({ kind: 'color', name }));

// ?style= overrides the persisted style (used by "Open in Playground" links).
// ?preset= additionally loads one of that style's presets, which is how a
// card in the style-page gallery hands its options over.
const params = new URL(window.location.href).searchParams;
const styleParam = params.get('style');
const presetParam = params.get('preset');

if (styleParam) {
  const styleName = kebabCase(styleParam);

  if (store.availableAvatarStyles.includes(styleName)) {
    store.avatarStyleName = styleName;
    store.resetOptions();

    if (presetParam) {
      // The store clears the options whenever the style changes, and that
      // watcher runs on the next tick, so applying the preset any earlier
      // would be undone again. The preset file is fetched on demand, which
      // lands even later, so both waits are covered. A failed chunk fetch
      // leaves the playground on the plain style, which is the same place an
      // unknown ?preset= lands.
      void loadStylePreset(styleName, presetParam)
        .then(async (preset) => {
          await nextTick();

          if (preset) {
            store.applyPreset(preset);
          }
        })
        .catch(() => undefined);
    }
  }

  history.replaceState(null, '', window.location.pathname);
}

// The list at the style field starts with the styles used last, however
// they were chosen: in the list, by a link or by an upload.
const { remember, addFile } = usePlaygroundStyles();

watch(avatarStyleName, (name) => remember(name), { immediate: true });

// A file dragged over the playground shows where it can go. Entering and
// leaving children fire their own events, so a counter tells when the
// pointer has really left. A drop that a box inside already handled, like
// the one in the import dialog, stays with that box.
const dragging = ref(false);
let dragDepth = 0;

function carriesFiles(event: DragEvent): boolean {
  return !!event.dataTransfer?.types.includes('Files');
}

function onDragEnter(event: DragEvent) {
  if (!carriesFiles(event)) return;

  event.preventDefault();
  dragDepth++;
  dragging.value = true;
}

function onDragOver(event: DragEvent) {
  if (!carriesFiles(event) || event.defaultPrevented) return;

  event.preventDefault();

  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
}

function onDragLeave(event: DragEvent) {
  if (!carriesFiles(event)) return;

  dragDepth = Math.max(0, dragDepth - 1);

  if (dragDepth === 0) dragging.value = false;
}

function onDrop(event: DragEvent) {
  dragDepth = 0;
  dragging.value = false;

  if (!carriesFiles(event) || event.defaultPrevented) return;

  event.preventDefault();

  const file = event.dataTransfer?.files[0];

  if (file) void addFile(file);
}

const exportDialog = ref<InstanceType<typeof PlaygroundButtonExport>>();
const importDialog = ref<InstanceType<typeof PlaygroundButtonImport>>();
const howToUse = ref<InstanceType<typeof PlaygroundButtonHowToUse>>();
</script>

<template>
  <div
    class="pg-app"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <PlaygroundToolbar
      @export="exportDialog?.show()"
      @import="importDialog?.show()"
      @how-to-use="howToUse?.show()"
    />

    <div class="pg-app-body">
      <PlaygroundEntries
        class="pg-app-entries"
        list-button
        @open-list="listOpen = true"
      />
      <PlaygroundStage :seed="seed" class="pg-app-stage" />
      <PlaygroundInspector
        v-if="!phone"
        :seed="seed"
        class="pg-app-inspector"
        @how-to-use="howToUse?.show()"
      />
      <div v-else class="pg-app-actions">
        <PlaygroundActions :seed="seed" @how-to-use="howToUse?.show()" />
      </div>
    </div>

    <SiteDialog v-if="phone" v-model:open="inspectorOpen" sheet>
      <PlaygroundInspector
        :seed="seed"
        closable
        class="pg-app-sheet-inspector"
        @how-to-use="howToUse?.show()"
        @close="inspectorOpen = false"
      />
    </SiteDialog>

    <SiteDialog
      v-if="phone"
      v-model:open="listOpen"
      sheet
      header="Options"
      content-class="pg-app-sheet-list"
    >
      <PlaygroundEntries list @pick="listOpen = false" />
    </SiteDialog>

    <PlaygroundButtonExport ref="exportDialog" :seed="seed" :trigger="false" />
    <PlaygroundButtonImport ref="importDialog" :trigger="false" />
    <PlaygroundButtonHowToUse ref="howToUse" :seed="seed" :trigger="false" />
    <PlaygroundCustomStyleUpload />

    <div v-if="dragging" class="pg-app-drop" aria-hidden="true">
      <span class="pg-app-drop-icon">
        <Upload :size="28" />
      </span>
      <span class="pg-app-drop-title">Drop to add the style</span>
      <span class="pg-app-drop-note">The style stays in this browser.</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-app {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;

  &-body {
    display: grid;
    flex: 1;
    grid-template-columns: 260px minmax(0, 1fr) 360px;
    box-sizing: border-box;
    width: 100%;
    max-width: var(--db-container);
    min-height: 0;
    margin: 0 auto;
    /* The controls, the headings and the tint of a chosen row stand on the
       header's edge. The columns reach 12px past it for the room the
       controls keep to the picture's lines. */
    padding: 0 calc(var(--db-gutter) - 12px);
  }

  /* Each sidebar has one line, towards the picture. The outer edge is the
     content edge of the page, open like the header's. */
  &-entries {
    border-right: 1px solid var(--db-line);
  }

  &-inspector {
    border-left: 1px solid var(--db-line);
  }

  @media (max-width: 1279px) {
    &-body {
      grid-template-columns: 224px minmax(0, 1fr) 324px;
    }
  }

  /* One column: the picture, the entries as chips, the inspector below,
     its actions stuck to the bottom of the window. */
  @media (max-width: 959px) {
    height: auto;
    min-height: 100%;

    &-body {
      display: flex;
      flex-direction: column;
      max-width: none;
      padding: 0;
    }

    &-entries {
      order: 2;
      border-right: 0;
      border-bottom: 1px solid var(--db-line);
    }

    &-stage {
      order: 1;
    }

    &-inspector {
      order: 3;
      flex: 1;
      border-left: 0;
    }

    /* The phone's own bar with the three actions, stuck to the bottom. */
    &-actions {
      order: 4;
      position: sticky;
      bottom: 0;
      margin-top: auto;
      padding: 12px 16px 16px;
      border-top: 1px solid var(--db-line);
      background: var(--db-paper);
    }
  }
}

/* Where a dragged style definition lands: the whole playground, marked
   with the brand line and tint. It lets the drag events through to the
   playground below. */
.pg-app-drop {
  position: absolute;
  z-index: 40;
  inset: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 2px dashed var(--db-brand);
  border-radius: var(--db-radius-3);
  background: color-mix(in srgb, var(--db-tint) 94%, transparent);
  color: var(--db-tint-text);
  pointer-events: none;

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: var(--db-paper);
    color: var(--db-brand);
  }

  &-title {
    font-size: 22px;
    line-height: 28px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--db-ink);
  }

  &-note {
    font-size: 15px;
    line-height: 24px;
  }
}

/* The inspector fills its sheet, its actions at the sheet's foot. */
.pg-app-sheet-inspector {
  height: 100%;
}

.pg-app-sheet-list {
  padding-bottom: 8px;
}
</style>
