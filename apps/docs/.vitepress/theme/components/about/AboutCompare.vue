<script setup lang="ts">
/** How DiceBear compares with four other avatar libraries. */
import SiteComparisonTable from '../site/SiteComparisonTable.vue';
import SiteSection from '../site/SiteSection.vue';
</script>

<template>
  <SiteSection
    layout="stack"
    title="How DiceBear compares"
    hint="Every tool has its strengths. Choose what works best for your project."
    class="about-compare"
  >
    <SiteComparisonTable />
    <p class="site-text about-compare-note">
      This comparison is based on publicly available information and may not
      reflect the latest updates.
    </p>
  </SiteSection>
</template>

<style scoped lang="scss">
.about-compare {
  :deep(.site-section-body) {
    gap: 20px;
  }

  &-note {
    max-width: 760px;
  }
}
</style>
