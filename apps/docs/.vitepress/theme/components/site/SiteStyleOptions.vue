<script setup lang="ts">
/**
 * Every option of a style, grouped the way the descriptor sees them: the
 * general options, one group per component, one per color, and the
 * animation switches. Each row carries the type, the description, the range
 * and the default, and opens its examples in place.
 *
 * The rows reuse the preview and code panels of the option cards, which
 * read the loaded style through the injection keys provided here.
 */
import { computed, nextTick, provide, ref, toRef, watch } from 'vue';
import { inBrowser } from 'vitepress';
import { capitalCase } from 'change-case';
import { watchDebounced, watchOnce } from '@vueuse/core';
import { styleUsesVariable } from '@theme/utils/avatar/style';
import { isAnimationOption } from '@theme/utils/styleOptionMeta';
import { styleLabel, track } from '@theme/utils/track';
import { useStyleOptions } from '@theme/composables/useStyleOptions';
import {
  componentNamesKey,
  componentPreviewKey,
  showVariantTagsKey,
  styleColorsKey,
  styleDefaultsKey,
  variantTagsKey,
} from '../styles/styleOptionsKeys';
import type { OptionValue } from '../styles/styleOptionsKeys';
import SiteStyleOptionGroup from './SiteStyleOptionGroup.vue';
import SiteSearch from './SiteSearch.vue';
import SiteSwitch from './SiteSwitch.vue';

type RangeLike = { min: number; max: number } | undefined;

function rangeDefault(
  range: RangeLike,
  fallback: number,
): number | [number, number] {
  if (!range) {
    return fallback;
  }
  return range.min === range.max ? range.min : [range.min, range.max];
}

export interface OptionGroup {
  id: string;
  label: string;
  category: 'general' | 'component' | 'color' | 'animation';
  options: Record<string, OptionValue>;
}

const props = defineProps<{
  styleName: string;
}>();

const searchQuery = ref('');

let searchTracked = false;
watchDebounced(
  searchQuery,
  (query) => {
    if (!query.trim()) {
      searchTracked = false;
      return;
    }
    if (!searchTracked) {
      searchTracked = true;
      track('Docs Options: Search', { style: styleLabel(props.styleName) });
    }
  },
  { debounce: 700 },
);

const {
  loadedStyle,
  descriptor,
  componentNames,
  colorNames,
  animationNames,
  styleColors,
  preview,
} = useStyleOptions(toRef(() => props.styleName));

provide(componentNamesKey, componentNames);
provide(componentPreviewKey, preview);
provide(styleColorsKey, styleColors);
provide(variantTagsKey, (component: string, variant: string): string[] => {
  const found = loadedStyle.value
    ?.components()
    .get(component)
    ?.variants()
    .get(variant);
  return found ? [...found.tags()] : [];
});

const hasTags = computed(() => 'tags' in descriptor.value);
const showVariantTags = ref(false);
provide(showVariantTagsKey, showVariantTags);

const styleDefaults = computed<Record<string, unknown>>(() => {
  if (!loadedStyle.value) {
    return {};
  }
  const result: Record<string, unknown> = {
    flip: 'none',
    fontFamily: 'system-ui',
    fontWeight: 400,
    scale: 1,
    borderRadius: 0,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    idRandomization: false,
  };
  for (const [name, component] of loadedStyle.value.components()) {
    const variantDefaults: Record<string, number> = {};
    for (const [v, variant] of component.variants()) {
      variantDefaults[v] = variant.weight();
    }
    result[`${name}Variant`] = variantDefaults;
    result[`${name}Probability`] = component.probability();
    result[`${name}Rotate`] = rangeDefault(component.rotate(), 0);
    result[`${name}TranslateX`] = rangeDefault(component.translate().x(), 0);
    result[`${name}TranslateY`] = rangeDefault(component.translate().y(), 0);
    result[`${name}Scale`] = rangeDefault(component.scale(), 1);
  }
  for (const [name, values] of Object.entries(styleColors.value)) {
    result[`${name}Color`] = values;
    result[`${name}ColorFill`] = 'solid';
    result[`${name}ColorFillStops`] = 2;
    result[`${name}ColorAngle`] = 0;
    result[`${name}ColorOrder`] = 'random';
  }
  return result;
});
provide(styleDefaultsKey, styleDefaults);

function isComponentOption(key: string, names: string[]): boolean {
  return names.some(
    (name) =>
      key === `${name}Variant` ||
      key === `${name}Probability` ||
      key === `${name}Rotate` ||
      key === `${name}TranslateX` ||
      key === `${name}TranslateY` ||
      key === `${name}Scale`,
  );
}

function isColorOption(key: string, names: string[]): boolean {
  return names.some(
    (name) =>
      key === `${name}Color` ||
      key === `${name}ColorFill` ||
      key === `${name}ColorFillStops` ||
      key === `${name}ColorAngle` ||
      key === `${name}ColorOrder`,
  );
}

const globalAnimationKeys = ['animation', 'animationSpeed', 'animationDelay'];

