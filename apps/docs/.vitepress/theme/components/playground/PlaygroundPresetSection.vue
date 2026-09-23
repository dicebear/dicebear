<script setup lang="ts">
/**
 * The Presets entry: the style's presets as rows, each with the avatar at
 * hand drawn the preset's way, its name and one sentence. A click applies
 * one, the row in use wears the tint of the list on the left.
 */
import { computed, inject } from 'vue';
import { storeToRefs } from 'pinia';
import useStore from '@theme/stores/playground';
import type { StylePreset } from '@theme/config/presets';
import {
  playgroundEntriesKey,
  type PlaygroundEntries,
} from '@theme/composables/usePlaygroundEntries';
import PlaygroundThumb from './PlaygroundThumb.vue';

const injected = inject(playgroundEntriesKey);

if (!injected) {
  throw new Error(
    'PlaygroundPresetSection needs the entries of PlaygroundApp.',
  );
}

const entries: PlaygroundEntries = injected;

const store = useStore();
const { avatarStyleName, seed } = storeToRefs(store);

// One option set per row, held here, so the thumbnail keeps its options
// between renders.
const rows = computed(() =>
  entries.presetChoices.value.map((preset) => ({
    preset,
    options: { ...preset.options, seed: seed.value },
    active: entries.activePreset.value?.id === preset.id,
  })),
);

function choose(preset: StylePreset) {
  store.applyPreset(preset);
}
</script>

<template>
  <div class="pg-presets">
    <p class="pg-help">A preset replaces every option except the seed.</p>
    <div class="pg-presets-rows">
      <button
        v-for="row in rows"
        :key="row.preset.id"
        type="button"
        class="pg-presets-row hv-fill"
        :aria-pressed="row.active"
        @click="choose(row.preset)"
      >
        <PlaygroundThumb
          class="pg-presets-picture"
          :style-name="avatarStyleName"
          :options="row.options"
          surface="tile"
        />
        <span class="pg-presets-text">
          <span class="pg-presets-name">{{ row.preset.name }}</span>
          <span class="pg-presets-summary">{{ row.preset.summary }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-presets {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-presets-rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pg-presets-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-width: 0;
  padding: 6px 8px 6px 6px;
  box-sizing: border-box;
  border: 0;
  border-radius: var(--db-radius-3);
  background: transparent;
  font: inherit;
  color: var(--db-ink);
  text-align: left;
  cursor: pointer;

  &[aria-pressed='true'] {
    background: var(--db-tint);
    color: var(--db-tint-text);
    cursor: default;

    .pg-presets-summary {
      color: var(--db-tint-text);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--db-brand);
    outline-offset: -2px;
  }
}

.pg-presets-row .pg-presets-picture {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 10px;
}

.pg-presets-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.pg-presets-name {
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
}

.pg-presets-summary {
  overflow: hidden;
  font-size: 12px;
  line-height: 16px;
  color: var(--db-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
