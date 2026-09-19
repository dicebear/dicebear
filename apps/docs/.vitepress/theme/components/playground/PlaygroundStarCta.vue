<script setup lang="ts">
import { siGithub } from 'simple-icons';
import { track } from '@theme/utils/track';
import { UiIcon } from '../ui';

// `source` tells the copy dialog apart from the download dialog in the Umami
// stats, so the two can be compared.
const props = defineProps<{
  source: string;
}>();

function onClick() {
  track('Star CTA', { source: props.source });
}
</script>

<template>
  <div class="pg-star-cta">
    <p class="pg-star-cta-text">
      DiceBear is free and open source. A star on GitHub helps other developers
      find it.
    </p>
    <a
      href="https://github.com/dicebear/dicebear"
      target="_blank"
      rel="noopener noreferrer"
      class="site-btn site-btn-primary pg-star-cta-button"
      @click="onClick"
    >
      <UiIcon :path="siGithub.path" :size="16" aria-hidden="true" />
      Star on GitHub
    </a>
  </div>
</template>

<style scoped lang="scss">
.pg-star-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--db-line);
}

.pg-star-cta-text {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--db-ink-2);
}

.pg-star-cta-button {
  flex-shrink: 0;
  gap: 8px;
  height: 40px;
  padding: 0 18px;
  border-radius: var(--db-radius-3);
  font-size: 15px;
}

@media (max-width: 540px) {
  .pg-star-cta {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
