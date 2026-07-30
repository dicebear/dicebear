<script setup lang="ts">
import { computed } from 'vue';
import useStore from '@theme/stores/playground';
import type { TagCategory } from '@theme/utils/avatar/tags';
import { Minus, Check, Ban } from '@lucide/vue';

const props = defineProps<{ category: TagCategory }>();

const store = useStore();

const TAGS_KEY = 'tags';

// Every row is a tri-state switch, and every state maps 1:1 to a filter
// token. The category row writes the bare tokens: allow = `cat` (requires the
// category, which turns an opt-in feature like the animation on), disallow =
// `!cat`. A value row writes `cat:value` / `!cat:value`.
type RowState = 'neutral' | 'allow' | 'disallow';

const STATES: { state: RowState; icon: unknown; label: string }[] = [
  { state: 'neutral', icon: Minus, label: 'Neutral' },
  { state: 'allow', icon: Check, label: 'Allow' },
  { state: 'disallow', icon: Ban, label: 'Disallow' },
];

const selected = computed<string[]>(() => {
  const value = store.avatarStyleOptions[TAGS_KEY];

  return Array.isArray(value) ? (value as string[]) : [];
});

// The category row plus one row per value tag, each with its token and its
// state resolved in one pass. A disallow wins over an allow in the engine,
// so it also wins in the display.
const rows = computed(() => {
  const tokens = new Set(selected.value);
  const state = (token: string): RowState =>
    tokens.has(`!${token}`)
      ? 'disallow'
      : tokens.has(token)
        ? 'allow'
        : 'neutral';

  return [
    { token: props.category.category, label: 'Whole category', bare: true },
    ...props.category.tags.map((tag) => ({
      token: tag.token,
      label: tag.label,
      bare: false,
    })),
  ].map((row) => ({ ...row, state: state(row.token) }));
});

// A disallowed category drops every tagged variant, so its value rows are
// moot and get disabled.
const valuesDisabled = computed(() => rows.value[0].state === 'disallow');

function setRowState(row: { token: string; bare: boolean }, state: RowState): void {
  let next = selected.value.filter(
    (t) => t !== row.token && t !== `!${row.token}`,
  );

  // Disallowing the whole category drops every tagged variant anyway, so the
  // category's value tokens are moot and get cleared along the way.
  if (row.bare && state === 'disallow') {
    next = next.filter(
      (t) =>
        !t.startsWith(`${row.token}:`) && !t.startsWith(`!${row.token}:`),
    );
  }

  if (state === 'allow') {
    next.push(row.token);
  } else if (state === 'disallow') {
    next.push(`!${row.token}`);
  }

  if (next.length === 0) {
    delete store.avatarStyleOptions[TAGS_KEY];
  } else {
    store.avatarStyleOptions[TAGS_KEY] = next;
  }
}
</script>

<template>
  <div class="pg-tags-rows">
    <div
      v-for="row in rows"
      :key="row.token"
      class="pg-tags-row"
      :class="{ 'pg-tags-row-category': row.bare }"
    >
      <span class="pg-tags-row-label">{{ row.label }}</span>
      <div
        class="pg-tags-tri"
        role="group"
        :aria-label="`${row.bare ? category.label : `${category.label} ${row.label}`} filter`"
      >
        <button
          v-for="option in STATES"
          :key="option.state"
          type="button"
          class="pg-tags-tri-btn"
          :class="{
            [`pg-tags-tri-btn-${option.state}`]: row.state === option.state,
          }"
          :aria-pressed="row.state === option.state"
          :disabled="!row.bare && valuesDisabled"
          :title="option.label"
          @click="setRowState(row, option.state)"
        >
          <component :is="option.icon" :size="13" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-tags-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pg-tags-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 3px 0;
}

.pg-tags-row-category {
  padding-bottom: 6px;

  .pg-tags-row-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--ui-c-text);
  }
}

.pg-tags-row:not(.pg-tags-row-category) {
  padding-left: 16px;
}

.pg-tags-row-label {
  font-size: 13px;
  color: var(--ui-c-text-muted);
}

.pg-tags-tri {
  display: flex;
}

.pg-tags-tri-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 22px;
  border: 1px solid var(--pg-border);
  border-left-width: 0;
  background: none;
  color: var(--ui-c-text-muted);
  cursor: pointer;
  transition: all var(--duration-fast) ease;

  &:first-child {
    border-left-width: 1px;
    border-radius: 6px 0 0 6px;
  }

  &:last-child {
    border-radius: 0 6px 6px 0;
  }

  &:hover:not(:disabled) {
    color: var(--ui-c-text);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  &-neutral {
    background: var(--pg-border);
    color: var(--ui-c-text);
  }

  &-allow {
    border-color: var(--p-primary-color);
    background: var(--p-primary-color);
    color: var(--p-primary-contrast-color);

    + .pg-tags-tri-btn {
      border-left-color: var(--p-primary-color);
    }
  }

  &-disallow {
    border-color: var(--p-red-500);
    background: var(--p-red-500);
    color: #fff;

    + .pg-tags-tri-btn {
      border-left-color: var(--p-red-500);
    }
  }
}
</style>
