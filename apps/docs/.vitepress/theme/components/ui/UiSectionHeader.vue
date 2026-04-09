<script setup lang="ts">
import UiBadge from './UiBadge.vue';
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';

defineProps<{
  badge?: string;
  badgeVariant?: 'brand' | 'green' | 'orange';
  headline?: string;
  description?: string;
  tag?: 'h1' | 'h2' | 'h3';
}>();
</script>

<template>
  <div class="ui-section-header">
    <UiBadge v-if="badge" :variant="badgeVariant">
      <slot name="badge-icon" />
      {{ badge }}
    </UiBadge>
    <UiHeadline :tag="tag">
      <slot name="headline">{{ headline }}</slot>
    </UiHeadline>
    <UiDescription v-if="$slots.description || description">
      <slot name="description">{{ description }}</slot>
    </UiDescription>
    <slot name="after-description" />
  </div>
</template>

<style lang="scss" scoped>
.ui-section-header {
  text-align: center;
  margin-bottom: 64px;
}
</style>