function namedAnimationKeys(name: string): string[] {
  return [`${name}Animation`, `${name}AnimationSpeed`, `${name}AnimationDelay`];
}

function pick(
  source: Record<string, OptionValue>,
  keys: string[],
): Record<string, OptionValue> {
  const result: Record<string, OptionValue> = {};
  for (const key of keys) {
    if (key in source) {
      result[key] = source[key];
    }
  }
  return result;
}

const groups = computed<OptionGroup[]>(() => {
  if (!loadedStyle.value) {
    return [];
  }
  const all = descriptor.value as Record<string, OptionValue>;
  const result: OptionGroup[] = [];
  const hidden = new Set<string>();
  if (!styleUsesVariable(props.styleName, 'fontFamily')) {
    hidden.add('fontFamily');
  }
  if (!styleUsesVariable(props.styleName, 'fontWeight')) {
    hidden.add('fontWeight');
  }
  const generalKeys = Object.keys(all).filter(
    (key) =>
      !hidden.has(key) &&
      !isComponentOption(key, componentNames.value) &&
      !isColorOption(key, [...colorNames.value, 'background']) &&
      !isAnimationOption(key),
  );
  if (generalKeys.length > 0) {
    result.push({
      id: 'general',
      label: 'General',
      category: 'general',
      options: pick(all, generalKeys),
    });
  }
  for (const name of componentNames.value) {
    const keys = Object.keys(all).filter((k) => isComponentOption(k, [name]));
    if (keys.length > 0) {
      result.push({
        id: `component-${name}`,
        label: capitalCase(name),
        category: 'component',
        options: pick(all, keys),
      });
    }
  }
  // Every style takes a background color, whether or not its definition
  // names one, so the group exists on every page and comes first.
  const colorGroupNames = colorNames.value.includes('background')
    ? colorNames.value
    : ['background', ...colorNames.value];
  for (const name of colorGroupNames) {
    const keys = Object.keys(all).filter((k) => isColorOption(k, [name]));
    if (keys.length > 0) {
      result.push({
        id: `color-${name}`,
        label: `${capitalCase(name)} Color`,
        category: 'color',
        options: pick(all, keys),
      });
    }
  }
  const animationKeys = globalAnimationKeys.filter((key) => key in all);
  if (animationKeys.length > 0) {
    result.push({
      id: 'animation',
      label: 'All Animations',
      category: 'animation',
      options: pick(all, animationKeys),
    });
  }
  for (const name of animationNames.value) {
    const keys = namedAnimationKeys(name).filter((key) => key in all);
    if (keys.length > 0) {
      result.push({
        id: `animation-${name}`,
        label: `${capitalCase(name)} Animation`,
        category: 'animation',
        options: pick(all, keys),
      });
    }
  }
  return result;
});

const optionCount = computed(() =>
  groups.value.reduce((n, group) => n + Object.keys(group.options).length, 0),
);

const filteredGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return groups.value;
  }
  return groups.value
    .map((group) => ({
      ...group,
      options: Object.fromEntries(
        Object.entries(group.options).filter(([key]) =>
          key.toLowerCase().includes(query),
        ),
      ),
    }))
    .filter((group) => Object.keys(group.options).length > 0);
});

// The rows render after the async style load, so the browser's own hash
// scroll runs before the anchors exist. Redo it once they are in.
watchOnce(loadedStyle, async (style) => {
  if (!inBrowser || !style) {
    return;
  }
  const hash = window.location.hash;
  if (!hash.startsWith('#options-')) {
    return;
  }
  await nextTick();
  let id: string;
  try {
    id = decodeURIComponent(hash).slice(1);
  } catch {
    return;
  }
  document
    .getElementById(id)
    ?.scrollIntoView({ block: 'start', behavior: 'instant' });
});

watch(
  () => props.styleName,
  () => {
    searchQuery.value = '';
  },
);
</script>

<template>
  <div v-if="loadedStyle" class="site-style-options">
    <div class="site-style-options-controls">
      <SiteSearch
        v-model="searchQuery"
        placeholder="Filter options"
        label="Filter options"
      />
      <label v-if="hasTags" class="site-style-options-toggle">
        <SiteSwitch v-model="showVariantTags" />
        <span>Show variant tags</span>
      </label>
      <span class="site-small site-style-options-count">
        {{ optionCount }} options in {{ groups.length }} groups. Every one works
        as a URL parameter on the HTTP API too.
      </span>
    </div>
    <p v-if="filteredGroups.length === 0" class="site-text">
      No options match "{{ searchQuery }}".
    </p>
    <SiteStyleOptionGroup
      v-for="group in filteredGroups"
      :key="group.id"
      :style-name="styleName"
      :group="group"
    />
  </div>
</template>

<style scoped lang="scss">
.site-style-options {
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-width: 0;

  &-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px 24px;
  }

  &-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-muted);
    cursor: pointer;
  }

  &-count {
    margin-left: auto;
    text-align: right;
    max-width: 420px;
  }

  @media (max-width: 767px) {
    &-controls :deep(.site-search) {
      width: 100%;
    }

    &-count {
      margin-left: 0;
      text-align: left;
    }
  }
}
</style>
