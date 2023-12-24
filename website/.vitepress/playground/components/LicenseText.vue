<script setup lang="ts">
import { useAvatarStyleMeta } from '@shared/composables/avatar';
import { capitalCase, paramCase } from 'change-case';
import { computed } from 'vue';
import useStore from '../store';

const store = useStore();

const avatarStyleKey = computed(() => store.avatarStyleName);
const avatarStyleMeta = useAvatarStyleMeta(avatarStyleKey);
const avatarStyleName = computed(() => capitalCase(store.avatarStyleName));
const avatarStyleLink = computed(
  () => `/styles/${paramCase(store.avatarStyleName)}`
);
</script>

<template>
  <p>
    The avatar style
    <a :href="avatarStyleLink">{{ avatarStyleName }}</a>
    is based on:
    <a
      :href="avatarStyleMeta?.source"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ avatarStyleMeta?.title }}
    </a>
    by
    <a
      :href="avatarStyleMeta?.homepage"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ avatarStyleMeta?.creator }} </a
    >, licensed under
    <a
      :href="avatarStyleMeta?.license?.url"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ avatarStyleMeta?.license?.name.replace(/\.$/, '') }}
    </a>
    . / Remix of the original.
  </p>
</template>

<style scoped lang="scss">
p {
  a {
    font-weight: 500;
    color: var(--vp-c-brand);
    text-decoration-style: dotted;
    transition: color 0.25s;
    cursor: pointer;

    &:hover {
      color: var(--vp-c-brand-dark);
    }
  }
}
</style>
