<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Style } from '@dicebear/core';
import { registerCustomStyle } from '@theme/utils/avatar';
import useStore from '@theme/stores/playground';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { Upload } from '@lucide/vue';

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  added: [key: string];
}>();

const store = useStore();

const MAX_UPLOAD_SIZE = 1024 * 1024;

const jsonInput = ref('');
const styleName = ref('');
const error = ref('');
const loading = ref(false);

watch(open, (val) => {
  if (val) {
    jsonInput.value = '';
    styleName.value = '';
    error.value = '';
  }
});

function extractName(definition: Record<string, unknown>): string {
  const meta = definition.meta as Record<string, unknown> | undefined;

  if (meta) {
    const source = meta.source as Record<string, unknown> | undefined;
    if (source?.name && typeof source.name === 'string') return source.name;

    const creator = meta.creator as Record<string, unknown> | undefined;
    if (creator?.name && typeof creator.name === 'string') return creator.name;
  }

  if (definition.$id && typeof definition.$id === 'string') return definition.$id;

  return 'Custom Style';
}

async function submit() {
  error.value = '';

  if (new TextEncoder().encode(jsonInput.value).length > MAX_UPLOAD_SIZE) {
    error.value = 'Style definition is too large (max 1 MB).';
    return;
  }

  loading.value = true;

  try {
    const parsed = JSON.parse(jsonInput.value);
    const name = styleName.value.trim() || extractName(parsed);

    // Validate — Style constructor throws on invalid definitions
    new Style(parsed);

    const key = store.addCustomStyle(name, parsed);
    registerCustomStyle(key, parsed);

    emit('added', key);
  } catch (err: unknown) {
    if (err instanceof SyntaxError) {
      error.value = 'Invalid JSON: ' + err.message;
    } else if (err instanceof Error) {
      error.value = 'Invalid style definition. Check format and required fields.';
    } else {
      error.value = 'An unknown error occurred.';
    }
  } finally {
    loading.value = false;
  }
}

async function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  error.value = '';

  if (!file) return;

  if (file.size > MAX_UPLOAD_SIZE) {
    error.value = 'File is too large (max 1 MB).';
    input.value = '';
    return;
  }

  try {
    jsonInput.value = await file.text();
  } catch {
    error.value = 'Could not read file.';
  }

  input.value = '';
}

const canSubmit = computed(() => jsonInput.value.trim().length > 0 && !loading.value);
</script>

<template>
  <Dialog
    v-model:visible="open"
    modal
    :closable="true"
    header="Add Custom Style"
    :style="{ width: '600px' }"
    :pt="{ content: { class: 'pg-custom-upload-dialog-content' } }"
  >
    <div class="pg-custom-upload">
      <div class="pg-custom-upload-field">
        <label class="pg-custom-upload-label">Style Name (optional)</label>
        <InputText
          v-model="styleName"
          placeholder="My Custom Style"
          class="pg-custom-upload-name"
        />
      </div>

      <div class="pg-custom-upload-field">
        <label class="pg-custom-upload-label">Style Definition (JSON)</label>
        <textarea
          v-model="jsonInput"
          class="pg-custom-upload-textarea"
          placeholder='Paste your style definition JSON here...'
          rows="12"
        />
      </div>

      <div class="pg-custom-upload-or">
        <span>or</span>
      </div>

      <label class="pg-custom-upload-file">
        <Upload :size="16" />
        <span>Choose JSON file</span>
        <input
          type="file"
          accept=".json,application/json"
          class="pg-custom-upload-file-input"
          @change="onFileSelect"
        />
      </label>

      <Message v-if="error" severity="error" :closable="false" class="pg-custom-upload-error">
        {{ error }}
      </Message>

      <Button
        label="Add Style"
        :disabled="!canSubmit"
        :loading="loading"
        @click="submit"
        class="pg-custom-upload-submit"
      />

      <p class="pg-custom-upload-notice">
        Note: Please only upload styles for which you hold the necessary
        copyrights. Your data is processed and stored exclusively in your
        local browser and never reaches our server.
      </p>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.pg-custom-upload {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-custom-upload-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pg-custom-upload-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.pg-custom-upload-name {
  width: 100%;
}

.pg-custom-upload-textarea {
  width: 100%;
  min-height: 200px;
  padding: 12px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-radius-xs);
  resize: vertical;
  outline: none;
  transition: border-color var(--duration-fast);

  &:focus {
    border-color: var(--vp-c-brand-1);
  }

  &::placeholder {
    color: var(--vp-c-text-3);
  }
}

.pg-custom-upload-or {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--vp-c-text-3);
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--vp-c-border);
  }
}

.pg-custom-upload-file {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 1px dashed var(--vp-c-border);
  border-radius: var(--vp-radius-xs);
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all var(--duration-fast);

  &:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }

  &-input {
    display: none;
  }
}

.pg-custom-upload-submit {
  width: 100%;
  justify-content: center;
}

.pg-custom-upload-notice {
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-3);
  text-align: center;
  margin: 0;
}
</style>
