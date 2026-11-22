<script setup lang="ts">
/** "On this page": the h2 headings, with a marker on the one in view. */
import type { OutlineItem } from '@theme/composables/useOutline';

defineProps<{ items: OutlineItem[]; active: string }>();
defineEmits<{ navigate: [] }>();
</script>

<template>
  <nav v-if="items.length" class="docs-outline" aria-label="On this page">
    <span class="docs-outline-title">On this page</span>
    <ul>
      <li v-for="item in items" :key="item.id">
        <a
          :href="`#${item.id}`"
          :class="{ 'is-active': item.id === active }"
          :aria-current="item.id === active ? 'location' : undefined"
          @click="$emit('navigate')"
          >{{ item.text }}</a
        >
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.docs-outline {
  display: flex;
  flex-direction: column;
}

.docs-outline-title {
  margin-bottom: 8px;
  font-family: var(--db-font-display);
  font-size: 17px;
  line-height: 26px;
  font-weight: 700;
  color: var(--db-ink);
}

ul {
  display: flex;
  flex-direction: column;
}

/* A rail on the left; the section in view marks it in ink. */
a {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border-left: 3px solid var(--db-line);
  font-size: 15px;
  line-height: 22px;
  color: var(--db-ink-2);
  transition:
    color 0.12s,
    border-color 0.12s;

  &:hover {
    color: var(--db-ink);
  }

  &.is-active {
    border-left-color: var(--db-ink);
    font-weight: 600;
    color: var(--db-ink);
  }
}
</style>
