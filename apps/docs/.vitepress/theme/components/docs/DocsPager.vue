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
      class="docs-pager-link hv-outline"
    >
      <span class="docs-pager-label">Previous page</span>
      <span class="docs-pager-title">{{ control.prev.text }}</span>
    </a>
    <span v-else></span>
    <a
      v-if="control.next?.link"
      :href="withBase(control.next.link)"
      class="docs-pager-link docs-pager-next hv-outline"
    >
      <span class="docs-pager-label">Next page</span>
      <span class="docs-pager-title">{{ control.next.text }}</span>
    </a>
  </nav>
</template>

<style lang="scss" scoped>
.docs-pager {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 767px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.docs-pager-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 20px;
  border: 1px solid var(--db-line);
  border-radius: 14px;
}

.docs-pager-next {
  text-align: right;
}

.docs-pager-label {
  font-size: 13px;
  line-height: 18px;
  color: var(--db-muted);
}

.docs-pager-title {
  font-size: 17px;
  line-height: 28px;
  font-weight: 600;
  color: var(--db-brand-text);
}
</style>
