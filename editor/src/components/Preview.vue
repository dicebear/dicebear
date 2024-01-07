<script setup lang="ts">
import useMainStore from '@/stores/main';
import Avatar from './Avatar.vue';

const store = useMainStore();
</script>

<template>
  <div class="preview">
    <Avatar
      :svg="store.selectedStylePreview.toString()"
      class="preview-image"
    />
  </div>
</template>

<style scoped lang="scss">
.preview {
  --container-size: min(40vh, 100vw);
  --spacing: min(60px, calc(var(--container-size) / 6));

  display: flex;
  align-items: center;
  justify-content: center;

  padding: var(--spacing);

  &-image {
    --max-size: calc(var(--container-size) - var(--spacing) * 2);
    max-width: var(--max-size);
    border-radius: 20px;
    width: 100%;
    height: 100%;

    &::before {
      position: absolute;
      content: '';
      width: 200vw;
      height: 200vw;
    }
  }
}
</style>
