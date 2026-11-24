<script setup lang="ts">
/** Previous and next page, in sidebar order. */
import { withBase } from 'vitepress';
import { usePrevNext } from 'vitepress/dist/client/theme-default/composables/prev-next.js';

const control = usePrevNext();
</script>

<template>
  <nav
    v-if="control.prev?.link || control.next?.link"
    class="docs-pager"
    aria-label="Pager"
  >
    <a
      v-if="control.prev?.link"
      :href="withBase(control.prev.link)"
      class="docs-pager-link"
    >
      <span class="site-label">Previous</span>
      <span class="docs-pager-title">{{ control.prev.text }}</span>
    </a>
    <span v-else></span>
    <a
      v-if="control.next?.link"
      :href="withBase(control.next.link)"
      class="docs-pager-link docs-pager-next"
    >
      <span class="site-label">Next</span>
      <span class="docs-pager-title">{{ control.next.text }}</span>
    </a>
  </nav>
</template>

<style lang="scss" scoped>
.docs-pager {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding-top: 32px;
  border-top: 1px solid var(--db-line);

  @media (max-width: 767px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.docs-pager-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 22px;
  border: 1px solid var(--db-line);
  border-radius: var(--db-radius-6);
  color: var(--db-ink);
  transition: border-color 0.12s;

  &:hover {
    border-color: var(--db-ink-2);
  }
}

.docs-pager-next {
  align-items: flex-end;
  text-align: right;
}

.docs-pager-title {
  font-family: var(--db-font-display);
  font-size: 22px;
  line-height: 28px;
  font-weight: 700;
}
</style>
