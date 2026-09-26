<script setup lang="ts">
/**
 * The playground as one screen: the toolbar across the top, the picture in
 * the middle. The simple view puts a column of looks next to it, the
 * advanced view the entries on the left and the inspector on the right. The
 * editor view has no columns and puts a tray of parts and colors under the
 * picture. A phone stacks everything in one column, keeps the inspector in a
 * sheet and the ways out in a bar at the bottom.
 * The dialogs that concern the whole setup live here, so the menu in the
 * toolbar and the buttons under the columns open the same ones. A style
 * definition dropped anywhere on the playground becomes a style of one's
 * own.
 */
import { computed, nextTick, provide, ref, watch } from 'vue';
import { Upload } from '@lucide/vue';
import { storeToRefs } from 'pinia';
import { useMediaQuery } from '@vueuse/core';
import { kebabCase } from 'change-case';
import useStore, { isPlaygroundMode } from '@theme/stores/playground';
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
import PlaygroundSimplePanel from './PlaygroundSimplePanel.vue';
import PlaygroundEditor from './PlaygroundEditor.vue';
import PlaygroundEditorBar from './PlaygroundEditorBar.vue';
import PlaygroundEditorActions from './PlaygroundEditorActions.vue';
import PlaygroundActions from './PlaygroundActions.vue';
import PlaygroundStatus from './PlaygroundStatus.vue';
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

const phone = useMediaQuery('(max-width: 767px)');

// A view the store does not know, left over from an older visit, opens
// the simple one.
const view = computed(() =>
  isPlaygroundMode(store.mode) ? store.mode : 'simple',
);
const simple = computed(() => view.value === 'simple');
const editor = computed(() => view.value === 'editor');

// The advanced view on a phone keeps the list of options under the picture.
// Picking an entry puts its options in the list's place, and the arrow in
// their head leads back to the list where it was left. Nothing opens over
// the picture, so every change shows on the avatar at once.
const phoneAdvanced = computed(
  () => phone.value && !simple.value && !editor.value,
);
const detailOpen = ref(false);
const phonePanel = ref<HTMLElement | null>(null);
let listScroll = 0;

async function openDetail() {
  listScroll = phonePanel.value?.scrollTop ?? 0;
  detailOpen.value = true;

  await nextTick();

  phonePanel.value?.scrollTo({ top: 0 });
}

async function closeDetail() {
  detailOpen.value = false;

  await nextTick();

  phonePanel.value?.scrollTo({ top: listScroll });
}

watch(avatarStyleName, () => {
  detailOpen.value = false;
});

// The presets are selected from the start, and again for every other
// style. They arrive a moment after the style, so Canvas stands in until
// then, and gives way as long as nobody has picked anything else.
let standIn = '';

function preselect() {
  const entry: PlaygroundEntry =
    entries.presets.value.length > 0
      ? { kind: 'general', id: 'presets' }
      : { kind: 'general', id: 'canvas' };

  select(entry);
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
// card in the style-page gallery hands its options over. ?mode= opens a
// view, so a link for people who want their own avatar lands in the editor.
// The view is kept like one chosen in the menu.
const params = new URL(window.location.href).searchParams;
const styleParam = params.get('style');
const presetParam = params.get('preset');
const modeParam = params.get('mode')?.toLowerCase();

if (isPlaygroundMode(modeParam)) {
  store.setMode(modeParam, 'link');
}

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
}

if (styleParam || modeParam) {
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
    :class="{ 'is-editor': editor, 'is-fixed': editor || phoneAdvanced }"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <PlaygroundToolbar
      @export="exportDialog?.show()"
      @import="importDialog?.show()"
    />

    <div
      class="pg-app-body"
      :class="{ 'is-simple': simple, 'is-editor': editor }"
    >
      <PlaygroundEntries
        v-if="!simple && !editor && !phone"
        class="pg-app-entries"
      />
      <PlaygroundStage
        :seed="seed"
        :editor="editor"
        :status="!phone"
        :compact="phoneAdvanced"
        class="pg-app-stage"
      >
        <template v-if="editor" #controls>
          <PlaygroundEditorBar
            :seed="seed"
            :actions="!phone"
            @how-to-use="howToUse?.show()"
          />
        </template>
        <PlaygroundEditor v-if="editor" />
      </PlaygroundStage>
      <PlaygroundSimplePanel
        v-if="simple"
        :seed="seed"
        :actions="!phone"
        class="pg-app-inspector"
        @how-to-use="howToUse?.show()"
      />
      <PlaygroundInspector
        v-else-if="!editor && !phone"
        :seed="seed"
        class="pg-app-inspector"
        @how-to-use="howToUse?.show()"
      />
      <div v-if="phoneAdvanced" ref="phonePanel" class="pg-app-panel">
        <PlaygroundInspector
          v-if="detailOpen"
          :seed="seed"
          back
          :actions="false"
          class="pg-app-panel-inspector"
          @back="closeDetail"
        />
        <PlaygroundEntries
          v-else
          list
          drill
          class="pg-app-panel-list"
          @pick="openDetail"
        />
      </div>
      <div v-if="phone" class="pg-app-foot">
        <PlaygroundStatus :combinations="!editor" />
        <div class="pg-app-actions">
          <PlaygroundEditorActions
            v-if="editor"
            :seed="seed"
            fluid
            @how-to-use="howToUse?.show()"
          />
          <PlaygroundActions
            v-else
            :seed="seed"
            @how-to-use="howToUse?.show()"
          />
        </div>
      </div>
    </div>

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

  /* The simple view leaves the list out and gives its room to the picture. */
  &-body.is-simple {
    grid-template-columns: minmax(0, 1fr) 360px;
  }

  /* The editor view gives the whole width to the picture and its tray. */
  &-body.is-editor {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: 1279px) {
    &-body {
      grid-template-columns: 224px minmax(0, 1fr) 324px;
    }

    &-body.is-simple {
      grid-template-columns: minmax(0, 1fr) 324px;
    }
  }

  /* One column: the picture, the entries as chips, the inspector below,
     its actions stuck to the bottom of the window. */
  @media (max-width: 959px) {
    height: auto;
    min-height: calc(100dvh - var(--db-header-h));

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

    /* The phone's own foot, stuck to the bottom in every view: the status
       line with the license, and the actions under it. */
    &-foot {
      order: 4;
      position: sticky;
      bottom: 0;
      margin-top: auto;
      background: var(--db-paper);
    }

    &-actions {
      padding: 12px 16px 16px;
      border-top: 1px solid var(--db-line);
    }

    /* The editor, and the advanced view on a phone, keep to the window like
       on a desktop, so only their tiles or options scroll and the avatar
       stays in view while picking. */
    &.is-fixed {
      height: calc(100dvh - var(--db-header-h));
      min-height: 0;
    }

    &.is-fixed &-body {
      min-height: 0;
    }

    &.is-editor &-stage {
      flex: 1;
      min-height: 0;
    }

    /* The list of options, or the options of one entry, under the picture. */
    &-panel {
      order: 2;
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
      overflow-y: auto;
      border-top: 1px solid var(--db-line);
    }

    &-panel-inspector {
      flex: 1;
      min-height: 0;
    }

    /* The panel scrolls, not the list in it, so it can keep the list's
       place while one entry is open. */
    &-panel-list {
      flex: none;
      overflow: visible;
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
</style>
