<script setup lang="ts">
import { computed } from 'vue';
import { getAvatarPropertyPreviewOptions } from '@shared/utils/avatar';
import Avatar from '@shared/components/Avatar.vue';

const props = defineProps({
  styleName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    required: true,
  },
});

const options = computed(() =>
  getAvatarPropertyPreviewOptions(props.name, props.value)
);
</script>

<template>
  <div class="preview">
    <Avatar
      :size="name === 'size' ? parseInt(value as any) : 64"
      :styleName="styleName"
      :styleOptions="options"
      class="preview-avatar"
    />
    <code>{{ value }}</code>
  </div>
  <div class="invisible-char">,</div>
</template>

<style scoped lang="scss">
.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 9px;

  &-avatar {
    margin-bottom: 12px;
    user-select: none;
  }
}
.invisible-char {
  opacity: 0;
}
</style>
