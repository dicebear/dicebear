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
  /** The 44px size with only the format as its label, for a phone's stage. */
  compact?: boolean;
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
  <span class="site-btn-group" :class="{ 'is-fluid': !compact }">
    <button
      type="button"
      class="site-btn"
      :class="[
        primary ? 'site-btn-primary' : 'site-btn-secondary',
        { 'site-btn-lg': !compact },
      ]"
      :aria-label="compact ? mainLabel : undefined"
      @click="downloadMain"
    >
      <Download :size="18" aria-hidden="true" />
      {{ compact ? mainLabel.replace('Download ', '') : mainLabel }}
    </button>
    <SiteMenu :items="items" label="More ways to save" align="right">
      <template #trigger="{ open: menuOpen, toggle }">
        <button
          type="button"
          class="site-btn site-btn-icon"
          :class="[
            primary ? 'site-btn-primary' : 'site-btn-secondary',
            { 'site-btn-lg': !compact },
          ]"
          aria-label="More ways to save"
          aria-haspopup="menu"
          :aria-expanded="menuOpen"
          @click="toggle"
        >
          <ChevronDown :size="18" aria-hidden="true" />
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
