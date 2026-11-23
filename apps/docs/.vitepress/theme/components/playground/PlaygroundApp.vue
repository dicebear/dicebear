<script setup lang="ts">
/**
 * The playground as one screen: the toolbar across the top, the picture in
 * the middle. The simple view puts a column of looks next to it, the
 * advanced view the entries on the left and the inspector on the right. The
 * editor view has no columns and puts a tray of parts and colors under the
 * picture. A phone has three layers in every view: a bar of its own in
 * place of the site header and the toolbar, the stage with undo, redo and
 * the download in its corners, and a sheet with the looks, the options or
 * the tray, which rises for more room.
 * The dialogs that concern the whole setup live here, so the menu in the
 * toolbar and the buttons under the columns open the same ones. A style
 * definition dropped anywhere on the playground becomes a style of one's
 * own.
 */
import { computed, nextTick, provide, ref, watch } from 'vue';
import { Redo2, Undo2, Upload } from '@lucide/vue';
import { storeToRefs } from 'pinia';
import {
  useEventListener,
  useMediaQuery,
  useResizeObserver,
} from '@vueuse/core';
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
import PlaygroundAppBar from './PlaygroundAppBar.vue';
import PlaygroundButtonDownload from './PlaygroundButtonDownload.vue';
import PlaygroundEntries from './PlaygroundEntries.vue';
import PlaygroundStage from './PlaygroundStage.vue';
import PlaygroundInspector from './PlaygroundInspector.vue';
import PlaygroundSimplePanel from './PlaygroundSimplePanel.vue';
import PlaygroundEditor from './PlaygroundEditor.vue';
import PlaygroundEditorBar from './PlaygroundEditorBar.vue';
import PlaygroundSheet from './PlaygroundSheet.vue';
import PlaygroundThumb from './PlaygroundThumb.vue';
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

// The advanced view on a phone keeps the list of options in the sheet under
// the picture. Picking an entry puts its options in the list's place, and
// the arrow in their head leads back to the list where it was left.
const phoneAdvanced = computed(
  () => phone.value && !simple.value && !editor.value,
);

// On a phone the sheet lies from the bottom of the picture to the bottom of
// the window. The picture is measured, as it changes its height with the
// view, the style and the window; it keeps at most three fifths of the
// height, so the sheet always has room on a short phone.
const app = ref<HTMLElement | null>(null);
const stage = ref<InstanceType<typeof PlaygroundStage> | null>(null);
const sheetTop = ref(0);

function measureSheet() {
  const box = app.value?.getBoundingClientRect();
  const stageBox = (stage.value?.$el as HTMLElement | undefined)
    ?.querySelector('.pg-stage-ground')
    ?.getBoundingClientRect();

  if (!box || !stageBox) return;

  sheetTop.value = Math.round(
    Math.min(stageBox.bottom - box.top, box.height * 0.6),
  );
}

const stageElement = computed(
  () => (stage.value?.$el as HTMLElement | undefined) ?? null,
);

useResizeObserver(app, measureSheet);
useResizeObserver(stageElement, measureSheet);
watch([phone, view, avatarStyleName], () => nextTick(measureSheet));
const detailOpen = ref(false);
const phonePanel = ref<HTMLElement | null>(null);
let listScroll = 0;

const sheet = ref<InstanceType<typeof PlaygroundSheet> | null>(null);

