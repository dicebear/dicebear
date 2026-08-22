<script setup lang="ts">
/**
 * The usage tabs of a style page. The code comes from usageSnippets.ts, the
 * module the Markdown mirrors read as well; only the copy around it lives
 * here.
 */
import { UiCard, UiCode as Code } from '../ui';
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import { httpApiUrl, usageSnippets } from '@theme/config/usageSnippets';
import type { ThemeOptions } from '@theme/types';

const props = defineProps<{
  styleName: string;
}>();

const { theme } = useData<ThemeOptions>();

const tab = ref('http-api');

const snippets = computed(() =>
  usageSnippets(props.styleName, { major: theme.value.majorVersion }),
);

// Short names for the tab bar and the docs links, where the full language
// names would crowd the row.
const shortLabels: Record<string, string> = {
  'http-api': 'HTTP-API',
  'js-library': 'JS',
  'php-library': 'PHP',
  'python-library': 'Python',
  'rust-library': 'Rust',
  'go-library': 'Go',
  'dart-library': 'Dart',
  'csharp-library': 'C#',
  cli: 'CLI',
};

const installIntros: Record<string, string> = {
  'js-library': 'First install the required packages via npm:',
  'php-library': 'First install the required packages via Composer:',
  'python-library': 'First install the required packages via pip:',
  'rust-library': 'First add the required crates via Cargo:',
  'go-library': 'First add the required modules with go get:',
  'dart-library': 'First add the required packages with dart pub:',
  'csharp-library': 'First add the required package with the dotnet CLI:',
  cli: 'First install the CLI package via npm:',
};

const exampleHttpApiImgTag = computed(() => {
  return `<img
  src="${httpApiUrl(props.styleName, { major: theme.value.majorVersion })}"
  alt="avatar"
/>`;
});
</script>

<template>
  <UiCard class="style-usage" flush>
    <Tabs v-model:value="tab">
      <TabList>
        <Tab v-for="snippet in snippets" :key="snippet.id" :value="snippet.id">
          {{ shortLabels[snippet.id] }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel
          v-for="snippet in snippets"
          :key="snippet.id"
          :value="snippet.id"
          class="style-usage-body"
        >
          <template v-if="snippet.id === 'http-api'">
            <p>Use this URL to request this avatar style via our HTTP API.</p>
            <Code :code="snippet.code" />

            <p>You can use the URL directly as image source.</p>
            <Code lang="html" :code="exampleHttpApiImgTag" />
          </template>
          <template v-else>
            <p>{{ installIntros[snippet.id] }}</p>
            <Code :code="snippet.install ?? ''" />

            <p>Then you can create this avatar as follows:</p>
            <Code :lang="snippet.lang" :code="snippet.code" />
          </template>
          <p>
            See <a :href="snippet.docs">{{ shortLabels[snippet.id] }}</a> docs
            for more information.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </UiCard>
</template>

<style lang="scss" scoped>
.style-usage {
  overflow: hidden;

  :deep(.style-usage-body) {
    > *:first-child {
      margin-top: 0 !important;
    }

    > *:last-child {
      margin-bottom: 0 !important;
    }
  }
}
</style>
