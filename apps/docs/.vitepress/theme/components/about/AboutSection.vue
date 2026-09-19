<script setup lang="ts">
/**
 * A section of the About page: the heading, an optional lead and the content
 * below. The heading takes one entry per line.
 */
defineProps<{
  title: string[];
  lead?: string;
}>();
</script>

<template>
  <section class="site-container about-section">
    <h2 class="site-headline">
      <template v-for="(line, index) in title" :key="line">
        <br v-if="index > 0" />{{ line }}
      </template>
    </h2>
    <p v-if="lead" class="site-lead about-section-lead">{{ lead }}</p>
    <div v-if="$slots.actions" class="about-section-actions">
      <slot name="actions" />
    </div>
    <div class="about-section-body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.about-section {
  padding-top: 168px;

  &-lead {
    max-width: 760px;
    margin-top: 32px;
  }

  &-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 40px;
  }

  &-body {
    margin-top: 64px;
  }

  @media (max-width: 767px) {
    padding-top: 96px;

    &-lead {
      margin-top: 20px;
    }

    &-actions {
      margin-top: 28px;
    }

    &-body {
      margin-top: 40px;
    }
  }
}
</style>
