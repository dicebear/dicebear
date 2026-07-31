<script setup lang="ts">
defineProps<{
  tag?: 'h1' | 'h2' | 'h3';
  align?: 'center' | 'left';
}>();
</script>

<template>
  <component
    :is="tag || 'h2'"
    :class="[
      'ui-headline',
      `ui-headline-highlight-brand`,
      align === 'left' && 'ui-headline-left',
    ]"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.ui-headline {
  font-size: clamp(40px, 5vw, 56px);
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0 auto 24px;
  max-width: 720px;

  &-left {
    margin-left: 0;
    margin-right: auto;
    text-align: left;
  }
  line-height: 1.1;
  letter-spacing: -0.035em;
  text-wrap: balance;
  --hl-display: inline;

  @media (max-width: 640px) {
    font-size: 34px;
  }

  /* Highlighted words use the solid brand color (not a gradient). */
  :deep(strong) {
    display: var(--hl-display, inline);
    color: var(--vp-c-brand-2);
    font-weight: 800;
  }
}
</style>
