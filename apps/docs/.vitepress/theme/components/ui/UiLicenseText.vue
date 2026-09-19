<script setup lang="ts">
import { computed, toRef } from 'vue';
import { capitalCase, kebabCase } from 'change-case';
import { useAvatarStyleMeta } from '@theme/composables/avatar';
import { formatLicenseName } from '@theme/utils/format';
import { safeHttpUrl } from '@theme/utils/url';

const props = defineProps<{
  styleName: string;
}>();

const avatarStyleMeta = useAvatarStyleMeta(toRef(props, 'styleName'));

const sourceUrl = computed(() => safeHttpUrl(avatarStyleMeta.value?.source));
const homepageUrl = computed(() =>
  safeHttpUrl(avatarStyleMeta.value?.homepage),
);
const licenseUrl = computed(() =>
  safeHttpUrl(avatarStyleMeta.value?.license?.url),
);

const displayName = computed(() => capitalCase(props.styleName));
const styleLink = computed(() => `/styles/${kebabCase(props.styleName)}/`);
</script>

<template>
  <p class="ui-license-text">
    <template v-if="avatarStyleMeta?.creator !== 'DiceBear'">
      The avatar style
    </template>
    <a :href="styleLink">{{ displayName }}</a>
    <template v-if="avatarStyleMeta?.creator !== 'DiceBear'">
      <template
        v-if="
          avatarStyleMeta?.license?.name !== 'MIT' &&
          avatarStyleMeta?.creator !== 'DiceBear' &&
          avatarStyleMeta?.title
        "
      >
        is a remix of:
      </template>
      <template v-else> is based on: </template>
      <a
        v-if="sourceUrl"
        :href="sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ avatarStyleMeta?.title ?? 'Design' }}
      </a>
      <template v-else>{{ avatarStyleMeta?.title ?? 'Design' }}</template>
    </template>
    by
    <a
      v-if="homepageUrl"
      :href="homepageUrl"
      target="_blank"
      rel="noopener noreferrer"
      >{{ avatarStyleMeta?.creator }}</a
    >
    <template v-else>{{ avatarStyleMeta?.creator }}</template
    >, licensed under
    <a
      v-if="licenseUrl"
      :href="licenseUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ formatLicenseName(avatarStyleMeta?.license?.name) }}
    </a>
    <template v-else>{{
      formatLicenseName(avatarStyleMeta?.license?.name)
    }}</template>
    .
  </p>
</template>

<style scoped lang="scss">
.ui-license-text {
  margin: 0;

  a {
    font-weight: 500;
    color: var(--db-brand-text);
    text-decoration-style: dotted;
    transition: color var(--duration-fast);
    cursor: pointer;

    &:hover {
      color: var(--db-brand);
    }
  }
}
</style>
