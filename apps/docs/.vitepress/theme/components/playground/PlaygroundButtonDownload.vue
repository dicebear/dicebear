<script setup lang="ts">
/**
 * One split button: the wide part saves the SVG, the arrow opens the raster
 * formats and the batch download.
 */
import { computed, ref } from 'vue';
import { ChevronDown, Download } from '@lucide/vue';
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

const batchItems: SiteMenuItem[] = [
  { separator: true },
  {
    label: 'Batch download',
    hint: 'many seeds',
    command: () => (batchOpen.value = true),
  },
];

// The API serves the raster formats of the packaged styles. An uploaded style
// only renders in the browser, which leaves SVG and the batch download.
const rasterItems: SiteMenuItem[] = [
  {
    label: 'PNG',
    hint: `${DOWNLOAD_AVATAR_SIZE} px`,
    command: () => downloadBinary('png'),
  },
  {
    label: 'JPEG',
    hint: `${DOWNLOAD_AVATAR_SIZE} px`,
    command: () => downloadBinary('jpg'),
  },
  {
    label: 'WebP',
    hint: `${DOWNLOAD_AVATAR_SIZE} px`,
    command: () => downloadBinary('webp'),
  },
  {
    label: 'AVIF',
    hint: `${DOWNLOAD_AVATAR_SIZE} px`,
    command: () => downloadBinary('avif'),
  },
];

const items = computed<SiteMenuItem[]>(() =>
  store.isCustomStyle ? batchItems.slice(1) : [...rasterItems, ...batchItems],
);
</script>

<template>
  <span class="pg-download">
    <button type="button" class="pg-download-main" @click="downloadSvg">
      <Download :size="16" aria-hidden="true" />
      Download SVG
    </button>
    <SiteMenu :items="items" label="Other formats" align="right">
      <template #trigger="{ open: menuOpen, toggle }">
        <button
          type="button"
          class="pg-download-more"
          aria-label="Other formats"
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
.pg-download {
  display: flex;
  width: 100%;
  height: 48px;
  border-radius: var(--db-radius-3);
  background: var(--db-btn-bg);
  color: var(--db-btn-fg);
  overflow: hidden;

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
    transition: background var(--duration-fast) var(--ease-smooth);

    &:hover {
      background: var(--db-btn-hover);
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
    font-size: 16px;
    font-weight: 600;
  }

  &-more {
    flex-shrink: 0;
    width: 44px;
    border-left: 1px solid color-mix(in srgb, var(--db-btn-fg) 22%, transparent);
  }
}
</style>
