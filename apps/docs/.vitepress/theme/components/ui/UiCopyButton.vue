<script setup lang="ts">
/**
 * Ghost icon button that copies `text` to the clipboard. Its tooltip shows
 * `label`. While the copy is fresh the icon is a check mark and the tooltip
 * reads "Copied".
 */
import { computed } from 'vue';
import { useClipboard } from '@vueuse/core';
import { Copy, Check } from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    text: string;
    duration?: number;
    size?: number;
    label?: string;
  }>(),
  { duration: 2000, size: 16, label: 'Copy' },
);

const { copy, copied } = useClipboard({ copiedDuring: props.duration });

const tip = computed(() => (copied.value ? 'Copied' : props.label));
</script>

<template>
  <button
    type="button"
    class="site-btn site-btn-ghost site-btn-icon site-btn-sm ui-copy-button"
    :aria-label="tip"
    :data-tip="tip"
    @click="copy(text)"
  >
    <Check v-if="copied" :size="size" />
    <Copy v-else :size="size" />
  </button>
</template>
