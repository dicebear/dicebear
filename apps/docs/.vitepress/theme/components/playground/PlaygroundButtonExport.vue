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
import Button from 'primevue/button';
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
  <Button
    label="Export"
    severity="secondary"
    variant="link"
    size="small"
    @click="open = true"
  >
    <template #icon>
      <FileDown :size="14" />
    </template>
  </Button>

  <UiDialog v-model:open="open" header="Export options" max-width="640px">
    <p class="pg-transfer-intro">
      The file holds the avatar style, the seed and every option you changed.
      Import it here later to get this avatar back, or copy the
      <code>options</code> block into your code: every DiceBear library reads
      the same option names.
    </p>

    <UiCode lang="json" :code="json" class="pg-transfer-code" />

    <div class="pg-transfer-actions">
      <Button label="Download file" @click="download">
        <template #icon>
          <FileDown :size="15" />
        </template>
      </Button>
      <Button
        :label="copied ? 'Copied!' : 'Copy options'"
        severity="secondary"
        @click="copyOptions"
      >
        <template #icon>
          <Check v-if="copied" :size="15" />
          <Copy v-else :size="15" />
        </template>
      </Button>
    </div>
  </UiDialog>
</template>

<style scoped lang="scss">
.pg-transfer-intro {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);

  code {
    font-family: var(--vp-font-family-mono);
    font-size: 0.9em;
    color: var(--vp-c-text-1);
  }
}

.pg-transfer-code {
  max-height: 40vh;
}

.pg-transfer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;

  :deep(button) {
    flex: 1 1 160px;
    justify-content: center;
  }
}
</style>
