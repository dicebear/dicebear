<script setup lang="ts">
import PlaygroundLicenseText from './PlaygroundLicenseText.vue';
</script>

<template>
  <div class="playground-license-alert">
    <strong>
      Please note the following license before using the avatar:
    </strong>
    <PlaygroundLicenseText />
  </div>
</template>

<style scoped lang="scss">
.playground-license-alert {
  padding: 14px 16px;
  border: 1px solid var(--db-line);
  border-radius: var(--db-radius-3);
  background: var(--db-soft);
  font-size: 14px;
  line-height: 20px;
  color: var(--db-ink-2);

  strong {
    display: block;
    font-weight: 600;
    color: var(--db-ink);
  }

  /* The license text of the built-in styles brings its own link colors. */
  :deep(p a) {
    font-weight: 500;
    color: var(--db-brand-text);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}
</style>
