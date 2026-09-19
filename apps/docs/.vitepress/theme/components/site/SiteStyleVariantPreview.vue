<script setup lang="ts">
/**
 * One tile of a component's Examples: the whole avatar with this variant
 * forced in, on a seed where the component is visible. Every tile of the
 * same component shares that seed, so only the variant changes between them.
 */
import { computed, inject } from 'vue';
import { computedAsync } from '@vueuse/core';
import { findPreviewBase } from '@theme/utils/avatar/visibleSeed';
import {
  showVariantTagsDefault,
  showVariantTagsKey,
  variantTagsDefault,
  variantTagsKey,
} from '../styles/styleOptionsKeys';
import SiteAvatar from './SiteAvatar.vue';

const props = defineProps<{
  styleName: string;
  component: string;
  variant: string;
}>();

const variantTags = inject(variantTagsKey, variantTagsDefault);
const showVariantTags = inject(showVariantTagsKey, showVariantTagsDefault);

const base = computedAsync(
  () => findPreviewBase(props.styleName, props.component),
  undefined,
);

const options = computed(() =>
  base.value === undefined
    ? undefined
    : {
        ...base.value.options,
        [`${props.component}Probability`]: 100,
        [`${props.component}Variant`]: [props.variant],
      },
);

const tags = computed(() =>
  showVariantTags.value ? variantTags(props.component, props.variant) : [],
);

function selectLabel(event: MouseEvent) {
  const range = document.createRange();
  range.selectNodeContents(event.currentTarget as Node);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}
</script>

<template>
  <div class="site-style-variant-preview">
    <SiteAvatar
      v-if="options"
      :style-name="styleName"
      :options="options"
      :size="80"
      :radius="16"
      mode="library"
      :alt="`${component} ${variant}`"
    />
    <div v-else class="site-tile site-style-variant-preview-placeholder"></div>
    <code class="site-style-variant-preview-label" @click="selectLabel">{{
      variant
    }}</code>
    <div v-if="tags.length > 0" class="site-style-variant-preview-tags">
      <code v-for="tag in tags" :key="tag">{{ tag }}</code>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-style-variant-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;

  &-placeholder {
    width: 80px;
    height: 80px;
    border-radius: var(--db-radius-4);
  }

  &-label {
    max-width: 100%;
    font-family: var(--db-font-mono);
    font-size: 11px;
    line-height: 14px;
    color: var(--db-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: text;
  }

  &-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;

    code {
      padding: 1px 6px;
      border-radius: 5px;
      background: var(--db-soft);
      font-family: var(--db-font-mono);
      font-size: 10px;
      line-height: 14px;
      color: var(--db-muted);
    }
  }
}
</style>
