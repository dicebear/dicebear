<script setup lang="ts">
import UiLicenseText from './UiLicenseText.vue';

defineProps<{
  styleName: string;
}>();
</script>

<template>
  <div class="ui-license-alert">
    <strong>
      Please note the following license before using the avatar:
    </strong>
    <UiLicenseText :style-name="styleName" />
  </div>
</template>

<style scoped lang="scss">
.ui-license-alert {
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
}
</style>
