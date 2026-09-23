<script setup lang="ts">
/**
 * A native textarea in the field look. It fills its container and resizes
 * vertically only. Attributes fall through to the textarea.
 */
import { ref } from 'vue';

withDefaults(
  defineProps<{
    rows?: number;
    invalid?: boolean;
    mono?: boolean;
  }>(),
  { rows: 4 },
);

const model = defineModel<string>({ default: '' });

const textarea = ref<HTMLTextAreaElement>();

defineExpose({
  focus: () => textarea.value?.focus(),
});
</script>

<template>
  <textarea
    ref="textarea"
    v-model="model"
    class="site-textarea"
    :class="{ 'is-mono': mono, 'is-invalid': invalid }"
    :rows="rows"
    :aria-invalid="invalid || undefined"
  />
</template>

<style scoped lang="scss">
@use '../../styles/control' as c;

.site-textarea {
  @include c.control;

  display: block;
  width: 100%;
  min-height: 48px;
  margin: 0;
  padding: 8px 16px;
  border-radius: var(--db-radius-2);
  font: inherit;
  font-size: 15px;
  line-height: 24px;
  resize: vertical;

  &.is-mono {
    font-family: var(--db-font-mono);
    font-size: 13px;
    line-height: 21px;
  }

  &::placeholder {
    color: var(--db-muted);
  }

  &:focus {
    border-color: var(--db-brand);
    outline: none;
  }

  &.is-invalid:focus-visible {
    outline-color: var(--db-danger);
  }

  &:disabled {
    @include c.control-disabled;

    resize: none;
  }

  // Below 16px iOS zooms into a focused field.
  @media (max-width: 767px) {
    &:not(.is-mono) {
      font-size: 16px;
    }
  }
}
</style>
