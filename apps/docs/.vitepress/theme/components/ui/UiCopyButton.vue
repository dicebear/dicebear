<script setup lang="ts">
/**
 * Icon button that copies `text` to the clipboard and shows a check mark
 * while the copy is fresh. It carries no visual style of its own; consumers
 * style the button through the class they pass in (see UiCode, StyleInfo).
 */
import { useClipboard } from '@vueuse/core';
import { Copy, Check } from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    text: string;
    duration?: number;
    size?: number;
  }>(),
  { duration: 2000, size: 14 },
);

const { copy, copied } = useClipboard({ copiedDuring: props.duration });
</script>

<template>
  <button :title="copied ? 'Copied!' : 'Copy'" @click="copy(text)">
    <Check v-if="copied" :size="size" />
    <Copy v-else :size="size" />
  </button>
</template>
