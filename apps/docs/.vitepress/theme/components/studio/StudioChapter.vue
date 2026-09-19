<script setup lang="ts">
/**
 * A chapter of the page: the section heading, a lead and the rows below.
 * With an id the heading is a target of the tab index.
 */
defineProps<{
  id?: string;
  title: string;
  lead?: string;
}>();
</script>

<template>
  <section class="site-container studio-chapter">
    <h2 :id="id" class="site-headline studio-chapter-title">{{ title }}</h2>
    <p v-if="lead" class="site-lead studio-chapter-lead">{{ lead }}</p>
    <div class="studio-chapter-body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.studio-chapter {
  padding-top: 168px;

  &-title {
    scroll-margin-top: calc(var(--db-header-h) + 32px);
  }

  &-lead {
    max-width: 820px;
    margin-top: 32px;
  }

  &-body {
    margin-top: 72px;
  }

  /* Without a lead the content follows the heading directly. */
  &-title + &-body {
    margin-top: 64px;
  }

  @media (max-width: 767px) {
    padding-top: 96px;

    &-body {
      margin-top: 24px;
    }

    &-title + &-body {
      margin-top: 40px;
    }
  }
}
</style>
