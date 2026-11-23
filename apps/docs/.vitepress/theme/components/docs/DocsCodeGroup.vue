<script setup lang="ts">
/**
 * A code group from Markdown (`::: code-group`), in the tabs the rest of the
 * site uses: what does not fit goes into a menu instead of scrolling
 * sideways. The blocks stay VitePress's own, with their highlighting and copy
 * button, so the first one shows without JavaScript too.
 */
import { computed, onMounted, onUpdated, ref, watch } from 'vue';
import SiteTabs from '@theme/components/site/SiteTabs.vue';

const props = defineProps<{
  labels: string[];
}>();

const tabs = computed(() =>
  props.labels.map((label, index) => ({ id: String(index), label })),
);

const active = ref('0');
const blocks = ref<HTMLElement>();

function showActive() {
  blocks.value
    ?.querySelectorAll<HTMLElement>(':scope > [class*="language-"]')
    .forEach((block, index) => {
      block.classList.toggle('active', String(index) === active.value);
      block.setAttribute('role', 'tabpanel');
      block.setAttribute('aria-label', props.labels[index] ?? '');
    });
}

watch(active, showActive);
onMounted(showActive);
onUpdated(showActive);
</script>

<template>
  <div class="docs-code-group">
    <div class="docs-code-group-tabs">
      <SiteTabs v-model="active" :tabs="tabs" aria-label="Code example" />
    </div>
    <div ref="blocks" class="blocks"><slot /></div>
  </div>
</template>
