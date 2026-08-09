<script setup lang="ts">
import { siGithub } from 'simple-icons';
import Button from 'primevue/button';
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
    <Button
      as="a"
      href="https://github.com/dicebear/dicebear"
      target="_blank"
      rel="noopener"
      severity="contrast"
      size="small"
      class="pg-star-cta-button"
      @click="onClick"
    >
      <UiIcon :path="siGithub.path" :size="16" />
      Star on GitHub
    </Button>
  </div>
</template>

<style scoped lang="scss">
.pg-star-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--pg-border);
}

.pg-star-cta-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  color: var(--ui-c-text-muted);
}

.pg-star-cta-button {
  flex: none;
}

@media (max-width: 540px) {
  .pg-star-cta {
    flex-direction: column;
    align-items: stretch;
  }

  .pg-star-cta-text {
    text-align: center;
  }
}
</style>
