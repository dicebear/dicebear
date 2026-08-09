<script setup lang="ts">
import { Copy } from '@lucide/vue';
import { ref } from 'vue';
import copy from 'copy-to-clipboard';
import { Avatar } from '@dicebear/core';
import { loadAvatarStyle, clonePlain } from '@theme/utils/avatar/style';
import { track, styleLabel } from '@theme/utils/track';
import { UiAvatar, UiConfetti, UiDialog } from '../ui';
import Button from 'primevue/button';
import PlaygroundLicenseAlert from './PlaygroundLicenseAlert.vue';
import PlaygroundStarCta from './PlaygroundStarCta.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import { DIALOG_PREVIEW_AVATAR_SIZE, DOWNLOAD_AVATAR_SIZE } from './constants';

const props = defineProps<{
  seed: string;
}>();

const { store, open, confettiKey, options, showDialog } = usePlaygroundDialog(
  () => props.seed,
);

const text = ref('');

async function onClick() {
  const avatarStyle = await loadAvatarStyle(store.avatarStyleName);
  const avatar = new Avatar(
    avatarStyle,
    clonePlain({
      size: DOWNLOAD_AVATAR_SIZE,
      ...options.value,
    }),
  );

  const successful = copy(avatar.toString());

  if (successful) {
    track('Playground: Copy SVG', {
      style: styleLabel(store.avatarStyleName),
    });
  }

  text.value = successful
    ? 'Your avatar was successfully copied! 🎉'
    : 'Your avatar could not be copied. 😞';

  showDialog();
}
</script>

<template>
  <Button label="Copy SVG" severity="secondary" @click="onClick">
    <template #icon>
      <Copy :size="15" />
    </template>
  </Button>

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
    <h2 class="dialog-title">{{ text }}</h2>
    <div class="dialog-subtitle">
      Please note the license below before using.
    </div>
    <div class="dialog-text">
      <PlaygroundLicenseAlert />
      <PlaygroundStarCta source="copy" />
    </div>
  </UiDialog>
</template>
