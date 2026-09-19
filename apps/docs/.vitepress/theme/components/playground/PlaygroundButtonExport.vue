<script setup lang="ts">
/**
 * Hands out the current setup as a JSON file, so a look someone spent time on
 * survives a cleared browser storage and can be passed on to a colleague.
 *
 * The options are shown before they are saved, since they are the same block
 * the "How to use" snippets print: reading them is often all a developer wants,
 * and copying beats downloading when the target is a source file.
 */
import { computed } from 'vue';
import { useClipboard } from '@vueuse/core';
import { kebabCase } from 'change-case';
import { Check, Copy, FileDown } from '@lucide/vue';
import { UiCode, UiDialog } from '../ui';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import { serializePlaygroundConfig } from '@theme/utils/playgroundConfig';
import { triggerDownload } from '@theme/utils/download';
import { track, styleLabel } from '@theme/utils/track';

const props = defineProps<{
  seed: string;
}>();

// The same composable the "How to use" dialog builds its snippets from, so
// what gets written out here is the block those snippets print, seed and all.
const { store, open, options } = usePlaygroundDialog(() => props.seed);

const { copy, copied } = useClipboard({ copiedDuring: 3000 });

const json = computed(() =>
  serializePlaygroundConfig({
    style: store.avatarStyleName,
    options: options.value,
  }),
);

// The file is what Import reads. Code takes the options on their own: handing
// `new Avatar()` the whole file fails on the version and style around them.
const optionsJson = computed(() => JSON.stringify(options.value, null, 2));

function download() {
  const blob = new Blob([json.value], { type: 'application/json' });

  // `custom:` is a store key, not something to hand a reader in a filename.
  // The batch download drops it the same way.
  const fileName = kebabCase(store.avatarStyleName.replace(/^custom:/, ''));

  triggerDownload(blob, `${fileName}-options.json`);

  track('Playground: Options Exported', {
    style: styleLabel(store.avatarStyleName),
    via: 'file',
  });
}

// A clipboard write can be refused (insecure origin, denied permission), and
// useClipboard also does nothing at all where the API is missing. Either way
// the JSON is still on screen to select by hand, so the failure stays quiet.
// It must not be counted as an export, though.
async function copyOptions() {
  await copy(optionsJson.value).catch(() => undefined);

  if (copied.value) {
    track('Playground: Options Exported', {
      style: styleLabel(store.avatarStyleName),
      via: 'clipboard',
    });
  }
}
</script>

<template>
  <button
    type="button"
    class="site-btn site-btn-ghost site-btn-sm pg-quiet"
    @click="open = true"
  >
    <FileDown :size="16" aria-hidden="true" />
    <span class="pg-quiet-label">Export</span>
  </button>

  <UiDialog v-model:open="open" header="Export options" max-width="760px">
    <div class="pg-transfer">
      <p class="pg-transfer-intro">
        The file holds the avatar style, the seed and every option you changed.
        Import it here later to get this avatar back, or copy the
        <code>options</code> block into your code: every DiceBear library reads
        the same option names.
      </p>

      <UiCode lang="json" :code="json" class="pg-transfer-code" />

      <div class="pg-transfer-actions">
        <button
          type="button"
          class="site-btn site-btn-primary"
          @click="download"
        >
          <FileDown :size="16" aria-hidden="true" />
          Download file
        </button>
        <button
          type="button"
          class="site-btn site-btn-secondary"
          @click="copyOptions"
        >
          <Check v-if="copied" :size="16" aria-hidden="true" />
          <Copy v-else :size="16" aria-hidden="true" />
          {{ copied ? 'Copied!' : 'Copy options' }}
        </button>
      </div>
    </div>
  </UiDialog>
</template>

<style scoped lang="scss">
.pg-transfer {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-transfer-intro {
  margin: 0;
  font-size: 15px;
  line-height: 24px;
  color: var(--db-ink-2);

  code {
    font-family: var(--db-font-mono);
    font-size: 0.9em;
    color: var(--db-ink);
  }
}

.pg-transfer-code {
  max-height: 360px;
}

.pg-transfer-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  .site-btn {
    gap: 8px;
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
