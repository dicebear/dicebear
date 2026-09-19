<script setup lang="ts">
import { useCombinationCount } from '@theme/composables/useCombinationCount';

const count = useCombinationCount();
</script>

<template>
  <div v-if="count" class="pg-combo">
    <p class="pg-combo-main">
      <span class="pg-combo-value">{{ count.display }}</span>
      <span class="pg-combo-label">distinct avatars</span>
    </p>
    <a href="/understand/how-many-unique-avatars/" class="pg-combo-link hv-link"
      >Learn more</a
    >
  </div>
</template>

<style scoped lang="scss">
.pg-combo {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 16px;
}

.pg-combo-main {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 10px;
  margin: 0;
}

.pg-combo-value {
  font-size: 32px;
  line-height: 38px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--db-ink);
}

.pg-combo-label {
  font-size: 16px;
  line-height: 26px;
  color: var(--db-ink-2);
}

.pg-combo-link {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--db-brand-text);
  text-decoration: none;
}

@media (max-width: 767px) {
  .pg-combo-main {
    gap: 0 8px;
  }

  .pg-combo-value {
    font-size: 20px;
    line-height: 32px;
    letter-spacing: -0.01em;
  }

  .pg-combo-label {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
