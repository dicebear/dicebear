<script setup lang="ts">
/**
 * The inline badge of Markdown pages, registered globally as `Badge`. It is
 * the small `site-tag` in a tone per type.
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    text?: string;
    type?: 'info' | 'tip' | 'warning' | 'danger';
  }>(),
  { text: undefined, type: 'tip' },
);

const tone = computed(
  () =>
    ({
      info: undefined,
      tip: 'site-tag-sun',
      warning: 'site-tag-warn',
      danger: 'site-tag-danger',
    })[props.type],
);
</script>

<template>
  <span class="site-tag site-tag-sm theme-badge" :class="tone">
    <slot>{{ text }}</slot>
  </span>
</template>

<style lang="scss" scoped>
.theme-badge {
  margin-left: 6px;
  vertical-align: middle;
}
</style>
