<script setup lang="ts">
/**
 * One group of options with its heading. Every group stays open, so the
 * page reads top to bottom and a search on the page finds every option.
 */
import type { OptionGroup } from './SiteStyleOptions.vue';
import SiteStyleOptionRow from './SiteStyleOptionRow.vue';

defineProps<{
  styleName: string;
  group: OptionGroup;
}>();
</script>

<template>
  <div class="site-style-option-group">
    <div class="site-style-option-group-head">
      <h3 :id="`options-group-${group.id}`" class="site-h3">
        {{ group.label }}
      </h3>
      <span class="site-small">{{ Object.keys(group.options).length }}</span>
    </div>
    <div class="site-style-option-group-rows">
      <SiteStyleOptionRow
        v-for="(value, name) in group.options"
        :key="name"
        :style-name="styleName"
        :name="name"
        :value="value"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-style-option-group {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-bottom: 1px solid var(--db-line);
  scroll-margin-top: calc(var(--db-header-h) + 80px);

  &-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0 12px;

    h3 {
      scroll-margin-top: calc(var(--db-header-h) + 80px);
    }
  }

  &-rows {
    display: flex;
    flex-direction: column;
  }
}
</style>
