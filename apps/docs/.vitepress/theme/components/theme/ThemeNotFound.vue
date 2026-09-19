<script setup lang="ts">
import { withBase } from 'vitepress';
</script>

<template>
  <section class="theme-not-found site-container">
    <h1 class="site-display">Page not found</h1>
    <p class="site-lead">
      The address may be from an older version of these docs, or it has a typo.
    </p>
    <div class="theme-not-found-actions">
      <a :href="withBase('/')" class="site-btn site-btn-primary site-btn-lg"
        >Go to the homepage</a
      >
      <a
        :href="withBase('/styles/')"
        class="site-btn site-btn-secondary site-btn-lg"
        >Browse the styles</a
      >
    </div>
  </section>
</template>

<style lang="scss" scoped>
.theme-not-found {
  padding-top: 120px;
  padding-bottom: 168px;
}

.site-lead {
  max-width: 640px;
  margin-top: 32px;
}

.theme-not-found-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 40px;
}
</style>
