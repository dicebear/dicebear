<script setup lang="ts">
/**
 * One split button. The wide part saves the avatar as PNG, the format most
 * downloads ask for. The arrow holds SVG and the other formats, copying the
 * SVG and the batch download. An uploaded style only renders in the
 * browser, so it saves SVG and has no raster formats.
 */
import { computed, ref } from 'vue';
import copy from 'copy-to-clipboard';
import { ChevronDown, Copy, Download } from '@lucide/vue';
import { Avatar } from '@dicebear/core';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { loadAvatarStyle, clonePlain } from '@theme/utils/avatar/style';
import { triggerDownload } from '@theme/utils/download';
import { track, styleLabel } from '@theme/utils/track';
import SiteDialog from '../site/SiteDialog.vue';
import SiteMenu, { type SiteMenuItem } from '../site/SiteMenu.vue';
import PlaygroundBatchDownload from './PlaygroundBatchDownload.vue';
import PlaygroundDone from './PlaygroundDone.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import { DOWNLOAD_AVATAR_SIZE, RASTER_DOWNLOAD_SIZE } from './constants';

const props = defineProps<{
  seed: string;
  /** The filled look of the main action, where saving comes first. */
  primary?: boolean;
}>();

const { store, open, options, showDialog } = usePlaygroundDialog(
  () => props.seed,
);

const batchOpen = ref(false);
const raster = computed(() => !store.isCustomStyle);

// The dialog after a download or a copy, with the words for either.
const done = ref({
  title: 'Your avatar will be downloaded',
  source: 'download',
});

async function svgMarkup(): Promise<string> {
  const avatarStyle = await loadAvatarStyle(store.avatarStyleName);

  return new Avatar(
    avatarStyle,
    clonePlain({
      size: DOWNLOAD_AVATAR_SIZE,
      ...options.value,
    }),
  ).toString();
}

function announceDownload(format: string) {
  done.value = { title: 'Your avatar will be downloaded', source: 'download' };
  showDialog();

  track('Playground: Download', {
    style: styleLabel(store.avatarStyleName),
    format,
  });
}

async function downloadSvg() {
  announceDownload('svg');

  const blob = new Blob([await svgMarkup()], { type: 'image/svg+xml' });

  triggerDownload(blob, `${store.avatarStyleName}-${Date.now()}.svg`);
}

async function downloadBinary(format: string) {
  announceDownload(format);

  // A size set under Output wins, otherwise the largest the API renders.
  const response = await fetch(
    getAvatarApiUrl(
      store.avatarStyleName,
      { size: RASTER_DOWNLOAD_SIZE, ...options.value },
      format,
    ),
  );
  const blob = await response.blob();

  triggerDownload(blob, `${store.avatarStyleName}-${Date.now()}.${format}`);
}

async function copySvg() {
  const successful = await copy(await svgMarkup());

  if (successful) {
    track('Playground: Copy SVG', {
      style: styleLabel(store.avatarStyleName),
    });
  }

  done.value = {
    title: successful
      ? 'Your avatar was copied'
      : 'Your avatar could not be copied',
    source: 'copy',
  };
  showDialog();
}

function downloadMain() {
  if (raster.value) {
    void downloadBinary('png');
  } else {
    void downloadSvg();
  }
}

const mainLabel = computed(() =>
  raster.value ? 'Download PNG' : 'Download SVG',
);

const size = `${RASTER_DOWNLOAD_SIZE} px`;

const items = computed<SiteMenuItem[]>(() => [
  ...(raster.value
    ? ([
        { label: 'SVG', hint: 'vector', command: () => void downloadSvg() },
        {
          label: 'JPEG',
          hint: size,
          command: () => void downloadBinary('jpg'),
        },
        {
          label: 'WebP',
          hint: size,
          command: () => void downloadBinary('webp'),
        },
        {
          label: 'AVIF',
          hint: size,
          command: () => void downloadBinary('avif'),
        },
        { separator: true },
      ] satisfies SiteMenuItem[])
    : []),
  { label: 'Copy SVG', icon: Copy, command: () => void copySvg() },
  { separator: true },
  {
    label: 'Batch download',
    hint: 'many seeds',
    command: () => (batchOpen.value = true),
  },
]);
</script>

<template>
  <span class="pg-download" :class="{ 'is-primary': primary }">
    <button type="button" class="pg-download-main" @click="downloadMain">
      <Download :size="16" aria-hidden="true" />
      {{ mainLabel }}
    </button>
    <SiteMenu :items="items" label="More ways to save" align="right">
      <template #trigger="{ open: menuOpen, toggle }">
        <button
          type="button"
          class="pg-download-more"
          aria-label="More ways to save"
          aria-haspopup="menu"
          :aria-expanded="menuOpen"
          @click="toggle"
        >
          <ChevronDown :size="16" aria-hidden="true" />
        </button>
      </template>
    </SiteMenu>
  </span>

  <PlaygroundDone
    v-model:open="open"
    :title="done.title"
    :options="options"
    :source="done.source"
  />

  <SiteDialog
    v-model:open="batchOpen"
    header="Batch download"
    max-width="760px"
  >
    <PlaygroundBatchDownload v-if="batchOpen" />
  </SiteDialog>
</template>

<style scoped lang="scss">
/* A secondary button of the set, split in two: the soft ground with the
   quiet line, a line between the parts. */
.pg-download {
  display: flex;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid var(--db-field-border);
  border-radius: var(--db-radius-2);
  background: var(--db-soft);
  color: var(--db-ink);
  overflow: hidden;
  transition: border-color 0.12s;

  &:hover {
    border-color: var(--db-btn-border);
  }

  &-main,
  &-more {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    font: inherit;
    color: inherit;
    cursor: pointer;
    transition: background-color 0.12s;

    &:hover {
      background: var(--db-switch-bg);
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: -3px;
    }
  }

  &-main {
    flex: 1;
    gap: 8px;
    min-width: 0;
    font-size: 14px;
    font-weight: 600;
  }

  &-more {
    flex-shrink: 0;
    width: 40px;
    border-left: 1px solid var(--db-field-border);
  }

  /* The ink of the primary button, with a faint line between the parts. */
  &.is-primary {
    border-color: var(--db-btn-bg);
    background: var(--db-btn-bg);
    color: var(--db-btn-fg);

    &:hover {
      border-color: var(--db-btn-bg);
    }
  }

  &.is-primary &-main:hover,
  &.is-primary &-more:hover {
    background: var(--db-btn-hover);
  }

  &.is-primary &-more {
    border-left-color: color-mix(in srgb, var(--db-btn-fg) 25%, transparent);
  }
}
</style>
