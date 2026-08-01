<script setup lang="ts">
import { computed, inject } from 'vue';
import { getAvatarPropertyPreviewOptions } from '@theme/utils/avatar/preview';
import { padColors, resolveColors } from '@theme/utils/avatar/colors';
import { exampleSeeds } from '@theme/config/styleCategories';
import { UiAvatar } from '../ui';
import {
  componentNamesKey,
  componentNamesDefault,
  styleColorsKey,
  styleColorsDefault,
  componentPreviewKey,
  componentPreviewDefault,
  variantTagsKey,
  variantTagsDefault,
  showVariantTagsKey,
  showVariantTagsDefault,
} from './styleOptionsKeys';

const props = defineProps<{
  styleName: string;
  name: string;
  value: string | number | boolean;
}>();

const allComponentNames = inject(componentNamesKey, componentNamesDefault);
const styleColors = inject(styleColorsKey, styleColorsDefault);
const preview = inject(componentPreviewKey, componentPreviewDefault);
const variantTags = inject(variantTagsKey, variantTagsDefault);
const showVariantTags = inject(showVariantTagsKey, showVariantTagsDefault);

const previewTarget = computed(() => {
  const n = props.name;

  if (n.endsWith('Variant')) {
    return { type: 'variant' as const, component: n.replace(/Variant$/, '') };
  }

  if (n.endsWith('Probability')) {
    return {
      type: 'probability' as const,
      component: n.replace(/Probability$/, ''),
    };
  }

  // ColorFillStops must come before ColorFill (longer suffix first)
  if (n.endsWith('ColorFillStops')) {
    return {
      type: 'colorFillStops' as const,
      color: n.slice(0, -'ColorFillStops'.length),
    };
  }

  if (n.endsWith('ColorFill')) {
    return {
      type: 'colorFill' as const,
      color: n.slice(0, -'ColorFill'.length),
    };
  }

  if (n.endsWith('ColorAngle')) {
    return {
      type: 'colorAngle' as const,
      color: n.slice(0, -'ColorAngle'.length),
    };
  }

  if (n.endsWith('Color')) {
    return { type: 'color' as const, color: n.replace(/Color$/, '') };
  }

  return { type: 'general' as const };
});

// The `animation` component has no artwork of its own. Its variants are a
// marker class plus a <style> block that animates the other components, so an
// isolated preview would render an empty canvas. Those options go through the
// full-avatar path instead.
const animationComponent = 'animation';

const isComponentPreview = computed(() => {
  if (!preview.value) return false;

  const t = previewTarget.value;

  // Color-typed previews (plain *Color and the *ColorFill / *ColorFillStops /
  // *ColorAngle gradient configuration options) render the full avatar via the
  // HTTP-API path, so e.g. Identicon's rowColor preview shows every row
  // instead of a single isolated row from one component.
  if (t.type === 'variant' || t.type === 'probability') {
    return (
      t.component !== animationComponent &&
      allComponentNames.value.includes(t.component)
    );
  }

  return false;
});

const previewDataUri = computed(() => {
  if (!isComponentPreview.value || !preview.value) return undefined;

  const p = preview.value;
  const t = previewTarget.value;

  if (t.type === 'variant') {
    return p.toDataUri(t.component, String(props.value));
  }

  if (t.type === 'probability') {
    const firstVariant = p.firstVariant(t.component);
    if (!firstVariant) return undefined;

    return p.toDataUri(t.component, firstVariant, {
      [props.name]: props.value,
      backgroundColor: resolveColors('background', styleColors.value),
    });
  }

  return undefined;
});

const generalOptions = computed(() => {
  if (isComponentPreview.value) return undefined;

  const t = previewTarget.value;
  let opts: Record<string, unknown>;

  if (
    t.type === 'general' ||
    t.type === 'variant' ||
    t.type === 'probability'
  ) {
    opts = getAvatarPropertyPreviewOptions(props.name, props.value);
  } else {
    const colorKey = `${t.color}Color`;
    const fillKey = `${t.color}ColorFill`;
    opts = { seed: exampleSeeds[0] };

    if (t.type === 'color') {
      opts[colorKey] = [props.value];
    } else {
      const stops = t.type === 'colorFillStops' ? Number(props.value) || 2 : 2;

      opts[colorKey] = padColors(
        resolveColors(t.color, styleColors.value),
        stops,
      ).slice(0, stops);
      opts[fillKey] = t.type === 'colorFill' ? [props.value] : ['linear'];

      if (t.type === 'colorFillStops')
        opts[`${t.color}ColorFillStops`] = [props.value];
      if (t.type === 'colorAngle') opts[`${t.color}ColorAngle`] = [props.value];
    }
  }

  // Isolated component previews drop the background so the shape reads on the
  // checkerboard. The animation previews are complete avatars, so they keep
  // the style's own background like every other full-avatar preview.
  if (t.type === 'variant' && t.component !== animationComponent) {
    opts.backgroundColor = [];
  }

  return opts;
});

const tags = computed(() => {
  if (!showVariantTags.value) {
    return [];
  }

  const t = previewTarget.value;

  return t.type === 'variant'
    ? variantTags(t.component, String(props.value))
    : [];
});

function selectLabel(event: MouseEvent) {
  const range = document.createRange();
  range.selectNodeContents(event.currentTarget as Node);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}
</script>

<template>
  <div class="style-options-preview">
    <div class="style-options-preview-avatar-wrapper">
      <div v-if="previewDataUri" class="style-options-preview-img">
        <img :src="previewDataUri" alt="" />
      </div>
      <UiAvatar
        v-else-if="generalOptions"
        :size="name === 'size' ? Number(value) : 80"
        :styleName="styleName"
        :styleOptions="generalOptions"
        mode="http-api"
        class="style-options-preview-avatar"
      />
    </div>
    <code class="style-options-preview-label" @click="selectLabel">{{
      value
    }}</code>
    <div v-if="tags.length > 0" class="style-options-preview-tags">
      <code v-for="tag in tags" :key="tag" class="style-options-preview-tag">{{
        tag
      }}</code>
    </div>
  </div>
</template>

<style scoped lang="scss">
.style-options-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  border-radius: var(--vp-radius-xs);
  background: var(--vp-c-bg-soft);
  overflow: hidden;

  html.dark & {
    background: var(--vp-c-bg);
  }

  &-avatar-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 16px 12px 12px;
    min-height: 96px;
  }

  &-img {
    width: 80px;
    height: 80px;
    border-radius: 3px;
    background: repeating-conic-gradient(
        var(--ui-avatar-bg-1, rgba(0, 0, 0, 0.02)) 0% 25%,
        var(--ui-avatar-bg-2, rgba(0, 0, 0, 0.07)) 0% 50%
      )
      50% / 12px 12px;
    overflow: hidden;
    user-select: none;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      margin: 0;
    }
  }

  &-avatar {
    user-select: none;
  }

  &-label {
    display: block;
    text-align: center;
    padding: 6px 4px;
    font-size: 11px;
    font-weight: 500;
    line-height: 1;
    color: var(--vp-c-text-2);
    cursor: pointer;
    background: none;
  }

  &-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px;
    padding: 0 6px;
  }

  &-tag {
    font-size: 10px;
    line-height: 1.4;
    padding: 1px 6px;
    border-radius: 99px;
    background: var(--vp-code-bg);
    color: var(--vp-c-text-2);
  }

  // Bottom breathing room lives on the last element so it adapts to whether
  // tags are present.
  &-label:last-child,
  &-tags {
    padding-bottom: 10px;
  }
}
</style>
