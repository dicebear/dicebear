<script setup lang="ts">
/**
 * Adds a style of one's own from its definition, pasted or from a file. A
 * dropped file that could not be added opens this dialog with its content
 * and the reason.
 */
import { ref, computed, watch } from 'vue';
import {
  StyleUploadError,
  usePlaygroundStyles,
} from '@theme/composables/usePlaygroundStyles';
import { Plus, Upload } from '@lucide/vue';
import SiteDialog from '../site/SiteDialog.vue';
import SiteNotice from '../site/SiteNotice.vue';
import SiteTextarea from '../site/SiteTextarea.vue';
import SiteTextField from '../site/SiteTextField.vue';
import { MAX_CUSTOM_STYLE_UPLOAD_BYTES } from './constants';

const {
  uploadOpen: open,
  uploadDraft,
  addStyle,
  chooseStyle,
} = usePlaygroundStyles();

const jsonInput = ref('');
const styleName = ref('');
const error = ref('');
const loading = ref(false);

watch(open, (val) => {
  if (!val) return;

  const draft = uploadDraft.value;

  jsonInput.value = draft?.json ?? '';
  styleName.value = draft?.name ?? '';
  error.value = draft?.error ?? '';
  uploadDraft.value = undefined;
});

function submit() {
  error.value = '';
  loading.value = true;

  try {
    const key = addStyle(jsonInput.value, styleName.value);

    chooseStyle(key);
    open.value = false;
  } catch (err: unknown) {
    error.value =
      err instanceof StyleUploadError
        ? err.message
        : 'An unknown error occurred.';
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
          Name
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
          Definition
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

      <SiteNotice v-if="error" tone="error" compact role="alert">
        {{ error }}
      </SiteNotice>

      <div class="pg-custom-upload-actions">
        <label class="site-btn site-btn-secondary pg-custom-upload-file">
          <Upload :size="16" aria-hidden="true" />
          Choose a file
          <input
            type="file"
            accept=".json,application/json"
            class="pg-custom-upload-file-input"
            @change="onFileSelect"
          />
        </label>
        <span class="pg-custom-upload-notice">
          Stays in this browser only. Upload styles you hold the rights to.
        </span>
        <button
          type="button"
          class="site-btn site-btn-primary pg-custom-upload-submit"
          :class="{ 'is-loading': loading }"
          :disabled="!canSubmit"
          :aria-busy="loading"
          @click="submit"
        >
          <Plus :size="16" aria-hidden="true" />
          Add style
        </button>
      </div>
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

  &-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
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
    margin-left: auto;
    font-size: 15px;
  }

  &-notice {
    flex: 1;
    min-width: 160px;
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);
  }
}
</style>
