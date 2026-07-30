<script setup lang="ts">
import { useCombinationCount } from '@theme/composables/useCombinationCount';

const count = useCombinationCount();
</script>

<template>
  <div v-if="count" class="pg-combo">
    <p class="pg-combo-main">
      <span class="pg-combo-value">{{ count.display }}</span>
      <span class="pg-combo-label">possible avatars</span>
    </p>
    <p class="pg-combo-hint">
      Changes as you restrict variants, tags, colors, or probabilities.
      <a href="/guides/how-many-unique-avatars/">Learn more →</a>
    </p>
  </div>
</template>

<style scoped lang="scss">
.pg-combo {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pg-combo-main {
  margin: 0;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--ui-c-text-muted);
  white-space: nowrap;
}

.pg-combo-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-1);
}

.pg-combo-hint {
  margin: 0;
  font-size: 11px;
  line-height: 1.4;
  color: var(--ui-c-text-subtle);

  a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: var(--pg-border);
    text-underline-offset: 2px;
    white-space: nowrap;
    transition:
      color var(--duration-fast),
      text-decoration-color var(--duration-fast);

    &:hover {
      color: var(--vp-c-brand-1);
      text-decoration-color: var(--vp-c-brand-1);
    }
  }
}
</style>
