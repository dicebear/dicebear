<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ThemeOptions } from '@theme/types';
import { Download } from '@lucide/vue';
import { UiCard, UiCopyButton } from '../ui';
import { kebabCase } from 'change-case';
import { safeHttpUrl } from '@theme/utils/url';
import { useDefinitionDownload } from '@theme/composables/useDefinitionDownload';
import StylePopularity from './StylePopularity.vue';

const { theme } = useData<ThemeOptions>();

const props = defineProps<{
  styleName: string;
}>();

const style = computed(() => {
  return theme.value.avatarStyles[props.styleName];
});

const exampleHttpApiUrl = computed(() => {
  return `https://api.dicebear.com/11.x/${kebabCase(props.styleName)}/svg`;
});

interface UrlRow {
  label: string;
  url: string;
  /** The definition is a file to keep, so its row offers a save as well. */
  downloadable?: boolean;
}

interface SourceRow {
  label: string;
  text: string;
  href?: string;
}

const urlRows = computed<UrlRow[]>(() => {
  const rows: UrlRow[] = [{ label: 'HTTP-API', url: exampleHttpApiUrl.value }];

  if (style.value.definitionUrl) {
    rows.push({
      label: 'Definition',
      url: style.value.definitionUrl,
      downloadable: true,
    });
  }

  return rows;
});

function linkOrText(
  label: string,
  text: string | undefined,
  url: string | undefined,
): SourceRow | null {
  if (!text) {
    return null;
  }

  return { label, text, href: safeHttpUrl(url) };
}

const { download, pending } = useDefinitionDownload(() => props.styleName);

const sourceRows = computed<SourceRow[]>(() => {
  const meta = style.value.meta;

  return [
    linkOrText('Title', meta.title, undefined),
    // Creator/Website both link to the homepage URL.
    linkOrText('Creator', meta.creator, meta.homepage),
    linkOrText('Website', meta.homepage, meta.homepage),
    linkOrText('License', meta.license?.name, meta.license?.url),
    linkOrText('Source', meta.source, meta.source),
  ].filter((row): row is SourceRow => row !== null);
});
</script>

<template>
  <UiCard class="style-info-section" title="URLs" flush>
    <dl class="style-info-rows">
      <div v-for="row in urlRows" :key="row.label" class="style-info-row">
        <dt class="ui-eyebrow">{{ row.label }}</dt>
        <dd class="style-info-value">
          <span class="style-info-code">
            <a :href="row.url" target="_blank" rel="noopener noreferrer">
              {{ row.url }}
            </a>
          </span>
          <UiCopyButton
            class="ui-copy-button style-info-copy"
            :text="row.url"
          />
          <button
            v-if="row.downloadable"
            class="ui-copy-button style-info-copy"
            :disabled="pending"
            title="Download"
            @click="download"
          >
            <Download :size="14" />
          </button>
        </dd>
      </div>
    </dl>
    <p class="style-info-note">
      Import the definition into Figma with
      <a
        href="https://www.figma.com/community/plugin/1005765655729342787"
        target="_blank"
        rel="noopener noreferrer"
        >DiceBear Studio</a
      >
      to change this style. See the
      <a href="/create-styles/edit-a-style/">guide</a>.
    </p>
  </UiCard>

  <UiCard
    v-if="sourceRows.length"
    class="style-info-section"
    title="Source"
    flush
  >
    <dl class="style-info-rows">
      <div v-for="row in sourceRows" :key="row.label" class="style-info-row">
        <dt class="ui-eyebrow">{{ row.label }}</dt>
        <dd class="style-info-value">
          <a
            v-if="row.href"
            :href="row.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ row.text }}
          </a>
          <template v-else>{{ row.text }}</template>
        </dd>
      </div>
    </dl>
  </UiCard>

  <StylePopularity :style-name="styleName" />
</template>

<style lang="scss" scoped>
.style-info-section {
  margin-bottom: 16px;
}

.style-info-rows {
  margin: 0;
  padding: 0;
}

.style-info-row {
  display: grid;
  /* Fixed label track so the columns line up across the stacked URLs and
     Source cards; max-content would size each card on its own. */
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 4px 16px;
  align-items: center;
  padding: 10px var(--ui-card-padding);

  & + & {
    border-top: 1px solid var(--ui-card-border-color);
  }
}

.style-info-value {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 14px;
  line-height: 1.6;

  /* Long source URLs break instead of running past the card edge. */
  > a {
    min-width: 0;
    overflow-wrap: anywhere;
  }
}

.style-info-code {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
}

.style-info-note {
  margin: 0;
  padding: 10px var(--ui-card-padding) 12px;
  border-top: 1px solid var(--ui-card-border-color);
  font-size: 13px;
  line-height: 1.6;
  color: var(--ui-c-text-muted);
}

/* The button chrome comes from the global .ui-copy-button class; this row
   only adds the hover reveal. */
.style-info-copy {
  flex: none;
  opacity: 0;
}

.style-info-row:hover .style-info-copy,
.style-info-copy:focus-visible {
  opacity: 1;
}

/* Touch screens have no hover to reveal the button. */
@media (hover: none) {
  .style-info-copy {
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .style-info-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
