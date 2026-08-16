<script setup lang="ts">
import { nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { kebabCase } from 'change-case';
import { RotateCcw } from '@lucide/vue';
import PlaygroundOptions from './PlaygroundOptions.vue';
import PlaygroundPreviewPanel from './PlaygroundPreviewPanel.vue';
import PlaygroundButtonExport from './PlaygroundButtonExport.vue';
import PlaygroundButtonImport from './PlaygroundButtonImport.vue';
import useStore from '@theme/stores/playground';
import { loadStylePreset } from '@theme/config/presets';
import { track, styleLabel } from '@theme/utils/track';
import Button from 'primevue/button';

const store = useStore();
const { seed } = storeToRefs(store);

function onReset() {
  track('Playground: Reset', { style: styleLabel(store.avatarStyleName) });
  store.resetOptions();
}

// ?style= query param overrides persisted style (used by "Open in Playground"
// links). ?preset= additionally loads one of that style's presets, which is how
// a card in the style-page gallery hands its options over.
const params = new URL(window.location.href).searchParams;
const styleParam = params.get('style');
const presetParam = params.get('preset');

if (styleParam) {
  const styleName = kebabCase(styleParam);

  if (store.availableAvatarStyles.includes(styleName)) {
    store.avatarStyleName = styleName;
    store.resetOptions();

    if (presetParam) {
      // The store clears the options whenever the style changes, and that
      // watcher runs on the next tick, so applying the preset any earlier
      // would be undone again. The preset file is fetched on demand, which
      // lands even later, so both waits are covered.
      // A failed chunk fetch leaves the playground on the plain style, which
      // is the same place an unknown `?preset=` lands. Swallowed rather than
      // left to reject, since nothing here can retry it.
      void loadStylePreset(styleName, presetParam)
        .then(async (preset) => {
          await nextTick();

          if (preset) {
            store.applyPreset(preset);
          }
        })
        .catch(() => undefined);
    }
  }

  history.replaceState(null, '', window.location.pathname);
}
</script>

<template>
  <div class="pg">
    <div class="pg-body">
      <aside class="pg-sidebar">
        <PlaygroundOptions v-model:seed="seed" />
      </aside>
      <main class="pg-main">
        <div class="pg-main-actions">
          <PlaygroundButtonExport :seed="seed" />
          <PlaygroundButtonImport />
          <Button
            label="Reset"
            severity="secondary"
            variant="link"
            size="small"
            class="pg-field-reset"
            @click="onReset"
          >
            <template #icon>
              <RotateCcw :size="14" />
            </template>
          </Button>
        </div>

        <PlaygroundPreviewPanel :seed="seed" />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px 48px;
}

.pg-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
}

.pg-sidebar {
  min-width: 0;

  @media (min-width: 861px) {
    padding-top: 10px;
  }
}

.pg-main {
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (min-width: 861px) {
    position: sticky;
    top: 80px;
    align-self: start;
  }

  @media (max-width: 860px) {
    order: -1;
  }

  &-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 4px;

    /* The muted color below outranks PrimeVue's own hover color, and the
       underline it falls back on is off, so the hover has to be stated here.
       Reset keeps its red through the !important in .pg-field-reset. The
       fade comes from PrimeVue's own transition, which already covers color. */
    :deep(.p-button-link) {
      color: var(--ui-c-text-muted);
    }

    :deep(.p-button-link:hover),
    :deep(.p-button-link:focus-visible) {
      color: var(--vp-c-text-1);
    }

    :deep(.p-button-link:hover .p-button-label) {
      text-decoration: none;
    }
  }
}
</style>
