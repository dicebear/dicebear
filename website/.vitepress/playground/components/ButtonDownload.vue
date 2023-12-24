<script setup lang="ts">
import { mdiClose, mdiDownload } from '@mdi/js';
import { computed, mergeProps, ref } from 'vue';
import { mdiSvg, mdiFilePngBox, mdiFileJpgBox } from '@mdi/js';
import useStore from '@playground/store';
import { getAvatarApiUrl, loadAvatarStyle } from '@shared/utils/avatar';
import { createAvatar } from '@dicebear/core';
import Avatar from '@shared/components/Avatar.vue';
import LicenseText from './LicenseText.vue';
import Confetti from './Confetti.vue';

const props = defineProps<{
  seed: string;
}>();

const store = useStore();

const open = ref(false);
const options = computed(() => {
  return {
    ...store.avatarStyleOptionsWithoutDefaults,
    seed: props.seed,
  };
});

async function downloadSvg() {
  const avatarStyle = await loadAvatarStyle(store.avatarStyleName);
  const avatar = createAvatar(avatarStyle, {
    ...options.value,
    size: 512,
  });

  const timestamp = new Date().getTime();

  await avatar.toFile(`${store.avatarStyleName}-${timestamp}.svg`);

  open.value = true;
}

// Download via API so that Exif headers are stored in the image.
async function downloadBinary(format: 'png' | 'jpg') {
  open.value = true;

  const response = await fetch(
    getAvatarApiUrl(store.avatarStyleName, options.value, format)
  );

  const blob = await response.blob();
  const file = URL.createObjectURL(blob);
  const timestamp = new Date().getTime();

  const link = document.createElement('a');
  link.href = file;
  link.download = `${store.avatarStyleName}-${timestamp}.${format}`;
  link.target = '_blank';
  link.click();
  link.remove();

  URL.revokeObjectURL(file);
}

function downloadPng() {
  downloadBinary('png');
}

function downloadJpg() {
  downloadBinary('jpg');
}

function onClose() {
  open.value = false;
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props: menu }">
      <v-tooltip text="Download" location="bottom">
        <template v-slot:activator="{ props: tooltip }">
          <v-btn
            variant="tonal"
            color="primary"
            density="comfortable"
            class="preview-actions-btn"
            v-bind="mergeProps(menu, tooltip)"
            block
          >
            <v-icon :icon="mdiDownload" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item @click="downloadSvg">
        <template v-slot:prepend>
          <v-icon :icon="mdiSvg"></v-icon>
        </template>
        <v-list-item-title>Download as SVG</v-list-item-title>
      </v-list-item>
      <v-list-item @click="downloadPng">
        <template v-slot:prepend>
          <v-icon :icon="mdiFilePngBox"></v-icon>
        </template>
        <v-list-item-title>Download as PNG</v-list-item-title>
      </v-list-item>
      <v-list-item @click="downloadJpg">
        <template v-slot:prepend>
          <v-icon :icon="mdiFileJpgBox"></v-icon>
        </template>
        <v-list-item-title>Download as JPEG</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-dialog v-model="open" width="540">
    <v-card>
      <v-btn
        variant="tonal"
        color="red"
        @click="onClose"
        icon
        density="compact"
        class="dialog-close-btn"
        title="Close"
      >
        <v-icon :size="20" :icon="mdiClose" />
      </v-btn>
      <Confetti />
      <div class="dialog-preview">
        <Avatar
          :style-name="store.avatarStyleName"
          :style-options="options"
          :size="96"
        />
      </div>
      <v-card-title class="dialog-title">
        Your avatar will be downloaded! 🎉
      </v-card-title>
      <v-card-text class="dialog-text">
        <v-alert type="info" variant="tonal" class="dialog-license">
          <strong>
            Please note the following license before using the avatar:
          </strong>
          <LicenseText :style="store.avatarStyleName" />
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-preview {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.dialog-text {
  padding: 1.5rem !important;
}

.dialog-title {
  text-align: center;
  white-space: normal;
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
}

.dialog-license strong {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.dialog-close-btn {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
}
</style>
