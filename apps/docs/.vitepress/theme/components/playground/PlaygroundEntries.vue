<script setup lang="ts">
/**
 * The list on the left: the general entries, the components with their eye,
 * the colors. One entry is selected at a time and the inspector shows it.
 * On a phone the same list runs as a row of chips under the picture.
 */
import { inject } from 'vue';
import { capitalCase } from 'change-case';
import { Eye, EyeOff, List } from '@lucide/vue';
import {
  playgroundEntriesKey,
  type PlaygroundEntries,
} from '@theme/composables/usePlaygroundEntries';
import {
  usePlaygroundSelection,
  type PlaygroundEntry,
} from '@theme/composables/usePlaygroundSelection';

defineProps<{
  // Always the list, also on a phone, for the sheet that holds it.
  list?: boolean;
  // The first chip on a phone opens the list as a sheet.
  listButton?: boolean;
}>();

const emit = defineEmits<{
  pick: [entry: PlaygroundEntry];
  'open-list': [];
}>();

const injected = inject(playgroundEntriesKey);

if (!injected) {
  throw new Error('PlaygroundEntries needs the entries of PlaygroundApp.');
}

const entries: PlaygroundEntries = injected;

const { select, isSelected } = usePlaygroundSelection();

function pick(entry: PlaygroundEntry) {
  select(entry);
  emit('pick', entry);
}
</script>

<template>
  <nav class="pg-entries" :class="{ 'is-list': list }" aria-label="Options">
    <button
      v-if="listButton && !list"
      type="button"
      class="site-btn site-btn-secondary site-btn-icon pg-entries-list-button"
      aria-label="All options"
      @click="emit('open-list')"
    >
      <List :size="18" aria-hidden="true" />
    </button>
    <div class="pg-entries-group">
      <h2 class="pg-entries-heading">General</h2>
      <button
        v-for="entry in entries.generalEntries.value"
        :key="entry.id"
        type="button"
        class="pg-entries-row hv-fill"
        :aria-pressed="isSelected({ kind: 'general', id: entry.id })"
        @click="pick({ kind: 'general', id: entry.id })"
      >
        <span class="pg-entries-name">{{ entry.label }}</span>
        <span v-if="entry.id === 'presets'" class="pg-entries-count">
          {{ entries.presetLabel.value }}
        </span>
        <span
          v-else-if="entries.isChanged({ kind: 'general', id: entry.id })"
          class="pg-entries-dot"
          aria-label="changed"
        />
      </button>
    </div>

    <div v-if="entries.components.value.length > 0" class="pg-entries-group">
      <h2 class="pg-entries-heading">Components</h2>
      <div
        v-for="comp in entries.components.value"
        :key="comp.name"
        class="pg-entries-item"
        :class="{ 'is-hidden': entries.isHidden(comp) }"
      >
        <button
          type="button"
          class="pg-entries-row hv-fill"
          :aria-pressed="isSelected({ kind: 'component', name: comp.name })"
          @click="pick({ kind: 'component', name: comp.name })"
        >
          <span class="pg-entries-name">{{ capitalCase(comp.name) }}</span>
          <span class="pg-entries-count"
            >{{ entries.activeCount(comp) }}/{{ comp.variants.length }}</span
          >
        </button>
        <button
          v-if="comp.hasProbability"
          type="button"
          class="pg-entries-eye hv-ghost"
          :aria-pressed="entries.isHidden(comp)"
          :aria-label="
            entries.isHidden(comp) ? 'Show on every seed' : 'Hide on every seed'
          "
          :data-tip="entries.isHidden(comp) ? 'Show' : 'Hide'"
          @click="entries.toggleHidden(comp)"
        >
          <component
            :is="entries.isHidden(comp) ? EyeOff : Eye"
            :size="16"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <div v-if="entries.colors.value.length > 0" class="pg-entries-group">
      <h2 class="pg-entries-heading">Colors</h2>
      <button
        v-for="color in entries.colors.value"
        :key="color.key"
        type="button"
        class="pg-entries-row hv-fill"
        :aria-pressed="isSelected({ kind: 'color', name: color.name })"
        @click="pick({ kind: 'color', name: color.name })"
      >
        <span class="pg-entries-name">{{ capitalCase(color.name) }}</span>
        <span class="pg-entries-count">{{ entries.colorCount(color) }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.pg-entries {
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-sizing: border-box;
  /* The headings and the tint of a chosen row stand on the content edge,
     the row's text 10px inside it. */
  padding: 16px 12px;
  overflow-y: auto;

  &-group {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 2px;
  }

  &-heading {
    margin: 0;
    padding: 0 0 8px;
    font-size: 13px;
    line-height: 18px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--db-ink-2);
  }

  &-item {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;

    &.is-hidden .pg-entries-name,
    &.is-hidden .pg-entries-count {
      color: var(--db-muted);
    }
  }

  &-row {
    box-sizing: border-box;
    display: flex;
    flex: 1 0 auto;
    align-items: center;
    gap: 10px;
    min-width: 0;
    height: 44px;
    padding: 0 10px;
    border: 0;
    border-radius: var(--db-radius-2);
    background: transparent;
    font: inherit;
    color: var(--db-ink);
    text-align: left;
    cursor: pointer;

    &[aria-pressed='true'] {
      background: var(--db-tint);
      color: var(--db-tint-text);

      .pg-entries-count {
        color: var(--db-tint-text);
      }
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: -2px;
    }
  }

  /* The eye is the last thing in its row, laid over the row's right end so
     the count keeps its place under the rows without one. */
  &-item &-row {
    padding-right: 40px;
  }

  &-name {
    flex: 1;
    min-width: 0;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-row[aria-pressed='true'] &-name {
    font-weight: 600;
  }

  &-count {
    flex-shrink: 0;
    font-family: var(--db-font-mono);
    font-size: 12px;
    line-height: 16px;
    color: var(--db-muted);
  }

  &-dot {
    flex-shrink: 0;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: var(--db-brand);
  }

  &-eye {
    position: absolute;
    top: 50%;
    right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 0;
    border-radius: var(--db-radius-1);
    background: transparent;
    color: var(--db-ink-2);
    transform: translateY(-50%);
    cursor: pointer;

    &[aria-pressed='true'] {
      color: var(--db-chevron);
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
  }

  /* The phone's list button, only next to the chips. */
  & &-list-button {
    display: none;
    flex-shrink: 0;
  }
}

/* A row of chips: no headings, no eye, sideways scroll. The list in the
   phone's sheet keeps the list layout. */
@media (max-width: 959px) {
  .pg-entries:not(.is-list) {
    flex-direction: row;
    gap: 6px;
    padding: 12px 16px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .pg-entries-group {
      flex-direction: row;
      gap: 6px;
    }

    .pg-entries-group + .pg-entries-group::before {
      content: '';
      align-self: center;
      width: 1px;
      height: 24px;
      margin: 0 4px;
      background: var(--db-line);
    }

    .pg-entries-heading,
    .pg-entries-eye,
    .pg-entries-count {
      display: none;
    }

    .pg-entries-item .pg-entries-row {
      padding-right: 12px;
    }

    .pg-entries-row {
      flex: none;
      height: 40px;
      padding: 0 12px;
      border-radius: var(--db-radius-3);
      background: var(--db-soft);
    }

    .pg-entries-name {
      font-size: 14px;
    }
  }
}

@media (max-width: 767px) {
  .pg-entries:not(.is-list) .pg-entries-list-button {
    display: flex;
  }
}

.pg-entries.is-list {
  padding: 4px 8px 8px;
}
</style>
