<script setup lang="ts">
import useMainStore from '@/stores/main';
import type { Style, StyleMeta } from '@dicebear/core';
import { computed } from '@vue/reactivity';
import availableStyles from '@/config/styles';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  tab: string;
}>();

const store = useMainStore();
const { t } = useI18n();

const version = __dicebearEditorVersion;

const visibleStyles = computed<Style<any>[]>(() => {
  if (props.tab === 'style') {
    return Object.values(availableStyles).map((v) => v.style);
  }

  return [availableStyles[store.selectedStyleName].style];
});

const metaList = computed(() => {
  const result: StyleMeta[] = [];
  const knownWork: string[] = [];

  for (const val of visibleStyles.value) {
    if (!val.meta || val.meta.creator === 'Florian Körner') continue;

    if (val.meta.source) {
      if (knownWork.includes(val.meta.source)) {
        continue;
      }

      knownWork.push(val.meta.source);
    }

    result.push(val.meta);
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
      <li>
        <a :href="t('privacyPolicyLink')" target="_blank">
          {{ t('privacyPolicy') }}
        </a>
      </li>
      <li>
        <a :href="t('siteNoticeLink')" target="_blank">
          {{ t('siteNotice') }}
        </a>
      </li>
      <li>
        <a href="https://bunny.net" target="_blank"> bunny.net (Sponsor) </a>
      </li>
    </ul>
    <div class="footer-header" v-if="metaList.length > 0">
      {{ t('licenses') }}
    </div>
    <p class="footer-licenses" v-if="metaList.length > 0">
      <template v-for="meta in metaList">
        <a :href="meta.source" target="_blank" rel="noopener noreferrer">{{
          meta.title
        }}</a>
        by
        <a :href="meta.homepage" target="_blank" rel="noopener noreferrer">{{
          meta.creator
        }}</a>
        /
        <a
          :href="meta.license?.url"
          target="_blank"
          rel="noopener noreferrer"
          >{{ meta.license?.name.replace(/\.$/, '') }}</a
        >.
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
