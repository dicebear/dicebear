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
.site-textarea {
  display: block;
  width: 100%;
  min-height: 48px;
  margin: 0;
  padding: 12px 14px;
  box-sizing: border-box;
  border: 1px solid var(--db-btn-border);
  border-radius: var(--db-radius-3);
  background: var(--db-panel);
  font: inherit;
  font-size: 15px;
  line-height: 24px;
  color: var(--db-ink);
  resize: vertical;
  transition: border-color 0.12s;

  &.is-mono {
    font-family: var(--db-font-mono);
    font-size: 13px;
    line-height: 21px;
  }

  &::placeholder {
    color: var(--db-muted);
  }

  &:hover:not(:focus) {
    border-color: var(--db-hover-border);
  }

  &:focus {
    border-color: var(--db-brand);
  }

  &.is-invalid,
  &.is-invalid:hover {
    border-color: var(--db-danger);
  }

  &.is-invalid:focus-visible {
    outline-color: var(--db-danger);
  }

  &:disabled {
    background: var(--db-soft);
    color: var(--db-muted);
    cursor: not-allowed;
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
