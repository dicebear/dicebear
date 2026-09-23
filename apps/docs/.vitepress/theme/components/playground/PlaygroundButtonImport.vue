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
import { UiDialog } from '../ui';
import SiteNotice from '@theme/components/site/SiteNotice.vue';
import SiteTextarea from '@theme/components/site/SiteTextarea.vue';
import useStore from '@theme/stores/playground';
import {
  checkPlaygroundConfig,
  parsePlaygroundConfig,
  MAX_CONFIG_BYTES,
} from '@theme/utils/playgroundConfig';

withDefaults(
  defineProps<{
    /** Without its own button the dialog opens through `show()`. */
    trigger?: boolean;
  }>(),
  { trigger: true },
);

const store = useStore();

const open = ref(false);
const input = ref('');
const error = ref('');
const loading = ref(false);
const dragging = ref(false);

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
          ? `This file was made with the custom style "${styleName.slice('custom:'.length)}", which is not stored in this browser. Add it under Style, then import again.`
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

async function readFile(file: File | undefined) {
  error.value = '';

  if (!file) {
    return;
  }

  // The parser checks the size too. This one keeps a huge file from being
  // read into memory in the first place.
  if (file.size > MAX_CONFIG_BYTES) {
    error.value = 'File is too large (max 256 KB).';

    return;
  }

  try {
    input.value = await file.text();
  } catch {
    // Drop whatever was in the box. Leaving it there would let Import apply
    // the text the reader has just replaced by picking this file.
    input.value = '';
    error.value = 'Could not read file.';
  }
}

async function onFileSelect(event: Event) {
  const element = event.target as HTMLInputElement;

  await readFile(element.files?.[0]);
  element.value = '';
}

async function onDrop(event: DragEvent) {
  dragging.value = false;
  await readFile(event.dataTransfer?.files?.[0]);
}

defineExpose({ show: () => (open.value = true) });
</script>

<template>
  <button
    v-if="trigger"
    type="button"
    class="site-btn site-btn-ghost site-btn-sm pg-quiet"
    @click="open = true"
  >
    <FileUp :size="16" aria-hidden="true" />
    <span class="pg-quiet-label">Import</span>
  </button>

  <UiDialog v-model:open="open" header="Import options" max-width="760px">
    <div class="pg-transfer">
      <SiteTextarea
        v-model="input"
        mono
        class="pg-transfer-textarea"
        aria-label="Options JSON"
        :invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        placeholder="Paste your options JSON here..."
        :rows="9"
      />

      <label
        class="pg-transfer-file hv-dashed"
        :class="{ 'is-dragging': dragging }"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="onDrop"
      >
        <FileUp :size="16" aria-hidden="true" />
        <span>Drop a file here or click to choose</span>
        <input
          type="file"
          accept=".json,application/json"
          class="pg-transfer-file-input"
          @change="onFileSelect"
        />
      </label>

      <p class="pg-transfer-note">
        Replaces every option, seed included. A file that names a style switches
        to it.
      </p>

      <SiteNotice v-if="error" :id="errorId" tone="error" compact role="alert">
        {{ error }}
      </SiteNotice>

      <div class="pg-transfer-actions">
        <button
          type="button"
          class="site-btn site-btn-secondary"
          @click="open = false"
        >
          Cancel
        </button>
        <button
          type="button"
          class="site-btn site-btn-primary"
          :class="{ 'is-loading': loading }"
          :aria-busy="loading || undefined"
          :disabled="!canSubmit"
          @click="submit"
        >
          <FileUp :size="16" aria-hidden="true" />
          Import
        </button>
      </div>
    </div>
  </UiDialog>
</template>

<style scoped lang="scss">
.pg-transfer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-transfer-textarea {
  min-height: 200px;
  resize: vertical;
}

.pg-transfer-file {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 56px;
  border: 1px dashed var(--db-btn-border);
  border-radius: var(--db-radius-3);
  font-size: 14px;
  line-height: 20px;
  color: var(--db-ink-2);
  cursor: pointer;

  &.is-dragging {
    border-color: var(--db-brand);
    background: var(--db-tint);
  }

  /* The input stays focusable, so the label shows its focus ring. */
  &:focus-within {
    outline: 2px solid var(--db-brand);
    outline-offset: 2px;
  }

  &-input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    opacity: 0;
  }
}

.pg-transfer-note {
  margin: 2px 0 0;
  font-size: 13px;
  line-height: 18px;
  color: var(--db-muted);
}

.pg-transfer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}
</style>
