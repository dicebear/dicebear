<script setup lang="ts">
import { computed } from 'vue';
import useStore from '@theme/stores/playground';
import { toTagTokens, type TagCategory } from '@theme/utils/avatar/tags';
import SiteSegmented from '@theme/components/site/SiteSegmented.vue';

const props = defineProps<{ category: TagCategory }>();

const store = useStore();

const TAGS_KEY = 'tags';

// Every row is a tri-state switch, and every state maps 1:1 to a filter
// token. The category row writes the bare tokens: allow = `cat` (requires the
// category, which turns an opt-in feature like the animation on), disallow =
// `!cat`. A value row writes `cat:value` / `!cat:value`.
type RowState = 'neutral' | 'allow' | 'disallow';

const STATES: { value: RowState; label: string }[] = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'allow', label: 'Allow' },
  { value: 'disallow', label: 'Disallow' },
];

const selected = computed<string[]>(() =>
  toTagTokens(store.avatarStyleOptions[TAGS_KEY]),
);

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

function setRowState(
  row: { token: string; bare: boolean },
  state: RowState,
): void {
  let next = selected.value.filter(
    (t) => t !== row.token && t !== `!${row.token}`,
  );

  // Disallowing the whole category drops every tagged variant anyway, so the
  // category's value tokens are moot and get cleared along the way.
  if (row.bare && state === 'disallow') {
    next = next.filter(
      (t) => !t.startsWith(`${row.token}:`) && !t.startsWith(`!${row.token}:`),
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
      <SiteSegmented
        :model-value="row.state"
        :options="STATES"
        size="sm"
        :aria-label="`${row.bare ? category.label : `${category.label} ${row.label}`} filter`"
        :disabled="!row.bare && valuesDisabled"
        class="pg-tags-row-states"
        @update:model-value="setRowState(row, $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-tags-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-tags-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.pg-tags-row-label {
  min-width: 0;
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
  color: var(--db-ink);
}

.pg-tags-row-category .pg-tags-row-label {
  font-weight: 700;
}

.pg-tags-row .pg-tags-row-states {
  flex-shrink: 0;
  grid-auto-columns: 84px;
}

/* On a phone column the three states take the full width under the label. */
@container pg-options (max-width: 520px) {
  .pg-tags-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .pg-tags-row .pg-tags-row-states {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
  }
}
</style>
