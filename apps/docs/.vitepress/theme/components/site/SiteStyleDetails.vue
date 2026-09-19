<script setup lang="ts">
/**
 * Who drew the style, where it comes from, and the two files that matter:
 * the HTTP API endpoint and the definition.
 */
import { computed } from 'vue';
import { kebabCase } from 'change-case';
import { Download } from '@lucide/vue';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { safeHttpUrl } from '@theme/utils/url';
import { formatLicenseName } from '@theme/utils/format';
import { useDefinitionDownload } from '@theme/composables/useDefinitionDownload';
import { UiCopyButton } from '../ui';

const props = defineProps<{
  styleName: string;
}>();

const { theme } = useData<ThemeOptions>();
const style = computed(() => theme.value.avatarStyles[props.styleName]);
const meta = computed(() => style.value?.meta);

const apiUrl = computed(
  () =>
    `https://api.dicebear.com/${theme.value.majorVersion}.x/${kebabCase(props.styleName)}/svg`,
);

const {
  url: definitionUrl,
  pending,
  download,
} = useDefinitionDownload(() => props.styleName);

interface Row {
  label: string;
  text: string;
  href?: string;
}

const rows = computed<Row[]>(() => {
  const m = meta.value;
  if (!m) {
    return [];
  }
  const list: (Row | null)[] = [
    m.title ? { label: 'Title', text: m.title } : null,
    m.creator
      ? {
          label: 'Creator',
          text: m.creator,
          href: safeHttpUrl(m.homepage) ?? undefined,
        }
      : null,
    m.homepage
      ? {
          label: 'Website',
          text: m.homepage,
          href: safeHttpUrl(m.homepage) ?? undefined,
        }
      : null,
    m.source
      ? {
          label: 'Source',
          text: m.source,
          href: safeHttpUrl(m.source) ?? undefined,
        }
      : null,
    m.license?.name
      ? {
          label: 'License',
          text: formatLicenseName(m.license.name),
          href: safeHttpUrl(m.license.url) ?? undefined,
        }
      : null,
  ];
  return list.filter((row): row is Row => row !== null);
});
</script>

<template>
  <div class="site-facts site-style-details">
    <div v-for="row in rows" :key="row.label" class="site-fact">
      <b>{{ row.label }}</b>
      <span>
        <a
          v-if="row.href"
          :href="row.href"
          target="_blank"
          rel="noopener noreferrer"
          class="hv-link"
          >{{ row.text }}</a
        >
        <template v-else>{{ row.text }}</template>
      </span>
    </div>
    <div class="site-fact">
      <b>HTTP API</b>
      <div class="site-style-details-file">
        <code>{{ apiUrl }}</code>
        <UiCopyButton :text="apiUrl" />
      </div>
    </div>
    <div v-if="definitionUrl" class="site-fact">
      <b>Definition</b>
      <div>
        <div class="site-style-details-file">
          <code>{{ kebabCase(styleName) }}.json</code>
          <button
            type="button"
            class="site-style-details-download hv-link"
            :disabled="pending"
            @click="download"
          >
            <Download :size="14" />
            Download
          </button>
          <UiCopyButton :text="definitionUrl" />
        </div>
        <p class="site-style-details-note">
          Import it into Figma with
          <a
            href="https://www.figma.com/community/plugin/1005765655729342787"
            target="_blank"
            rel="noopener noreferrer"
            class="hv-link"
            >DiceBear Studio</a
          >
          to change the style. See
          <a href="/create-styles/edit-a-style/" class="hv-link">the guide</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-style-details {
  /* A source URL has no spaces, so it breaks wherever the column ends. */
  .site-fact > span {
    overflow-wrap: anywhere;
  }

  a {
    color: var(--db-brand-text);
  }

  &-file {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    min-width: 0;

    code {
      min-width: 0;
      font-family: var(--db-font-mono);
      font-size: 14px;
      color: var(--db-ink);
      word-break: break-all;
    }
  }

  &-download {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--db-brand-text);
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: default;
    }
  }

  &-note {
    margin: 8px 0 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--db-muted);
  }
}
</style>
