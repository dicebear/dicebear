<script setup lang="ts">
import { computed } from 'vue';
import { kebabCase } from 'change-case';
import { ArrowRight } from '@lucide/vue';
import useStore from '@theme/stores/playground';

const store = useStore();

const url = computed(() => `/styles/${kebabCase(store.avatarStyleName)}/`);
</script>

<template>
  <a :href="url" class="pg-doc-link hv-row">
    <span class="pg-doc-main">
      <span class="pg-doc-label">Style documentation</span>
      <span class="pg-doc-hint"
        >Full options reference, code examples, and integration guides.</span
      >
    </span>
    <ArrowRight :size="18" class="pg-doc-arrow hv-chev" aria-hidden="true" />
  </a>
</template>

<style scoped lang="scss">
.pg-doc-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--db-ink);
  text-decoration: none;
}

.pg-doc-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pg-doc-label {
  font-size: 16px;
  line-height: 26px;
  font-weight: 600;
}

.pg-doc-hint {
  font-size: 14px;
  line-height: 20px;
  color: var(--db-muted);
}

.pg-doc-arrow {
  flex-shrink: 0;
  color: var(--db-muted);
}

@media (max-width: 767px) {
  .pg-doc-label {
    font-size: 15px;
    line-height: 24px;
  }

  .pg-doc-hint {
    font-size: 13px;
    line-height: 18px;
  }
}
</style>
