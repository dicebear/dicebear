<script setup lang="ts">
import { ref, unref, computed } from 'vue';
import Avatar from '@shared/components/Avatar.vue';
import useStore from '@playground/store';
import ButtonDownload from './ButtonDownload.vue';
import ButtonCopy from './ButtonCopy.vue';
import ButtonHowToUse from './ButtonHowToUse.vue';

const props = defineProps<{
  name: string;
}>();

const store = useStore();
const seed = ref(props.name);
const input = ref<HTMLInputElement>();

const styleOptions = computed(() => {
  return {
    ...unref(store.avatarStyleOptionsWithoutDefaults),
    seed: seed.value,
  };
});

const onInputFocus = (focused: boolean) => {
  requestAnimationFrame(() => {
    if (focused && input.value) {
      input.value.setSelectionRange(0, input.value.value.length);
    }
  });
};
</script>

<template>
  <div class="preview">
    <div class="preview-avatar">
      <Avatar
        :size="84"
        :radius="6"
        :style-name="store.avatarStyleName"
        :style-options="styleOptions"
      />
    </div>
    <div class="preview-name">
      <v-text-field
        v-model="seed"
        placeholder="Enter a seed"
        density="compact"
        variant="solo"
        hide-details
        @update:focused="onInputFocus"
        ref="input"
      />
    </div>
    <div class="preview-actions">
      <div class="preview-actions-row">
        <ButtonDownload :seed="seed" />
      </div>
      <div class="preview-actions-row">
        <ButtonCopy :seed="seed" />
      </div>
      <div class="preview-actions-row">
        <ButtonHowToUse :seed="seed" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.preview {
  &-avatar {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }

  &-name {
    margin-bottom: 12px;

    &:deep(input) {
      text-align: center;
    }
  }

  &-actions {
    display: flex;
    justify-content: space-between;

    &-row {
      width: calc(100% / 3 - 8px);
    }
  }
}
</style>
