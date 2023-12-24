<script setup lang="ts">
import { mdiClose, mdiContentCopy } from '@mdi/js';
import { computed, ref, watchEffect } from 'vue';
import copy from 'copy-to-clipboard';
import { createAvatar } from '@dicebear/core';
import useStore from '@playground/store';
import { loadAvatarStyle } from '@shared/utils/avatar';
import Avatar from '@shared/components/Avatar.vue';
import LicenseText from './LicenseText.vue';
import Confetti from './Confetti.vue';

const props = defineProps<{
  seed: string;
}>();

const store = useStore();

const open = ref(false);
const text = ref('');
const options = computed(() => {
  return {
    ...store.avatarStyleOptionsWithoutDefaults,
    seed: props.seed,
  };
});

async function onClick() {
  const avatarStyle = await loadAvatarStyle(store.avatarStyleName);
  const avatar = createAvatar(avatarStyle, {
    ...options.value,
    size: 512,
  });

  const successful = copy(avatar.toString());

  text.value = successful
    ? 'Your avatar was successfully copied! 🎉'
    : 'Your avatar could not be copied. 😞';

  open.value = true;
}

function onClose() {
  open.value = false;
}
</script>

<template>
  <v-tooltip text="Copy" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn
        variant="tonal"
        color="primary"
        density="comfortable"
        v-bind="props"
        block
        @click="onClick"
      >
        <v-icon :icon="mdiContentCopy" />
      </v-btn>
    </template>
  </v-tooltip>

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
      <v-card-title class="dialog-title">{{ text }}</v-card-title>
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
