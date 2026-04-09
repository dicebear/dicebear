<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ThemeOptions } from '@theme/types';
import { kebabCase } from 'change-case';
import { formatLicenseName } from '@theme/utils/format';
import { safeHttpUrl } from '@theme/utils/url';

const { theme } = useData<ThemeOptions>();
const props = defineProps<{
  styleName: string;
}>();

const style = computed(() => {
  return theme.value.avatarStyles[props.styleName];
});

const playgroundUrl = computed(() => {
  return `/playground?style=${kebabCase(props.styleName)}`;
});

const sourceUrl = computed(() => safeHttpUrl(style.value.meta?.source));
const homepageUrl = computed(() => safeHttpUrl(style.value.meta?.homepage));
const licenseUrl = computed(() => safeHttpUrl(style.value.meta?.license?.url));
</script>

<template>
  <p>
    <template v-if="style.meta?.creator !== 'DiceBear' && style.meta?.title">
      <template v-if="style.meta?.license?.name !== 'MIT'">
        This avatar style is a remix of:
      </template>
      <template v-else> This avatar style is based on: </template>
    </template>
    <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener noreferrer">
      {{ style.meta?.title ?? 'Design' }}
    </a>
    <template v-else>{{ style.meta?.title ?? 'Design' }}</template>
    by
    <a v-if="homepageUrl" :href="homepageUrl" target="_blank" rel="noopener noreferrer">{{ style.meta?.creator }}</a>
    <template v-else>{{ style.meta?.creator }}</template>, licensed under
    <a
      v-if="licenseUrl"
      :href="licenseUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ formatLicenseName(style.meta?.license?.name) }}
    </a>
    <template v-else>{{ formatLicenseName(style.meta?.license?.name) }}</template>
    .
  </p>

  <div class="info custom-block" v-if="style.meta.license?.name !== 'MIT'">
    <p class="custom-block-title">LICENSE</p>
    <p>
      While our code is MIT licensed, the design of this avatar style is
      licensed under
      <a
        v-if="licenseUrl"
        :href="licenseUrl"
        target="_blank"
        rel="noopener noreferrer"
        >{{ formatLicenseName(style.meta.license?.name) }}</a
      >
      <template v-else>{{ formatLicenseName(style.meta.license?.name) }}</template>. See <a href="#details">details</a> for more information.
    </p>
  </div>

  <a
    :href="playgroundUrl"
    class="style-description-btn"
  >
    Open in Playground
  </a>
</template>

<style lang="scss" scoped>
.style-description {
  &-btn {
    display: inline-flex;
    align-items: center;
    padding: 8px 20px;
    border-radius: var(--vp-radius-xs);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
    transition: all var(--duration-fast) ease;
    margin-right: 8px;

    &:hover {
      background: var(--vp-c-brand-1);
      color: white;
    }
  }
}
</style>
