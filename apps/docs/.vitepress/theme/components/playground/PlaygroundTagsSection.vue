<script setup lang="ts">
import { computed } from 'vue';
import useStore from '@theme/stores/playground';
import { groupTagsByCategory } from '@theme/utils/avatar/tags';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const props = defineProps<{ mode: 'allow' | 'disallow'; tags: string[] }>();

const store = useStore();

const TAGS_KEY = 'tags';

const categories = computed(() => groupTagsByCategory(props.tags));

const selected = computed<string[]>(() => {
  const value = store.avatarStyleOptions[TAGS_KEY];

  return Array.isArray(value) ? (value as string[]) : [];
});

// The single source of the polarity marker: `!` disallows, empty allows.
// Both the per-category prefix and the full token build on it.
const marker = computed(() => (props.mode === 'disallow' ? '!' : ''));

function categoryPrefix(category: string): string {
  return `${marker.value}${category}:`;
}

function tokenFor(category: string, value: string): string {
  return `${categoryPrefix(category)}${value}`;
}

function setTags(next: string[]): void {
  if (next.length === 0) {
    delete store.avatarStyleOptions[TAGS_KEY];
  } else {
    store.avatarStyleOptions[TAGS_KEY] = next;
  }
}

function isActive(category: string, value: string): boolean {
  return selected.value.includes(tokenFor(category, value));
}

function toggle(category: string, value: string): void {
  const token = tokenFor(category, value);

  setTags(
    selected.value.includes(token)
      ? selected.value.filter((t) => t !== token)
      : [...selected.value, token],
  );
}

function categoryHasTokens(category: string): boolean {
  return selected.value.some((t) => t.startsWith(categoryPrefix(category)));
}

function resetCategory(category: string): void {
  setTags(
    selected.value.filter((t) => !t.startsWith(categoryPrefix(category))),
  );
}
</script>

<template>
  <div class="pg-tags">
    <p class="pg-help">
      <template v-if="mode === 'allow'">
        Allow only the selected tags in each category. This limits which
        variants can appear, but it does not force a feature, since variants
        without that tag and the component's own probability still apply. Within
        a category the tags act as "or". Different categories act as "and".
      </template>
      <template v-else>
        Disallow every variant that carries a selected tag.
      </template>
      Components with a variant chosen manually ignore these filters.
    </p>

    <div class="pg-tags-groups">
      <div
        v-for="group in categories"
        :key="group.category"
        class="pg-tags-group"
      >
        <div class="pg-field-label">
          <span>{{ group.label }}</span>
          <PlaygroundFieldReset
            v-if="categoryHasTokens(group.category)"
            @click="resetCategory(group.category)"
          />
        </div>
        <div class="pg-tags-chips">
          <button
            v-for="tag in group.tags"
            :key="tag.token"
            type="button"
            class="pg-tags-chip"
            :class="{
              'pg-tags-chip-allow':
                mode === 'allow' && isActive(group.category, tag.value),
              'pg-tags-chip-disallow':
                mode === 'disallow' && isActive(group.category, tag.value),
            }"
            @click="toggle(group.category, tag.value)"
          >
            {{ tag.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-tags {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-tags-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-tags-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pg-tags-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pg-tags-chip {
  padding: 4px 10px;
  border: 1px solid var(--pg-border);
  border-radius: 999px;
  background: none;
  font-size: 12px;
  color: var(--ui-c-text-muted);
  cursor: pointer;
  transition: all var(--duration-fast) ease;

  &:hover {
    border-color: var(--p-primary-200);
  }

  &-allow {
    border-color: var(--p-primary-color);
    background: var(--p-primary-color);
    color: var(--p-primary-contrast-color);
  }

  &-disallow {
    border-color: var(--p-red-500);
    background: var(--p-red-500);
    color: #fff;
  }
}
</style>
