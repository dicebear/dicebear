<script setup lang="ts">
import { computed, ref } from 'vue';
import { Download } from '@lucide/vue';
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
import { DOWNLOAD_AVATAR_SIZE } from './constants';

const props = defineProps<{
  seed: string;
}>();

const { store, open, options, showDialog } = usePlaygroundDialog(
  () => props.seed,
);
const batchOpen = ref(false);

async function downloadSvg() {
  showDialog();

  track('Playground: Download', {
    style: styleLabel(store.avatarStyleName),
    format: 'svg',
  });

  const avatarStyle = await loadAvatarStyle(store.avatarStyleName);
  const avatar = new Avatar(
    avatarStyle,
    clonePlain({
      size: DOWNLOAD_AVATAR_SIZE,
      ...options.value,
    }),
  );

  const blob = new Blob([avatar.toString()], { type: 'image/svg+xml' });
  triggerDownload(blob, `${store.avatarStyleName}-${Date.now()}.svg`);
}

async function downloadBinary(format: string) {
  showDialog();

  track('Playground: Download', {
    style: styleLabel(store.avatarStyleName),
    format,
  });

  const response = await fetch(
    getAvatarApiUrl(store.avatarStyleName, options.value, format),
  );

  const blob = await response.blob();
  triggerDownload(blob, `${store.avatarStyleName}-${Date.now()}.${format}`);
}

const svgItem: SiteMenuItem = {
  label: 'SVG',
  hint: 'Vector, any size',
  command: () => downloadSvg(),
};

const batchItems: SiteMenuItem[] = [
  { separator: true },
  { label: 'Batch download', command: () => (batchOpen.value = true) },
];

// The API serves the raster formats of the packaged styles. An uploaded style
// only renders in the browser, which leaves SVG and the batch download.
const rasterItems: SiteMenuItem[] = [
  { label: 'PNG', command: () => downloadBinary('png') },
  { label: 'JPEG', command: () => downloadBinary('jpg') },
  { label: 'WebP', command: () => downloadBinary('webp') },
  { label: 'AVIF', command: () => downloadBinary('avif') },
];

const items = computed<SiteMenuItem[]>(() =>
  store.isCustomStyle
    ? [svgItem, ...batchItems]
    : [svgItem, ...rasterItems, ...batchItems],
);
</script>

<template>
  <SiteMenu class="pg-button-download" :items="items" label="Download">
    <template #trigger="{ open: menuOpen, toggle }">
      <button
        type="button"
        class="site-btn site-btn-secondary pg-button-download-trigger"
        aria-haspopup="menu"
        :aria-expanded="menuOpen"
        @click="toggle"
      >
        <Download :size="16" aria-hidden="true" />
        Download
      </button>
    </template>
  </SiteMenu>

  <PlaygroundDone
    v-model:open="open"
    title="Your avatar will be downloaded"
    :options="options"
    source="download"
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
.pg-button-download {
  display: flex;
  min-width: 0;

  &-trigger {
    width: 100%;
    min-width: 0;
    padding: 0 12px;
    font-size: 15px;
  }
}
</style>
