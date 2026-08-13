<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ThemeOptions } from '@theme/types';
import { UiCard, UiCode as Code } from '../ui';
import { kebabCase } from 'change-case';
import { safeHttpUrl } from '@theme/utils/url';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import StylePopularity from './StylePopularity.vue';

const { theme } = useData<ThemeOptions>();

const props = defineProps<{
  styleName: string;
}>();

const style = computed(() => {
  return theme.value.avatarStyles[props.styleName];
});

const exampleHttpApiUrl = computed(() => {
  return `https://api.dicebear.com/10.x/${kebabCase(props.styleName)}/svg`;
});

const exampleDefinitionImport = computed(() => {
  return `import definition from '@dicebear/styles/${kebabCase(props.styleName)}.json' with { type: 'json' };`;
});

const exampleCliCommand = computed(() => {
  return `dicebear ${props.styleName}`;
});

type Row =
  | { label: string; type: 'code'; code: string; lang?: string }
  | { label: string; type: 'link'; href: string; text?: string }
  | { label: string; type: 'text'; text: string };

const namingRows = computed<Row[]>(() => {
  const rows: Row[] = [
    {
      label: 'Definition Import',
      type: 'code',
      code: exampleDefinitionImport.value,
      lang: 'js',
    },
    { label: 'CLI', type: 'code', code: exampleCliCommand.value },
    { label: 'HTTP-API', type: 'link', href: exampleHttpApiUrl.value },
  ];

  if (style.value.definitionUrl) {
    rows.push({
      label: 'Definition',
      type: 'link',
      href: style.value.definitionUrl,
    });
  }

  return rows;
});

function linkOrText(
  label: string,
  text: string | undefined,
  url: string | undefined,
): Row | null {
  if (!text) {
    return null;
  }

  const href = safeHttpUrl(url);

  return href
    ? { label, type: 'link', href, text }
    : { label, type: 'text', text };
}

const sourceRows = computed<Row[]>(() => {
  const meta = style.value.meta;

  return [
    linkOrText('Title', meta.title, undefined),
    // Creator/Website both link to the homepage URL.
    linkOrText('Creator', meta.creator, meta.homepage),
    linkOrText('Website', meta.homepage, meta.homepage),
    linkOrText('License', meta.license?.name, meta.license?.url),
    linkOrText('Source', meta.source, meta.source),
  ].filter((row): row is Row => row !== null);
});
</script>

<template>
  <UiCard class="style-info-section" title="Naming">
    <DataTable :value="namingRows">
      <Column field="label" style="width: 200px" />
      <Column>
        <template #body="{ data }">
          <Code
            v-if="data.type === 'code'"
            :lang="data.lang"
            :code="data.code"
          />
          <a
            v-else-if="data.type === 'link'"
            :href="data.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ data.text ?? data.href }}
          </a>
          <template v-else>{{ data.text }}</template>
        </template>
      </Column>
    </DataTable>
  </UiCard>

  <UiCard class="style-info-section" title="Source">
    <DataTable :value="sourceRows">
      <Column field="label" style="width: 200px" />
      <Column>
        <template #body="{ data }">
          <a
            v-if="data.type === 'link'"
            :href="data.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ data.text ?? data.href }}
          </a>
          <template v-else>{{ data.text }}</template>
        </template>
      </Column>
    </DataTable>
  </UiCard>

  <StylePopularity :style-name="styleName" />
</template>

<style lang="scss" scoped>
.style-info-section {
  margin-bottom: 16px;

  :deep(.p-datatable-thead) {
    display: none;
  }
}
</style>
