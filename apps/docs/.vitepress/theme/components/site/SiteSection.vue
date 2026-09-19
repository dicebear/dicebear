<script setup lang="ts">
/**
 * A page section: the title and a short hint stay in a narrow column on the
 * left, the content takes the rest. The id is the anchor the sub-navigation
 * points at.
 */
defineProps<{
  id: string;
  title: string;
  hint?: string;
}>();
</script>

<template>
  <section :id="id" class="site-container site-section">
    <div class="site-section-aside">
      <h2 class="site-h2">{{ title }}</h2>
      <p v-if="hint" class="site-small site-section-hint">{{ hint }}</p>
    </div>
    <div class="site-section-body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.site-section {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 48px;
  align-items: start;
  padding-top: 128px;
  scroll-margin-top: calc(var(--db-header-h) + 80px);

  &-aside {
    position: sticky;
    top: calc(var(--db-header-h) + 80px);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &-hint {
    max-width: 230px;
    font-size: 15px;
    line-height: 24px;
  }

  &-body {
    display: flex;
    flex-direction: column;
    gap: 40px;
    min-width: 0;
  }

  @media (max-width: 959px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
    padding-top: 88px;

    &-aside {
      position: static;
      gap: 12px;
    }

    &-hint {
      max-width: none;
    }
  }
}
</style>
