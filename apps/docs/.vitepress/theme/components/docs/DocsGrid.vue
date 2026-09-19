<script setup lang="ts">
/**
 * A hairline list: the term on the left with an optional chip under it, the
 * text on the right. Rows with a `link` are links and end in an arrow, which
 * points up and to the right for external targets. `columns` has no effect on
 * the list.
 */
import { computed } from 'vue';
import { ArrowRight, ArrowUpRight } from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    items: Array<{
      title: string;
      description: string;
      badge?: string;
      link?: string;
      mono?: boolean;
    }>;
    columns?: 2 | 3;
  }>(),
  {
    columns: 3,
  },
);

const rows = computed(() =>
  props.items.map((item) => ({
    ...item,
    external: /^https?:\/\//.test(item.link ?? ''),
  })),
);

const hasLinks = computed(() => props.items.some((item) => item.link));
</script>

<template>
  <div class="docs-grid" :class="{ 'has-links': hasLinks }">
    <component
      :is="row.link ? 'a' : 'div'"
      v-for="row in rows"
      :key="row.title"
      class="docs-grid-row"
      :class="{ 'hv-row': row.link }"
      :href="row.link"
      :target="row.external ? '_blank' : undefined"
      :rel="row.external ? 'noopener' : undefined"
    >
      <span class="docs-grid-term">
        <span class="docs-grid-title" :class="{ 'is-mono': row.mono }">{{
          row.title
        }}</span>
        <span v-if="row.badge" class="site-chip site-chip-brand">{{
          row.badge
        }}</span>
      </span>
      <span class="docs-grid-desc">{{ row.description }}</span>
      <span v-if="row.link" class="docs-grid-chev hv-chev">
        <ArrowUpRight v-if="row.external" :size="16" />
        <ArrowRight v-else :size="18" />
      </span>
    </component>
  </div>
</template>

<style lang="scss" scoped>
.docs-grid {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--db-line);
  /* The rows inherit their color, so the hover color of a linked row wins. */
  color: var(--db-ink);

  &-row {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 24px;
    padding: 18px 0;
    border-top: 1px solid var(--db-line);
    text-decoration: none;
  }

  &.has-links &-row {
    grid-template-columns: 180px minmax(0, 1fr) 20px;
  }

  &-term {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 8px;
  }

  &-title {
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;

    &.is-mono {
      font-family: var(--db-font-mono);
      font-size: 15px;
    }
  }

  &-desc {
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
  }

  &-chev {
    display: flex;
    padding-top: 4px;
    color: var(--db-muted);
  }

  @media (max-width: 767px) {
    &-row,
    &.has-links &-row {
      grid-template-columns: minmax(0, 1fr);
      gap: 4px;
    }

    &-term {
      flex-direction: row;
      align-items: center;
    }

    &-chev {
      display: none;
    }
  }
}
</style>
