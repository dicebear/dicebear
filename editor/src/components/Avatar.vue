<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  svg: string;
  invisible?: boolean;
}>();

const src = ref<string | null>(null);

watch(
  () => [props.svg, props.invisible],
  () => {
    if (props.invisible) {
      const timer = setTimeout(() => {
        src.value = null;
      }, 250);

      return () => clearTimeout(timer);
    } else {
      src.value = `data:image/svg+xml;utf8,${encodeURIComponent(props.svg)}`;
    }
  },
  { immediate: true }
);
</script>

<template>
  <img v-if="src" :src="src" loading="lazy" />
  <div v-else class="avatar-invisible"></div>
</template>

<style scoped lang="scss">
.avatar-invisible {
  aspect-ratio: 1/1;
  background-color: #f7f7f7;
}
</style>