// The options of one entry are a step down in the sheet, so it rises to the
// top for them.
async function openDetail() {
  listScroll = phonePanel.value?.scrollTop ?? 0;
  detailOpen.value = true;
  sheet.value?.expand();

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
  history.replaceState(history.state, '', window.location.pathname);
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
let dragFromPage = false;

// Browsers report a dragged image as a file too. Only a file from outside the
// page can be a style, and a picture here is something to click, so it does
// not lift off at all.
useEventListener('dragstart', (event: DragEvent) => {
  if (event.target instanceof HTMLImageElement) {
    event.preventDefault();

    return;
  }

  dragFromPage = true;
  event.target?.addEventListener('dragend', () => (dragFromPage = false), {
    once: true,
  });
});

function carriesFiles(event: DragEvent): boolean {
  return !dragFromPage && !!event.dataTransfer?.types.includes('Files');
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

  // A dialog is about something else: the file is not a new style.
  if ((event.target as Element).closest?.('dialog')) return;

  const file = event.dataTransfer?.files[0];

  if (file) void addFile(file);
}

const exportDialog = ref<InstanceType<typeof PlaygroundButtonExport>>();
const importDialog = ref<InstanceType<typeof PlaygroundButtonImport>>();
const howToUse = ref<InstanceType<typeof PlaygroundButtonHowToUse>>();
const toolbar = ref<InstanceType<typeof PlaygroundToolbar>>();

// The button under the simple view's options goes away with that view, so
// the focus moves to the view menu, as it does after a pick there.
async function showAdvanced() {
  store.setMode('advanced', 'panel');

  await nextTick();

  toolbar.value?.focusView();
}
</script>

<template>
  <div
    ref="app"
    class="pg-app"
    :class="{
      'is-editor': editor,
      'is-fixed': editor || phone,
      'has-sheet': phone,
    }"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <PlaygroundToolbar
      v-if="!phone"
      ref="toolbar"
      @export="exportDialog?.show()"
      @import="importDialog?.show()"
    />
    <PlaygroundAppBar
      v-else
      @export="exportDialog?.show()"
      @import="importDialog?.show()"
      @how-to-use="howToUse?.show()"
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
        ref="stage"
        :seed="seed"
        :editor="editor"
        :status="!phone"
        :compact="phone"
        :seed-hint="simple"
        class="pg-app-stage"
      >
        <template v-if="phone" #corner>
          <span class="pg-app-history">
            <button
              type="button"
              class="site-btn site-btn-ghost site-btn-icon"
              aria-label="Undo"
              :disabled="!store.canUndo"
              @click="store.undo()"
            >
              <Undo2 :size="18" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="site-btn site-btn-ghost site-btn-icon"
              aria-label="Redo"
              :disabled="!store.canRedo"
              @click="store.redo()"
            >
              <Redo2 :size="18" aria-hidden="true" />
            </button>
          </span>
          <PlaygroundButtonDownload :seed="seed" primary compact />
        </template>
        <template v-if="editor" #controls>
          <PlaygroundEditorBar :seed="seed" :actions="!phone" />
        </template>
        <PlaygroundEditor v-if="editor && !phone" />
      </PlaygroundStage>
      <PlaygroundSimplePanel
        v-if="simple && !phone"
        :seed="seed"
        class="pg-app-inspector"
        @how-to-use="howToUse?.show()"
        @advanced="showAdvanced"
      />
      <PlaygroundInspector
        v-else-if="!editor && !phone"
        :seed="seed"
        class="pg-app-inspector"
        @how-to-use="howToUse?.show()"
      />
      <PlaygroundSheet
        v-if="phone"
        ref="sheet"
        :top="sheetTop"
        :bottom="0"
        :label="editor ? 'Parts and colors' : simple ? 'Looks' : 'Options'"
      >
        <template #head>
          <div class="pg-app-sheet-head">
            <span class="pg-app-sheet-thumb">
              <PlaygroundThumb
                :style-name="avatarStyleName"
                :options="{ ...store.avatarStyleOptionsWithoutDefaults, seed }"
                :alt="`Avatar for the seed ${seed}`"
              />
            </span>
            <span class="pg-app-sheet-seed">{{ seed }}</span>
          </div>
        </template>
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
          <PlaygroundStatus class="pg-app-sheet-status" />
        </div>
        <div v-else-if="simple" class="pg-app-panel">
          <PlaygroundSimplePanel
            :seed="seed"
            :actions="false"
            @how-to-use="howToUse?.show()"
            @advanced="showAdvanced"
          />
          <PlaygroundStatus class="pg-app-sheet-status" />
        </div>
        <PlaygroundEditor v-else class="pg-app-sheet-editor">
          <template #end>
            <PlaygroundStatus
              :combinations="false"
              class="pg-app-sheet-status is-editor"
            />
          </template>
        </PlaygroundEditor>
      </PlaygroundSheet>
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
@use '../../styles/tone';

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
    /* The columns end on the content edge of the header, like every line
       in them; the panels keep their room on the side of the picture. */
    padding: 0 var(--db-wrap);
  }

  /* Each sidebar has one line, towards the picture. The outer edge is the
     content edge of the page, open like the header's. */
  &-entries {
    border-right: 1px solid var(--db-line);
  }

  &-inspector {
    border-left: 1px solid var(--db-line);
  }

  /* Beside the list the status line keeps the panels' room to the line. */
  &-entries + &-stage :deep(.pg-status) {
    padding-left: 24px;
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
      grid-template-columns: 240px minmax(0, 1fr) 324px;
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

    /* The editor, and every view on a phone, keep to the window like on a
       desktop, so only their tiles or options scroll and the avatar stays
       in view while picking. */
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

    /* A phone held sideways has no height for a tray that scrolls by
       itself: the page scrolls instead. */
    @media (min-width: 768px) and (max-height: 520px) {
      &.is-fixed.is-editor {
        height: auto;
        min-height: calc(100dvh - var(--db-header-h));
      }

      &.is-editor &-stage {
        flex: none;
      }
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

    /* With the sheet, the picture keeps its own height and the sheet lies
       over the rest. */
    &.has-sheet &-stage {
      flex: none;
    }

    &.has-sheet &-panel {
      border-top: 0;
    }

    &-sheet-head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 20px 10px;
    }

    &-sheet-thumb {
      display: block;
      width: 52px;
      height: 52px;
      flex-shrink: 0;

      :deep(.pg-thumb) {
        border-radius: 14px;
      }
    }

    &-sheet-seed {
      overflow: hidden;
      font-family: var(--db-font-display);
      font-size: 18px;
      font-weight: 700;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--db-ink);
    }

    &-sheet-editor {
      flex: 1;
      min-height: 0;
    }

    /* In the sheet the simple panel grows with its content; the sheet
       scrolls, not the panel. */
    &-panel > :deep(.pg-simple) {
      flex: none;
    }

    &-panel :deep(.pg-simple-body) {
      overflow: visible;
      padding: 8px 16px 24px;
    }

    /* The license and the number of combinations end the sheet's list. */
    &-sheet-status {
      margin-top: auto;
      padding: 16px 20px 24px;
      border-top: 1px solid var(--db-line);
    }

    /* Under the tiles of the editor, inside their own padding. */
    &-sheet-status.is-editor {
      margin-top: 4px;
    }

    &-history {
      display: flex;
      gap: 2px;
    }

    /* The panel scrolls, not the list in it, so it can keep the list's
       place while one entry is open. */
    &-panel-list {
      flex: none;
      overflow: visible;
    }
  }
}

/* Where a dragged style definition lands: the whole playground, a yellow
   block with dark text in both themes. It lets the drag events through to
   the playground below. */
.pg-app-drop {
  @include tone.tone('sun');

  position: absolute;
  z-index: 40;
  inset: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 2px dashed var(--db-focus);
  border-radius: var(--db-radius-3);
  background: color-mix(in srgb, var(--db-paper) 94%, transparent);
  pointer-events: none;

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: var(--db-panel);
    color: var(--db-focus);
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
    color: var(--db-ink-2);
  }
}
</style>
