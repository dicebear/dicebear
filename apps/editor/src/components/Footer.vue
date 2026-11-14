<script setup lang="ts">
import useMainStore from '@/stores/main';
import type { Style } from '@dicebear/core';
import { computed } from 'vue';
import availableStyles from '@/config/styles';
import { useI18n } from 'vue-i18n';
import {
  privacyPolicyUrl,
  cookiePolicyUrl,
  legalNoticeUrl,
} from '@/config/legal';

const props = defineProps<{
  tab: string;
}>();

const store = useMainStore();
const { t } = useI18n();

const version = __dicebearEditorVersion;

const visibleStyles = computed<Style[]>(() => {
  if (props.tab === 'style') {
    return Object.values(availableStyles).map((v) => v.style);
  }

  return [availableStyles[store.selectedStyleName].style];
});

type MetaEntry = {
  title?: string;
  creator?: string;
  creatorUrl?: string;
  sourceUrl?: string;
  licenseName?: string;
  licenseUrl?: string;
};

const metaList = computed(() => {
  const result: MetaEntry[] = [];
  const knownSources: string[] = [];

  for (const style of visibleStyles.value) {
    const meta = style.meta();
    const creatorName = meta.creator().name();
    const sourceUrl = meta.source().url();

    if (!creatorName || creatorName === 'Florian Körner') {
      continue;
    }

    if (sourceUrl) {
      if (knownSources.includes(sourceUrl)) {
        continue;
      }

      knownSources.push(sourceUrl);
    }

    result.push({
      title: meta.source().name(),
      creator: creatorName,
      creatorUrl: meta.creator().url(),
      sourceUrl,
      licenseName: meta.license().name(),
      licenseUrl: meta.license().url(),
    });
  }

  return result;
});
</script>

<template>
  <div class="footer">
    <div class="footer-header">DiceBear Editor - v.{{ version }}</div>
    <ul class="footer-links">
      <li>
        <a :href="t('documentationLink')" target="_blank">
          {{ t('documentation') }}
        </a>
      </li>
      <li v-if="privacyPolicyUrl">
        <a :href="privacyPolicyUrl" target="_blank">
          {{ t('privacyPolicy') }}
        </a>
      </li>
      <li v-if="cookiePolicyUrl">
        <a :href="cookiePolicyUrl" target="_blank">
          {{ t('cookiePolicy') }}
        </a>
      </li>
      <li v-if="legalNoticeUrl">
        <a :href="legalNoticeUrl" target="_blank">
          {{ t('legalNotice') }}
        </a>
      </li>
      <li>
        CDN Sponsored by
        <a href="https://bunny.net/" target="_blank" rel="noopener sponsored"
          >bunny.net</a
        >
        (Advertisement)
      </li>
    </ul>
    <div class="footer-header" v-if="metaList.length > 0">
      {{ t('licenses') }}
    </div>
    <p class="footer-licenses" v-if="metaList.length > 0">
      <template v-for="meta in metaList" :key="meta.sourceUrl">
        <a :href="meta.sourceUrl" target="_blank" rel="noopener noreferrer">{{
          meta.title
        }}</a>
        by
        <a :href="meta.creatorUrl" target="_blank" rel="noopener noreferrer">{{
          meta.creator
        }}</a>
        /
        <a :href="meta.licenseUrl" target="_blank" rel="noopener noreferrer">{{
          meta.licenseName?.replace(/\.$/, '')
        }}</a>.
        {{ ' ' }}
      </template>
      <template v-if="metaList.length === 1"> Remix of the original. </template>
      <template v-else>
        - All avatars are remixes of the original works.
      </template>
    </p>
  </div>
</template>

<style lang="scss">
.footer {
  background-color: #f8fafc;
  padding: 16px;
  margin-top: 40px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 12px;

  &-header {
    margin-top: 20px;
    font-weight: 500;

    &:first-child {
      margin-top: 0;
    }
  }

  &-links {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    column-gap: 12px;
    row-gap: 4px;
  }

  a {
    border-bottom: 1px dashed;
    color: currentColor;
    text-decoration: none;

    &:hover {
      border-bottom-style: solid;
      color: #475569;
    }
  }
}
</style>
