<script setup lang="ts">
/**
 * One tag category as a row: its name with the switch for the whole
 * category, and the values as chips under it. A chip cycles through
 * neutral, allow and disallow.
 */
import { computed } from 'vue';
import useStore from '@theme/stores/playground';
import { toTagTokens, type TagCategory } from '@theme/utils/avatar/tags';
import SiteSegmented from '@theme/components/site/SiteSegmented.vue';

const props = defineProps<{ category: TagCategory }>();

const store = useStore();

const TAGS_KEY = 'tags';

// Every state maps 1:1 to a filter token. The category row writes the bare
// tokens: allow = `cat` (requires the category, which turns an opt-in
// feature like the animation on), disallow = `!cat`. A value chip writes
// `cat:value` / `!cat:value`.
type RowState = 'neutral' | 'allow' | 'disallow';

const STATES: { value: RowState; label: string }[] = [
  { value: 'neutral', label: 'Any' },
  { value: 'allow', label: 'Allow' },
  { value: 'disallow', label: 'Disallow' },
];

const NEXT: Record<RowState, RowState> = {
  neutral: 'allow',
  allow: 'disallow',
  disallow: 'neutral',
};

const selected = computed<string[]>(() =>
  toTagTokens(store.avatarStyleOptions[TAGS_KEY]),
);

function stateOf(token: string): RowState {
  const tokens = selected.value;

  return tokens.includes(`!${token}`)
    ? 'disallow'
    : tokens.includes(token)
      ? 'allow'
      : 'neutral';
}

const categoryState = computed(() => stateOf(props.category.category));

const chips = computed(() =>
  props.category.tags.map((tag) => ({
    token: tag.token,
    label: tag.label,
    state: stateOf(tag.token),
  })),
);

// A disallowed category drops every tagged variant, so its chips are moot
// and get disabled.
const chipsDisabled = computed(() => categoryState.value === 'disallow');

function setState(token: string, bare: boolean, state: RowState): void {
  let next = selected.value.filter((t) => t !== token && t !== `!${token}`);

  // Disallowing the whole category drops every tagged variant anyway, so the
  // category's value tokens are moot and get cleared along the way.
  if (bare && state === 'disallow') {
    next = next.filter(
      (t) => !t.startsWith(`${token}:`) && !t.startsWith(`!${token}:`),
    );
  }

  if (state === 'allow') {
    next.push(token);
  } else if (state === 'disallow') {
    next.push(`!${token}`);
  }

  if (next.length === 0) {
    delete store.avatarStyleOptions[TAGS_KEY];
  } else {
    store.avatarStyleOptions[TAGS_KEY] = next;
  }
}

function chipTitle(label: string, state: RowState): string {
  if (state === 'allow') return `${label}: allowed, click to disallow`;
  if (state === 'disallow') return `${label}: disallowed, click to clear`;

  return `${label}: click to allow`;
}
</script>

<template>
  <div class="pg-tags-row">
    <div class="pg-tags-row-head">
      <span class="pg-tags-row-name">{{ category.label }}</span>
      <SiteSegmented
        :model-value="categoryState"
        :options="STATES"
        size="sm"
        :aria-label="`${category.label} filter`"
        class="pg-tags-row-switch"
        @update:model-value="setState(category.category, true, $event)"
      />
    </div>

    <div v-if="chips.length > 0" class="pg-tags-chips">
      <button
        v-for="chip in chips"
        :key="chip.token"
        type="button"
        class="site-chip pg-tags-chip"
        :data-state="chip.state"
        :disabled="chipsDisabled"
        :title="chipTitle(chip.label, chip.state)"
        @click="setState(chip.token, false, NEXT[chip.state])"
      >
        {{ chip.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-tags-row {
  padding: 12px 0;
  border-top: 1px solid var(--db-line);
}

.pg-tags-row-head {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 30px;
}

.pg-tags-row-name {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  line-height: 24px;
  font-weight: 600;
  color: var(--db-ink);
}

.pg-tags-row-switch {
  flex-shrink: 0;
  grid-auto-columns: auto;
}

.pg-tags-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

/* Neutral is the plain chip, allowed the tint, disallowed struck through. */
.pg-tags-chip {
  cursor: pointer;

  &[data-state='allow'] {
    border-color: var(--db-brand);
    background: var(--db-tint);
    color: var(--db-tint-text);
  }

  &[data-state='disallow'] {
    border-color: var(--db-danger);
    background: var(--db-danger-soft);
    color: var(--db-danger);
    text-decoration: line-through;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid var(--db-brand);
    outline-offset: 2px;
  }
}

@container pg-options (max-width: 300px) {
  .pg-tags-row-head {
    flex-wrap: wrap;
  }

  .pg-tags-row-switch {
    width: 100%;
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
  }
}
</style>
