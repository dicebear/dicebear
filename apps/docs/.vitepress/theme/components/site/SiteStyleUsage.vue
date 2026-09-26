<script setup lang="ts">
/**
 * How to render one avatar of the style, one tab per way in. The HTTP API
 * comes first, because an img tag pointed at it needs no install at all.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ArrowRight } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import { httpApiUrl, usageSnippets } from '@theme/config/usageSnippets';
import { exampleSeeds } from '@theme/config/styleCategories';
import { styleLabel, track } from '@theme/utils/track';
import { useCodeTab } from '@theme/composables/useCodeTab';
import { UiCode, type UiCodeTab } from '../ui';

const props = defineProps<{
  styleName: string;
}>();

const { theme } = useData<ThemeOptions>();

interface UsageTab extends UiCodeTab {
  docs: string;
  docsLabel: string;
  /** A sentence under the code, where there is nothing to install. */
  note?: string;
}

/** The install command as the first line of the snippet, in that language's comment syntax. */
function withInstall(
  code: string,
  install: string | undefined,
  lang: string | undefined,
): string {
  if (!install) {
    return code;
  }
  const marker = lang === 'python' || lang === undefined ? '#' : '//';
  const lines = install.split('\n').map((line) => `${marker} ${line}`);
  return `${lines.join('\n')}\n\n${code}`;
}

const tabs = computed<UsageTab[]>(() => {
  const options = { major: theme.value.majorVersion, seed: exampleSeeds[0] };
  const url = httpApiUrl(props.styleName, options);
  // The URL on its own, since it goes into far more than an img tag.
  const http: UsageTab = {
    id: 'http-api',
    label: 'HTTP API',
    code: url,
    note: 'The URL works wherever an image URL does, and there is nothing to install.',
    docs: '/integrations/http-api/',
    docsLabel: 'HTTP API',
  };
  const rest = usageSnippets(props.styleName, options)
    .filter((snippet) => snippet.id !== 'http-api')
    .map((snippet) => ({
      id: snippet.id,
      label: snippet.label,
      lang: snippet.lang,
      code: withInstall(snippet.code, snippet.install, snippet.lang),
      docs: snippet.docs,
      docsLabel: snippet.label,
    }));
  return [http, ...rest];
});

const active = useCodeTab();
const current = computed(
  () => tabs.value.find((tab) => tab.id === active.value) ?? tabs.value[0],
);

function onTab(id: string | undefined) {
  active.value = id ?? tabs.value[0].id;
  track('Style Usage: Tab', {
    style: styleLabel(props.styleName),
    tab: active.value,
  });
}
</script>

<template>
  <div class="site-style-usage">
    <UiCode :tabs="tabs" :model-value="active" @update:model-value="onTab" />
    <p v-if="current.note" class="site-style-usage-note">{{ current.note }}</p>
    <a :href="current.docs" class="site-style-usage-docs hv-link">
      {{ current.docsLabel }} documentation
      <ArrowRight :size="16" />
    </a>
  </div>
</template>

<style scoped lang="scss">
.site-style-usage {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;

  &-note {
    margin: 0;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-muted);
  }

  &-docs {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    color: var(--db-brand-text);
  }
}
</style>
