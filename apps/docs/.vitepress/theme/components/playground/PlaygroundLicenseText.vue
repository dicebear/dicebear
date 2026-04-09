<script setup lang="ts">
import { useAvatarStyleMeta } from '@theme/composables/avatar';
import { loadAvatarStyle } from '@theme/utils/avatar';
import { capitalCase, kebabCase } from 'change-case';
import { computed, toRef } from 'vue';
import { computedAsync } from '@vueuse/core';
import useStore from '@theme/stores/playground';
import { formatLicenseName } from '@theme/utils/format';
import { safeHttpUrl } from '@theme/utils/url';

const store = useStore();

const avatarStyleMeta = useAvatarStyleMeta(toRef(store, 'avatarStyleName'));

// For custom styles, load meta from the Style object directly
const customStyleMeta = computedAsync(async () => {
  if (!store.isCustomStyle) return null;

  try {
    const style = await loadAvatarStyle(store.avatarStyleName);
    const meta = style.meta();

    return {
      creator: meta.creator()?.name(),
      homepage: meta.creator()?.url(),
      title: meta.source()?.name(),
      source: meta.source()?.url(),
      license: {
        name: meta.license()?.name(),
        url: meta.license()?.url(),
      },
    };
  } catch {
    return null;
  }
}, null);

const hasCustomMeta = computed(() => {
  const meta = customStyleMeta.value;
  return meta && (meta.creator || meta.license?.name);
});

const customSourceUrl = computed(() => safeHttpUrl(customStyleMeta.value?.source));
const customLicenseUrl = computed(() => safeHttpUrl(customStyleMeta.value?.license?.url));

const builtInSourceUrl = computed(() => safeHttpUrl(avatarStyleMeta.value?.source));
const builtInHomepageUrl = computed(() => safeHttpUrl(avatarStyleMeta.value?.homepage));
const builtInLicenseUrl = computed(() => safeHttpUrl(avatarStyleMeta.value?.license?.url));

const avatarStyleName = computed(() => {
  if (store.isCustomStyle) {
    return store.customStyles[store.avatarStyleName]?.name ?? 'Custom Style';
  }

  return capitalCase(store.avatarStyleName);
});

const avatarStyleLink = computed(
  () => store.isCustomStyle ? undefined : `/styles/${kebabCase(store.avatarStyleName)}/`,
);
</script>

<template>
  <p class="playground-license-text" v-if="store.isCustomStyle">
    <template v-if="hasCustomMeta">
      <span class="playground-license-text-name">{{ avatarStyleName }}</span>
      <template v-if="customStyleMeta?.title">
        is based on:
        <a
          v-if="customSourceUrl"
          :href="customSourceUrl"
          target="_blank"
          rel="noopener noreferrer"
        >{{ customStyleMeta?.title }}</a>
        <template v-else>{{ customStyleMeta?.title }}</template>
      </template>
      <template v-if="customStyleMeta?.creator">
        by {{ customStyleMeta.creator }}
      </template>
      <template v-if="customStyleMeta?.license?.name">
        , licensed under
        <a
          v-if="customLicenseUrl"
          :href="customLicenseUrl"
          target="_blank"
          rel="noopener noreferrer"
        >{{ customStyleMeta?.license?.name }}</a>
        <template v-else>{{ customStyleMeta?.license?.name }}</template>
      </template>
      (as stated by the creator — not verified by DiceBear).
    </template>
    <template v-else>
      This avatar style was provided by a user. License and copyright have not been verified by DiceBear.
    </template>
  </p>

  <p class="playground-license-text" v-else>
    <template v-if="avatarStyleMeta?.creator !== 'DiceBear'">
      The avatar style
    </template>
    <a :href="avatarStyleLink">{{ avatarStyleName }}</a>
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
        v-if="builtInSourceUrl"
        :href="builtInSourceUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ avatarStyleMeta?.title ?? 'Design' }}
      </a>
      <template v-else>{{ avatarStyleMeta?.title ?? 'Design' }}</template>
    </template>
    by
    <a
      v-if="builtInHomepageUrl"
      :href="builtInHomepageUrl"
      target="_blank"
      rel="noopener noreferrer"
    >{{ avatarStyleMeta?.creator }}</a>
    <template v-else>{{ avatarStyleMeta?.creator }}</template>, licensed under
    <a
      v-if="builtInLicenseUrl"
      :href="builtInLicenseUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ formatLicenseName(avatarStyleMeta?.license?.name) }}
    </a>
    <template v-else>{{ formatLicenseName(avatarStyleMeta?.license?.name) }}</template>
    .
  </p>
</template>

<style scoped lang="scss">
.playground-license-text {
  &-name {
    font-weight: 600;
  }

  a {
    font-weight: 500;
    color: var(--vp-c-brand-1);
    text-decoration-style: dotted;
    transition: color var(--duration-fast);
    cursor: pointer;

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }
}
</style>
