<script setup lang="ts">
import { mdiCodeTags, mdiClose } from '@mdi/js';
import useStore from '@playground/store';
import { computed, ref } from 'vue';
import Avatar from '@shared/components/Avatar.vue';
import Code from '@shared/components/Code.vue';
import LicenseText from './LicenseText.vue';
import { getAvatarApiUrl, getAvatarApiCommand } from '@shared/utils/avatar';

const props = defineProps<{
  seed: string;
}>();

const store = useStore();

const open = ref(false);
const tab = ref<'http-api' | 'js-library' | 'cli'>();
const options = computed(() => {
  return {
    seed: props.seed,
    ...store.avatarStyleOptionsWithoutDefaults,
  };
});

const exampleHttpApi = computed(() =>
  getAvatarApiUrl(store.avatarStyleName, options.value)
);
const exampleHttpApiHtml = computed(
  () => `<img
  src="${getAvatarApiUrl(store.avatarStyleName, options.value)}"
  alt="avatar" />`
);
const exampleJsLibrary = computed(
  () => `import { createAvatar } from '@dicebear/core';
import { ${store.avatarStyleName} } from '@dicebear/collection';

const avatar = createAvatar(${store.avatarStyleName}, ${JSON.stringify(
    options.value,
    null,
    2
  )});

const svg = avatar.toString();`
);
const exampleCli = computed(() =>
  getAvatarApiCommand(store.avatarStyleName, options.value)
);

function onOpen() {
  open.value = true;
}

function onClose() {
  open.value = false;
}

const touchless = { left: () => {}, right: () => {} };
</script>

<template>
  <v-tooltip text="How to use" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn
        variant="tonal"
        color="primary"
        density="comfortable"
        class="preview-actions-btn"
        v-bind="props"
        block
        @click="onOpen"
      >
        <v-icon :icon="mdiCodeTags" />
      </v-btn>
    </template>
  </v-tooltip>

  <v-dialog v-model="open" width="800">
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
      <v-card-item
        title="How to use"
        subtitle="Let's see how you can use this avatar in your project."
        class="dialog-header"
      >
        <template #prepend>
          <Avatar
            :style-name="store.avatarStyleName"
            :style-options="options"
            :size="48"
          />
        </template>
      </v-card-item>
      <div class="dialog-preview"></div>
      <v-card-text class="dialog-text">
        <v-tabs v-model="tab" class="dialog-tabs">
          <v-tab value="http-api">HTTP-API</v-tab>
          <v-tab value="js-library">JS-Library</v-tab>
          <v-tab value="cli">CLI</v-tab>
        </v-tabs>

        <v-window v-model="tab" :touch="touchless">
          <v-window-item value="http-api">
            <p>Use this URL to request this avatar style via our HTTP API.</p>
            <Code :code="exampleHttpApi" />
            <p>You can use the URL directly as image source.</p>
            <Code :code="exampleHttpApiHtml" lang="html" />
            <p>
              See <a href="/how-to-use/http-api">HTTP-API</a> docs for more
              information.
            </p>
          </v-window-item>
          <v-window-item value="js-library">
            <p>First install the required packages via npm:</p>
            <Code
              code="npm install @dicebear/core @dicebear/collection --save"
            />
            <p>Then you can create this avatar as follows:</p>
            <Code :code="exampleJsLibrary" lang="js" />
            <p>
              See <a href="/how-to-use/js-library">JS-Library</a> docs for more
              information.
            </p>
          </v-window-item>
          <v-window-item value="cli">
            <p>First install the CLI package via npm:</p>
            <Code code="npm install --global dicebear" />
            <p>Then you can create this avatar as follows:</p>
            <Code :code="exampleCli" />
            <v-alert type="warning" variant="tonal" class="mb-3">
              Command example is for demonstration purposes only. The example
              includes user input and may be unsafe. Please check the command
              before executing it. We are not responsible for any damage.
            </v-alert>
            <p>
              See <a href="/how-to-use/cli">CLI</a> docs for more information.
            </p>
          </v-window-item>
        </v-window>

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

<style scoped lang="scss">
.dialog-tabs {
  margin-bottom: 1.5rem;
}

.dialog-text {
  padding: 1.5rem !important;

  a {
    color: var(--vp-c-brand);

    &:hover {
      color: var(--vp-c-brand-dark);
    }
  }
}

.dialog-license {
  margin-top: 20px;
}

.dialog-license strong {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.dialog-close-btn {
  position: fixed;
  top: 14px;
  right: 24px;
}
</style>
