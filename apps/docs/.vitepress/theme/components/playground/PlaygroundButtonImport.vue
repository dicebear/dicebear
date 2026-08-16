<script setup lang="ts">
/**
 * Takes an exported file back in, and with it any options block a reader has
 * lying around in a source file or a ticket.
 *
 * Everything is checked before the store hears about it. A bad file is a
 * normal thing to run into here, and the reader is the one who can fix it, so
 * the reason goes on screen rather than into the console.
 */
import { computed, ref, useId, watch } from 'vue';
import { until } from '@vueuse/core';
import { FileUp } from '@lucide/vue';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Textarea from 'primevue/textarea';
import { UiDialog } from '../ui';
import useStore from '@theme/stores/playground';
import {
  checkPlaygroundConfig,
  parsePlaygroundConfig,
  MAX_CONFIG_BYTES,
} from '@theme/utils/playgroundConfig';

const store = useStore();

const open = ref(false);
const input = ref('');
const error = ref('');
const loading = ref(false);

// Ties the message to the box it belongs to, so the reason for a refusal is
// still there when a screen reader comes back to the field.
const errorId = useId();

// Only the error is cleared. The dialog closes on Escape and on a click that
// lands outside it, which is easy to do while selecting pasted text, and the
// box is the whole dialog: dropping it would mean fetching the JSON again.
watch(open, (isOpen) => {
  if (isOpen) {
    error.value = '';
  }
});

const canSubmit = computed(
  () => input.value.trim().length > 0 && !loading.value,
);

// `Object.hasOwn` rather than `in`, which walks the prototype chain and would
// hand names like "constructor" to the loader as if they were styles.
function knownStyle(name: string): boolean {
  return (
    store.availableAvatarStyles.includes(name) ||
    Object.hasOwn(store.customStyles, name)
  );
}

async function submit() {
  error.value = '';
  loading.value = true;

  try {
    const config = parsePlaygroundConfig(input.value);

    // The uploaded styles come out of IndexedDB a moment after the page does,
    // and until they land the list below answers "no" for every one of them.
    await until(() => store.customStylesReady).toBe(true, { timeout: 5000 });

    const styleName = config.style ?? store.avatarStyleName;

    if (!knownStyle(styleName)) {
      throw new Error(
        styleName.startsWith('custom:')
          ? `This file was made with the custom style "${styleName.slice('custom:'.length)}", which is not stored in this browser. Add it under Avatar Style, then import again.`
          : `There is no avatar style called "${styleName}".`,
      );
    }

    await checkPlaygroundConfig(styleName, config.options);

    // A style definition is fetched on demand, and the dialog closes on Escape
    // or a click outside. Applying after that would overwrite a playground the
    // reader has already gone back to.
    if (!open.value) {
      return;
    }

    // The name goes along, since a file that carries no style was checked
    // against whichever one was selected back when the fetch started.
    await store.applyConfig(config, styleName);

    open.value = false;
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : 'An unknown error occurred.';
  } finally {
    loading.value = false;
  }
}

async function onFileSelect(event: Event) {
  const element = event.target as HTMLInputElement;
  const file = element.files?.[0];

  error.value = '';

  if (!file) {
    return;
  }

  // The parser checks the size too. This one keeps a huge file from being
  // read into memory in the first place.
  if (file.size > MAX_CONFIG_BYTES) {
    error.value = 'File is too large (max 256 KB).';
    element.value = '';

    return;
  }

  try {
    input.value = await file.text();
  } catch {
    // Drop whatever was in the box. Leaving it there would let Apply import
    // the text the reader has just replaced by picking this file.
    input.value = '';
    error.value = 'Could not read file.';
  }

  element.value = '';
}
</script>

<template>
  <Button
    label="Import"
    severity="secondary"
    variant="link"
    size="small"
    @click="open = true"
  >
    <template #icon>
      <FileUp :size="14" />
    </template>
  </Button>

  <UiDialog v-model:open="open" header="Import options" max-width="640px">
    <p class="pg-transfer-intro">
      Takes a file from Export, or an options block on its own. A file brings
      its own avatar style, a bare block applies to the style you have selected
      right now. Either way it replaces the options you have set.
    </p>

    <Textarea
      v-model="input"
      class="pg-transfer-textarea"
      aria-label="Options JSON"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="error ? errorId : undefined"
      placeholder="Paste your options JSON here..."
      :rows="12"
      fluid
    />

    <div class="pg-transfer-or">
      <span>or</span>
    </div>

    <label class="pg-transfer-file">
      <FileUp :size="16" />
      <span>Choose JSON file</span>
      <input
        type="file"
        accept=".json,application/json"
        class="pg-transfer-file-input"
        @change="onFileSelect"
      />
    </label>

    <Message
      v-if="error"
      :id="errorId"
      severity="error"
      :closable="false"
      class="pg-transfer-error"
    >
      {{ error }}
    </Message>

    <Button
      label="Apply"
      class="pg-transfer-submit"
      :disabled="!canSubmit"
      :loading="loading"
      @click="submit"
    />
  </UiDialog>
</template>

<style scoped lang="scss">
.pg-transfer-intro {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.pg-transfer-textarea {
  min-height: 200px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
}

.pg-transfer-or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  color: var(--ui-c-text-subtle);
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--vp-c-border);
  }
}

.pg-transfer-file {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 1px dashed var(--vp-c-border);
  border-radius: var(--vp-radius-xs);
  font-size: 13px;
  font-weight: 500;
  color: var(--ui-c-text-muted);
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

.pg-transfer-error,
.pg-transfer-submit {
  margin-top: 16px;
}

.pg-transfer-submit {
  width: 100%;
  justify-content: center;
}
</style>
