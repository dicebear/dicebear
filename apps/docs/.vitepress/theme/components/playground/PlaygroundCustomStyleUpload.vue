<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Style } from '@dicebear/core';
import { registerCustomStyle } from '@theme/utils/avatar/style';
import useStore from '@theme/stores/playground';
import { Upload } from '@lucide/vue';
import SiteDialog from '../site/SiteDialog.vue';
import SiteNotice from '../site/SiteNotice.vue';
import SiteTextarea from '../site/SiteTextarea.vue';
import SiteTextField from '../site/SiteTextField.vue';
import { MAX_CUSTOM_STYLE_UPLOAD_BYTES } from './constants';

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  added: [key: string];
}>();

const store = useStore();

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

    if (source?.name && typeof source.name === 'string') {
      return source.name;
    }

    const creator = meta.creator as Record<string, unknown> | undefined;

    if (creator?.name && typeof creator.name === 'string') {
      return creator.name;
    }
  }

  if (definition.$id && typeof definition.$id === 'string') {
    return definition.$id;
  }

  return 'Custom Style';
}

async function submit() {
  error.value = '';

  if (
    new TextEncoder().encode(jsonInput.value).length >
    MAX_CUSTOM_STYLE_UPLOAD_BYTES
  ) {
    error.value = 'Style definition is too large (max 1 MB).';

    return;
  }

  loading.value = true;

  try {
    const parsed = JSON.parse(jsonInput.value);
    const name = styleName.value.trim() || extractName(parsed);

    new Style(parsed);

    const key = store.addCustomStyle(name, parsed);
    registerCustomStyle(key, parsed);

    emit('added', key);
  } catch (err: unknown) {
    if (err instanceof SyntaxError) {
      error.value = 'Invalid JSON: ' + err.message;
    } else if (err instanceof Error) {
      error.value =
        'Invalid style definition. Check format and required fields.';
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

  if (!file) {
    return;
  }

  if (file.size > MAX_CUSTOM_STYLE_UPLOAD_BYTES) {
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

const canSubmit = computed(
  () => jsonInput.value.trim().length > 0 && !loading.value,
);
</script>

<template>
  <SiteDialog v-model:open="open" header="Add a custom style" max-width="600px">
    <div class="pg-custom-upload">
      <div class="pg-custom-upload-field">
        <label class="pg-custom-upload-label" for="pg-custom-upload-name">
          Style name (optional)
        </label>
        <SiteTextField
          id="pg-custom-upload-name"
          v-model="styleName"
          placeholder="My custom style"
          fluid
        />
      </div>

      <div class="pg-custom-upload-field">
        <label class="pg-custom-upload-label" for="pg-custom-upload-json">
          Style definition (JSON)
        </label>
        <SiteTextarea
          id="pg-custom-upload-json"
          v-model="jsonInput"
          placeholder="Paste your style definition JSON here..."
          :rows="8"
          mono
          :invalid="!!error"
          spellcheck="false"
        />
      </div>

      <div class="pg-custom-upload-or">or</div>

      <label class="site-btn site-btn-secondary pg-custom-upload-file">
        <Upload :size="16" aria-hidden="true" />
        Choose JSON file
        <input
          type="file"
          accept=".json,application/json"
          class="pg-custom-upload-file-input"
          @change="onFileSelect"
        />
      </label>

      <SiteNotice v-if="error" tone="error" compact role="alert">
        {{ error }}
      </SiteNotice>

      <button
        type="button"
        class="site-btn site-btn-primary pg-custom-upload-submit"
        :class="{ 'is-loading': loading }"
        :disabled="!canSubmit"
        :aria-busy="loading"
        @click="submit"
      >
        Add style
      </button>

      <p class="pg-custom-upload-notice">
        Please only upload styles for which you hold the necessary copyrights.
        Your data is processed and stored exclusively in your local browser and
        never reaches our server.
      </p>
    </div>
  </SiteDialog>
</template>

<style scoped lang="scss">
.pg-custom-upload {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 28px 28px;

  @media (max-width: 640px) {
    padding: 16px 20px 20px;
  }

  &-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &-label {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--db-ink);
  }

  &-or {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--db-line);
    }
  }

  &-file {
    position: relative;
    font-size: 15px;

    // The input covers the label, so it takes the click and the keyboard.
    &-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    &:focus-within {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
  }

  &-submit {
    font-size: 15px;
  }

  &-notice {
    margin: 0;
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);
  }
}
</style>
