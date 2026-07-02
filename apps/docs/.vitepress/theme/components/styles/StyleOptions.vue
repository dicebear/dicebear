<script setup lang="ts">
import { computed, nextTick, provide, ref, toRef } from 'vue';
import { inBrowser } from 'vitepress';
import { styleUsesVariable } from '@theme/utils/avatar/style';
import { watchOnce, watchDebounced } from '@vueuse/core';
import { track } from '@theme/utils/track';
import { capitalCase } from 'change-case';
import { Search } from '@lucide/vue';
import InputText from 'primevue/inputtext';
import ToggleSwitch from 'primevue/toggleswitch';
import StyleOptionsGroup from './StyleOptionsGroup.vue';
import { useStyleOptions } from '@theme/composables/useStyleOptions';
import {
  componentNamesKey,
  styleColorsKey,
  componentPreviewKey,
  styleDefaultsKey,
  variantTagsKey,
  showVariantTagsKey,
} from './styleOptionsKeys';

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

interface OptionGroup {
  id: string;
  label: string;
  category: 'general' | 'component' | 'color';
  options: Record<string, any>;
}

const props = defineProps<{
  styleName: string;
}>();

const searchQuery = ref('');

// Track that a user used the option filter, once per non-empty session, so a
// multi-character query counts as a single "searched" interaction, not one per
// keystroke.
let searchTracked = false;

watchDebounced(
  searchQuery,
  (query) => {
    const trimmed = query.trim();

    if (!trimmed) {
      searchTracked = false;
      return;
    }

    if (!searchTracked) {
      searchTracked = true;
      track('Docs Options: Search', { style: props.styleName });
    }
  },
  { debounce: 700 },
);

const {
  loadedStyle,
  descriptor,
  componentNames,
  colorNames,
  styleColors,
  preview,
} = useStyleOptions(toRef(() => props.styleName));

provide(componentNamesKey, componentNames);
provide(componentPreviewKey, preview);
provide(styleColorsKey, styleColors);

// Per-variant tags, read live from the loaded style for the variant previews.
provide(variantTagsKey, (component: string, variant: string): string[] => {
  const found = loadedStyle.value
    ?.components()
    .get(component)
    ?.variants()
    .get(variant);

  return found ? [...found.tags()] : [];
});

// Opt-in reveal of the per-variant tags under each preview (off by default to
// keep the reference view quiet). Only offered for styles that carry tags.
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
      key === `${name}ColorAngle`,
  );
}

function pick(
  source: Record<string, any>,
  keys: string[],
): Record<string, any> {
  const result: Record<string, any> = {};

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

  const result: OptionGroup[] = [];
  const hiddenKeys = new Set<string>();

  if (!styleUsesVariable(props.styleName, 'fontFamily')) {
    hiddenKeys.add('fontFamily');
  }

  if (!styleUsesVariable(props.styleName, 'fontWeight')) {
    hiddenKeys.add('fontWeight');
  }

  const generalKeys = Object.keys(descriptor.value).filter(
    (key) =>
      !hiddenKeys.has(key) &&
      !isComponentOption(key, componentNames.value) &&
      !isColorOption(key, colorNames.value),
  );

  if (generalKeys.length > 0) {
    result.push({
      id: 'general',
      label: 'General',
      category: 'general',
      options: pick(descriptor.value, generalKeys),
    });
  }

  for (const name of componentNames.value) {
    const keys = Object.keys(descriptor.value).filter((k) =>
      isComponentOption(k, [name]),
    );

    if (keys.length > 0) {
      result.push({
        id: `component-${name}`,
        label: capitalCase(name),
        category: 'component',
        options: pick(descriptor.value, keys),
      });
    }
  }

  for (const name of colorNames.value) {
    const keys = Object.keys(descriptor.value).filter((k) =>
      isColorOption(k, [name]),
    );

    if (keys.length > 0) {
      result.push({
        id: `color-${name}`,
        label: `${capitalCase(name)} Color`,
        category: 'color',
        options: pick(descriptor.value, keys),
      });
    }
  }

  return result;
});

const showSearch = computed(() => Object.keys(descriptor.value).length > 15);

const filteredGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return groups.value;
  }

  return groups.value
    .map((group) => {
      const filtered = Object.fromEntries(
        Object.entries(group.options).filter(([key]) =>
          key.toLowerCase().includes(query),
        ),
      );

      return { ...group, options: filtered };
    })
    .filter((group) => Object.keys(group.options).length > 0);
});

// Option cards render asynchronously, so the browser's initial hash-scroll
// runs before the target anchors exist. Re-do the scroll once they're in.
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

  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  // VitePress 2 removed `getScrollOffset()` and now clears the sticky header
  // in CSS instead. The option titles are `<h3>`s inside `.vp-doc`, so its own
  // `.vp-doc h1…h6` rule already gives them the right `scroll-margin-top`.
  // Instant, because this is a correction after the options finished loading,
  // not a navigation.
  target.scrollIntoView({ block: 'start', behavior: 'instant' });
});
</script>

<template>
  <div class="style-options" v-if="loadedStyle">
    <div class="style-options-controls" v-if="showSearch || hasTags">
      <div class="style-options-search" v-if="showSearch">
        <div class="style-options-search-wrapper">
          <Search :size="16" class="style-options-search-icon" />
          <InputText
            v-model="searchQuery"
            placeholder="Filter options..."
            class="style-options-search-input"
          />
        </div>
      </div>

      <label class="style-options-toggle" v-if="hasTags">
        <ToggleSwitch v-model="showVariantTags" />
        <span>Show variant tags</span>
      </label>
    </div>

    <div class="style-options-groups">
      <StyleOptionsGroup
        v-for="group in filteredGroups"
        :key="group.id"
        :style-name="styleName"
        :label="group.label"
        :category="group.category"
        :options="group.options"
      />
    </div>

    <p
      class="style-options-empty"
      v-if="filteredGroups.length === 0 && searchQuery"
    >
      No options match "{{ searchQuery }}".
    </p>
  </div>
</template>

<style scoped lang="scss">
.style-options {
  &-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
  }

  &-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--vp-c-text-2);
    cursor: pointer;
    white-space: nowrap;
  }

  &-search {
    flex: 1 1 240px;
    min-width: 0;

    &-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    &-icon {
      position: absolute;
      left: 14px;
      color: var(--vp-c-text-3);
      pointer-events: none;
    }

    &-input {
      width: 100%;
      padding-left: 40px !important;
      border-radius: var(--vp-radius-xs) !important;
      font-size: 14px !important;
    }
  }

  &-groups {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &-empty {
    text-align: center;
    color: var(--vp-c-text-3);
    font-size: 14px;
    padding: 32px 0;
  }
}
</style>
