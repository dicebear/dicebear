<script setup lang="ts">
import { paramCase } from 'change-case';
import Code from '@shared/components/Code.vue';
import { computed, ref } from 'vue';
import { VTabs, VTab, VWindow, VWindowItem } from 'vuetify/components';

const props = defineProps<{
  styleName: string;
}>();

const tab = ref<'http-api' | 'js-library' | 'cli'>();

const exampleHttpApiUrl = computed(() => {
  return `https://api.dicebear.com/8.x/${paramCase(props.styleName)}/svg`;
});

const exampleHttpApiImgTag = computed(() => {
  return `<img
  src="https://api.dicebear.com/8.x/${paramCase(props.styleName)}/svg"
  alt="avatar"
/>`;
});

const exampleJsLibraryInstall = computed(() => {
  return `npm install @dicebear/core @dicebear/collection --save`;
});

const exampleJsLibraryUsage = computed(() => {
  return `import { createAvatar } from '@dicebear/core';
import { ${props.styleName} } from '@dicebear/collection';

const avatar = createAvatar(${props.styleName}, {
  // ... options
});

const svg = avatar.toString();
`;
});

const exampleCliInstall = computed(() => {
  return `npm install --global dicebear`;
});

const exampleCliUsage = computed(() => {
  return `dicebear ${props.styleName}`;
});

const touchless = { left: () => {}, right: () => {} };
</script>

<template>
  <v-card variant="flat">
    <v-tabs v-model="tab" bg-color="secondary">
      <v-tab value="http-api">HTTP-API</v-tab>
      <v-tab value="js-library">JS-Library</v-tab>
      <v-tab value="cli">CLI</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab" :touch="touchless">
        <v-window-item value="http-api" class="usage-card-body">
          <p>Use this URL to request this avatar style via our HTTP API.</p>
          <Code :code="exampleHttpApiUrl" />

          <p>You can use the URL directly as image source.</p>
          <Code lang="html" :code="exampleHttpApiImgTag" />
          <p>
            See <a href="/how-to-use/http-api">HTTP-API</a> docs for more
            information.
          </p>
        </v-window-item>
        <v-window-item value="js-library" class="usage-card-body">
          <p>First install the required packages via npm:</p>
          <Code :code="exampleJsLibraryInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code lang="js" :code="exampleJsLibraryUsage" />
          <p>
            See <a href="/how-to-use/js-library">JS-Library</a> docs for more
            information.
          </p>
        </v-window-item>
        <v-window-item value="cli" class="usage-card-body">
          <p>First install the CLI package via npm:</p>
          <Code :code="exampleCliInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code :code="exampleCliUsage" />
          <p>
            See <a href="/how-to-use/cli">CLI</a> docs for more information.
          </p>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.usage-card-body {
  > *:first-child {
    margin-top: 0 !important;
  }

  > *:last-child {
    margin-bottom: 0 !important;
  }
}
</style>
