<script setup lang="ts">
import { Check, Copy } from '@lucide/vue';
import { onBeforeUnmount, ref } from 'vue';
import copy from 'copy-to-clipboard';
import { Avatar } from '@dicebear/core';
import { loadAvatarStyle, clonePlain } from '@theme/utils/avatar/style';
import { track, styleLabel } from '@theme/utils/track';
import PlaygroundDone from './PlaygroundDone.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import { DOWNLOAD_AVATAR_SIZE } from './constants';

const props = defineProps<{
  seed: string;
}>();

const { store, open, options, showDialog } = usePlaygroundDialog(
  () => props.seed,
);

const title = ref('');
const copied = ref(false);

let copiedTimer: ReturnType<typeof setTimeout> | undefined;

onBeforeUnmount(() => clearTimeout(copiedTimer));

async function onClick() {
  const avatarStyle = await loadAvatarStyle(store.avatarStyleName);
  const avatar = new Avatar(
    avatarStyle,
    clonePlain({
      size: DOWNLOAD_AVATAR_SIZE,
      ...options.value,
    }),
  );

  const successful = await copy(avatar.toString());

  if (successful) {
    track('Playground: Copy SVG', {
      style: styleLabel(store.avatarStyleName),
    });

    // The button confirms the copy for a moment as well.
    copied.value = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = false), 1600);
  }

  title.value = successful
    ? 'Your avatar was copied'
    : 'Your avatar could not be copied';

  showDialog();
}
</script>

<template>
  <button
    type="button"
    class="site-btn site-btn-secondary pg-button-copy"
    @click="onClick"
  >
    <component :is="copied ? Check : Copy" :size="16" aria-hidden="true" />
    <span aria-live="polite">{{ copied ? 'Copied' : 'Copy SVG' }}</span>
  </button>

  <PlaygroundDone
    v-model:open="open"
    :title="title"
    :options="options"
    source="copy"
  />
</template>

<style scoped lang="scss">
.pg-button-copy {
  width: 100%;
  min-width: 0;
  padding: 0 12px;
  font-size: 15px;
}
</style>
