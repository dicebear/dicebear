<script setup lang="ts">
/**
 * Statements on strong rules: a title, one sentence and the link that
 * follows from it, side by side where there is room. A link that earns
 * money for DiceBear or its sponsor says "Advertisement" below it and
 * carries rel="sponsored". The rows take the colors of their ground.
 */
export interface AboutRow {
  title: string;
  text: string;
  link: string;
  href: string;
  /** Marks the link as an ad. */
  sponsored?: boolean;
}

defineProps<{ rows: AboutRow[] }>();

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function rel(row: AboutRow): string | undefined {
  if (row.sponsored) {
    return 'sponsored noopener';
  }

  return isExternal(row.href) ? 'noopener noreferrer' : undefined;
}
</script>

<template>
  <div class="site-rows is-strong about-rows">
    <div v-for="row in rows" :key="row.title" class="site-row about-rows-row">
      <h3 class="site-heading">{{ row.title }}</h3>
      <p class="site-body">{{ row.text }}</p>
      <div class="about-rows-action">
        <a
          class="site-link-arrow"
          :href="row.href"
          :target="isExternal(row.href) ? '_blank' : undefined"
          :rel="rel(row)"
          >{{ row.link }}</a
        >
        <span v-if="row.sponsored" class="site-small">Advertisement</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about-rows-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 32px;

  > h3 {
    flex: 0 1 260px;
  }

  > p {
    flex: 1 1 320px;
  }
}

.about-rows-action {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-start;
}
</style>
