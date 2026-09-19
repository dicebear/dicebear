<script setup lang="ts">
import { loadAvatarStyle } from '@theme/utils/avatar/style';
import { computed } from 'vue';
import { computedAsync } from '@vueuse/core';
import useStore from '@theme/stores/playground';
import { safeHttpUrl } from '@theme/utils/url';
import { UiLicenseText } from '@theme/components/ui';

const store = useStore();

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

const customSourceUrl = computed(() =>
  safeHttpUrl(customStyleMeta.value?.source),
);
const customLicenseUrl = computed(() =>
  safeHttpUrl(customStyleMeta.value?.license?.url),
);

const customStyleDisplayName = computed(
  () => store.customStyles[store.avatarStyleName]?.name ?? 'Custom Style',
);
</script>

<template>
  <p class="playground-license-text" v-if="store.isCustomStyle">
    <template v-if="hasCustomMeta">
      <span class="playground-license-text-name">{{
        customStyleDisplayName
      }}</span>
      <template v-if="customStyleMeta?.title">
        is based on:
        <a
          v-if="customSourceUrl"
          :href="customSourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          >{{ customStyleMeta?.title }}</a
        >
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
          >{{ customStyleMeta?.license?.name }}</a
        >
        <template v-else>{{ customStyleMeta?.license?.name }}</template>
      </template>
      (as stated by the creator; DiceBear has not verified this).
    </template>
    <template v-else>
      This avatar style was provided by a user. License and copyright have not
      been verified by DiceBear.
    </template>
  </p>

  <UiLicenseText v-else :style-name="store.avatarStyleName" />
</template>

<style scoped lang="scss">
.playground-license-text {
  margin: 0;

  &-name {
    font-weight: 600;
  }

  a {
    font-weight: 500;
    color: var(--db-brand-text);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}
</style>
