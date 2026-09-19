<script setup lang="ts">
import { isAnimationOption } from '@theme/utils/styleOptionMeta';
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

  if (n.endsWith('ColorOrder')) {
    return {
      type: 'colorOrder' as const,
      color: n.slice(0, -'ColorOrder'.length),
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
    } else if (t.type === 'colorOrder') {
      // Three palette colors through a linear gradient make the order
      // visible: `random` shuffles them per seed, `fixed` keeps the list
      // order and takes all three as stops. It is a single value, because the
      // schema rejects the array form for this option.
      opts[colorKey] = padColors(
        resolveColors(t.color, styleColors.value),
        3,
      ).slice(0, 3);
      opts[fillKey] = ['linear'];
      opts[`${t.color}ColorOrder`] = props.value;
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

// The HTTP API can only render options its deployed core already knows, so
// the *ColorOrder and the animation previews go through the local library
// until the API ships a core with the options.
const previewMode = computed(() =>
  previewTarget.value.type === 'colorOrder' || isAnimationOption(props.name)
    ? ('library' as const)
    : ('http-api' as const),
);

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
        :mode="previewMode"
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
  gap: 6px;
  min-width: 0;
  overflow: hidden;

  &-avatar-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    min-height: 80px;
  }

  /* The checkerboard shows through where an avatar is transparent. It lies
     on the tile color, which stays light in dark mode. */
  &-img,
  & &-avatar {
    border-radius: var(--db-radius-4);
    background:
      repeating-conic-gradient(
          rgba(11, 22, 32, 0.02) 0% 25%,
          rgba(11, 22, 32, 0.07) 0% 50%
        )
        50% / 12px 12px,
      var(--db-tile);
    overflow: hidden;
    user-select: none;
  }

  &-img {
    width: 80px;
    height: 80px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      margin: 0;
    }
  }

  &-label {
    display: block;
    max-width: 100%;
    font-family: var(--db-font-mono);
    font-size: 11px;
    line-height: 14px;
    text-align: center;
    color: var(--db-muted);
    overflow-wrap: anywhere;
    cursor: pointer;
    background: none;
  }

  &-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }

  &-tag {
    padding: 1px 6px;
    border-radius: 5px;
    background: var(--db-soft);
    font-family: var(--db-font-mono);
    font-size: 10px;
    line-height: 14px;
    color: var(--db-muted);
  }
}
</style>
