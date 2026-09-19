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
          class="hv-fade"
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
  gap: 10px;
}

.docs-outline-title {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: var(--db-ink);
}

ul {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--db-line);
}

a {
  display: block;
  margin-left: -1px;
  padding: 4px 0 4px 14px;
  border-left: 2px solid transparent;
  font-size: 16px;
  line-height: 26px;
  color: var(--db-ink-2);

  &.is-active {
    border-left-color: var(--db-brand);
    font-weight: 600;
    color: var(--db-brand-text);
  }
}
</style>
