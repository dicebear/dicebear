<script setup lang="ts">
import { ref } from 'vue';
import { Archive, Download } from '@lucide/vue';
import { Avatar } from '@dicebear/core';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { loadAvatarStyle, clonePlain } from '@theme/utils/avatar/style';
import { triggerDownload } from '@theme/utils/download';
import { track, styleLabel } from '@theme/utils/track';
import { UiAvatar, UiConfetti, UiDialog } from '../ui';
import PlaygroundLicenseAlert from './PlaygroundLicenseAlert.vue';
import PlaygroundBatchDownload from './PlaygroundBatchDownload.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import { DIALOG_PREVIEW_AVATAR_SIZE, DOWNLOAD_AVATAR_SIZE } from './constants';

const props = defineProps<{
  seed: string;
}>();

const { store, open, confettiKey, options, showDialog } = usePlaygroundDialog(
  () => props.seed,
);
const menu = ref();
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

function openBatch() {
  batchOpen.value = true;
}

// For built-in styles the API serves PNG/JPEG/WebP/AVIF; for custom styles we
// can only produce SVGs locally — so the format choices collapse to SVG +
// Batch. Batch stays available in both modes via a separator at the bottom.
// `iconComponent` rather than PrimeVue's `icon`, which is typed as a CSS class
// name — the `#item` slot below renders the Lucide component directly.
const builtInMenuItems: MenuItem[] = [
  { label: 'SVG', command: () => downloadSvg() },
  { label: 'PNG', command: () => downloadBinary('png') },
  { label: 'JPEG', command: () => downloadBinary('jpg') },
  { label: 'WebP', command: () => downloadBinary('webp') },
  { label: 'AVIF', command: () => downloadBinary('avif') },
  { separator: true },
  {
    label: 'Batch download…',
    iconComponent: Archive,
    command: () => openBatch(),
  },
];

const customMenuItems: MenuItem[] = [
  { label: 'SVG', command: () => downloadSvg() },
  { separator: true },
  {
    label: 'Batch download…',
    iconComponent: Archive,
    command: () => openBatch(),
  },
];

function onDownloadClick(e: Event) {
  menu.value.toggle(e);
}
</script>

<template>
  <Button label="Download" severity="secondary" @click="onDownloadClick">
    <template #icon>
      <Download :size="15" />
    </template>
  </Button>
  <Menu
    ref="menu"
    :model="store.isCustomStyle ? customMenuItems : builtInMenuItems"
    :popup="true"
  >
    <template #item="{ item, props }">
      <a v-bind="props.action" class="pg-download-menu-item">
        <component
          :is="item.iconComponent"
          v-if="item.iconComponent"
          :size="14"
        />
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menu>

  <UiDialog v-model:open="open">
    <UiConfetti :key="confettiKey" />
    <div class="dialog-preview">
      <UiAvatar
        :style-name="store.avatarStyleName"
        :style-options="options"
        :size="DIALOG_PREVIEW_AVATAR_SIZE"
        mode="library"
      />
    </div>
    <div class="dialog-title">Your avatar will be downloaded! 🎉</div>
    <div class="dialog-subtitle">
      Please note the license below before using.
    </div>
    <div class="dialog-text">
      <PlaygroundLicenseAlert />
    </div>
  </UiDialog>

  <UiDialog v-model:open="batchOpen" header="Batch download" max-width="640px">
    <PlaygroundBatchDownload v-if="batchOpen" />
  </UiDialog>
</template>

<style scoped lang="scss">
.pg-download-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
</style>
