<script setup lang="ts">
/**
 * The list behind the style field: a search, the categories as chips, the
 * styles used last, then every style by category. The arrow keys move
 * through the list while the search keeps the focus, Enter picks. The foot
 * holds the way to a style of one's own.
 */
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue';
import { useData } from 'vitepress';
import { storeToRefs } from 'pinia';
import { Check, Clock, Search, Trash2, Upload } from '@lucide/vue';
import { useStyleFiltering } from '@theme/composables/useStyleFiltering';
import { usePlaygroundStyles } from '@theme/composables/usePlaygroundStyles';
import { exampleSeeds } from '@theme/config/styleCategories';
import useStore from '@theme/stores/playground';
import type { ThemeOptions } from '@theme/types';
import PlaygroundThumb from './PlaygroundThumb.vue';

const emit = defineEmits<{
  pick: [name: string];
  upload: [];
}>();

const store = useStore();
const { avatarStyleName, customStyles } = storeToRefs(store);
const { theme } = useData<ThemeOptions>();
const { recent } = usePlaygroundStyles();

const {
  searchQuery,
  selectedCategories,
  allStyles,
  availableCategories: categories,
  groupedStyles,
} = useStyleFiltering(theme.value.avatarStyles, customStyles);

const id = useId();
const listId = `${id}-list`;
const input = ref<HTMLInputElement | null>(null);

type Style = (typeof allStyles.value)[number];

interface Option {
  id: string;
  name: string;
  label: string;
  license: string;
  custom: boolean;
  thumb: { seed: string };
  index: number;
}

interface Section {
  key: string;
  title: string;
  recent: boolean;
  options: Option[];
}

// Held per style, so a thumbnail keeps its options between renders.
const thumbs = new Map<string, { seed: string }>();

function thumbOf(style: Style) {
  let options = thumbs.get(style.name);

  if (!options) {
    options = { seed: style.avatars[0]?.seed ?? exampleSeeds[0] };
    thumbs.set(style.name, options);
  }

  return options;
}

const LICENSE_LABELS: Record<string, string> = { Other: "Artist's own terms" };

const counts = computed(() => {
  const result = new Map<string, number>();

  for (const style of allStyles.value) {
    result.set(style.category, (result.get(style.category) ?? 0) + 1);
  }

  return result;
});

const byName = computed(
  () => new Map(allStyles.value.map((style) => [style.name, style])),
);

// The styles used last show while nobody searches or filters.
const sections = computed<Section[]>(() => {
  const result: Section[] = [];
  let index = 0;

  const toOptions = (styles: Style[], prefix: string) =>
    styles.map((style) => ({
      id: `${id}-${prefix}-${style.name}`,
      name: style.name,
      label: style.displayName,
      license:
        LICENSE_LABELS[style.licenseNormalized] ?? style.licenseNormalized,
      custom: style.isCustom,
      thumb: thumbOf(style),
      index: index++,
    }));

  if (!searchQuery.value.trim() && selectedCategories.value.length === 0) {
    const used = recent.value
      .map((name) => byName.value.get(name))
      .filter((style): style is Style => !!style);

    if (used.length > 0) {
      result.push({
        key: 'recent',
        title: 'Recent',
        recent: true,
        options: toOptions(used, 'recent'),
      });
    }
  }

  for (const [category, styles] of Object.entries(groupedStyles.value)) {
    result.push({
      key: category,
      title: category,
      recent: false,
      options: toOptions(styles, 'all'),
    });
  }

  return result;
});

const flat = computed(() => sections.value.flatMap((s) => s.options));
const active = ref(0);
const activeId = computed(() => flat.value[active.value]?.id);

function reveal() {
  void nextTick(() => {
    const el = activeId.value ? document.getElementById(activeId.value) : null;

    el?.scrollIntoView({ block: 'nearest' });
  });
}

function move(step: number) {
  const count = flat.value.length;

  if (count === 0) return;

  active.value = (active.value + step + count) % count;
  reveal();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    move(1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    move(-1);
  } else if (event.key === 'Enter') {
    const option = flat.value[active.value];

    if (option) {
      event.preventDefault();
      emit('pick', option.name);
    }
  }
}

// A new search or filter starts at the first match.
watch([searchQuery, selectedCategories], () => {
  active.value = 0;
  reveal();
});

function toggleCategory(category: string | undefined) {
  selectedCategories.value =
    !category || selectedCategories.value[0] === category ? [] : [category];
}

function remove(name: string) {
  store.removeCustomStyle(name);
}

// The list opens on the current style.
onMounted(() => {
  const current = flat.value.findIndex((o) => o.name === avatarStyleName.value);

  active.value = Math.max(0, current);
  reveal();
});

// The popover shows its content only after it rendered, so the one who
// opens it hands the focus over once it is visible.
function focus() {
  input.value?.focus({ preventScroll: true });
  reveal();
}

defineExpose({ focus });
</script>

<template>
  <div class="pg-picker">
    <div class="pg-picker-head">
      <label class="pg-picker-search">
        <Search :size="16" aria-hidden="true" />
        <input
          ref="input"
          v-model="searchQuery"
          type="text"
          role="combobox"
          aria-label="Search styles"
          aria-autocomplete="list"
          aria-expanded="true"
          :aria-controls="listId"
          :aria-activedescendant="activeId"
          :placeholder="`Search ${allStyles.length} styles`"
          autocomplete="off"
          spellcheck="false"
          @keydown="onKeydown"
        />
      </label>
      <div class="pg-picker-chips" role="group" aria-label="Category">
        <button
          type="button"
          class="site-chip"
          :aria-pressed="selectedCategories.length === 0"
          @click="toggleCategory(undefined)"
        >
          All
        </button>
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="site-chip"
          :aria-pressed="selectedCategories[0] === category"
          @click="toggleCategory(category)"
        >
          {{ category }}
          <span class="pg-picker-count">{{ counts.get(category) }}</span>
        </button>
      </div>
    </div>

    <!-- The pointer picks without taking the focus from the search. -->
    <div
      :id="listId"
      role="listbox"
      aria-label="Avatar styles"
      class="pg-picker-list"
      @mousedown.prevent
    >
      <div
        v-for="section in sections"
        :key="section.key"
        role="group"
        :aria-labelledby="`${id}-${section.key}`"
        class="pg-picker-group"
      >
        <span :id="`${id}-${section.key}`" class="site-label pg-picker-title">
          <Clock v-if="section.recent" :size="14" aria-hidden="true" />
          {{ section.title }}
        </span>
        <div
          v-for="option in section.options"
          :id="option.id"
          :key="option.id"
          role="option"
          class="pg-picker-option"
          :class="{ 'is-active': option.index === active }"
          :aria-selected="option.name === avatarStyleName"
          @pointermove="active = option.index"
          @click="emit('pick', option.name)"
        >
          <span class="pg-picker-thumb">
            <PlaygroundThumb
              :style-name="option.name"
              :options="option.thumb"
              :mode="option.custom ? 'library' : 'http-api'"
              surface="tile"
            />
          </span>
          <span class="pg-picker-name">{{ option.label }}</span>
          <Check
            v-if="option.name === avatarStyleName"
            :size="16"
            aria-hidden="true"
            class="pg-picker-check"
          />
          <button
            v-else-if="option.custom"
            type="button"
            tabindex="-1"
            class="site-btn site-btn-ghost site-btn-icon site-btn-sm pg-picker-remove"
            :aria-label="`Remove ${option.label}`"
            data-tip="Remove"
            @click.stop="remove(option.name)"
          >
            <Trash2 :size="16" aria-hidden="true" />
          </button>
          <span v-else class="pg-picker-license">{{ option.license }}</span>
        </div>
      </div>

      <p v-if="flat.length === 0" class="pg-picker-empty">
        No style matches "{{ searchQuery }}".
      </p>
    </div>

    <div class="pg-picker-foot">
      <button
        type="button"
        class="site-btn site-btn-ghost site-btn-sm"
        @click="emit('upload')"
      >
        <Upload :size="16" aria-hidden="true" />
        Upload a style
      </button>
      <span class="pg-picker-hint">or drop the file anywhere</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/control' as c;

.pg-picker {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;

  &-head {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 12px 10px;
    border-bottom: 1px solid var(--db-line);
  }

  &-search {
    @include c.control;
    @include c.control-size(md);

    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px;
    color: var(--db-muted);
    cursor: text;

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      padding: 0;
      border: 0;
      outline: none;
      background: transparent;
      font: inherit;
      font-size: 15px;
      color: var(--db-ink);

      &::placeholder {
        color: var(--db-muted);
      }
    }
  }

  &-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &-count {
    font-weight: 400;
    color: var(--db-muted);

    .site-chip[aria-pressed='true'] & {
      color: inherit;
      opacity: 0.8;
    }
  }

  &-list {
    flex: 1;
    min-height: 0;
    padding: 0 8px 8px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  &-title {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 14px 6px 6px;
  }

  &-option {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    padding: 0 8px 0 6px;
    border-radius: var(--db-radius-2);
    color: var(--db-ink);
    cursor: pointer;

    &.is-active {
      background: var(--db-soft);
    }

    &[aria-selected='true'] {
      background: var(--db-tint);
      color: var(--db-tint-text);

      .pg-picker-name {
        font-weight: 600;
      }
    }
  }

  &-thumb {
    flex-shrink: 0;
    width: 32px;
    height: 32px;

    :deep(.pg-thumb) {
      width: 100%;
      height: 100%;
      border-radius: var(--db-radius-2);
    }
  }

  &-name {
    flex: 1;
    min-width: 0;
    font-size: 15px;
    line-height: 20px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-license {
    flex-shrink: 0;
    font-size: 12px;
    line-height: 16px;
    color: var(--db-muted);
    white-space: nowrap;
  }

  &-check {
    flex-shrink: 0;
    margin-right: 2px;
    color: var(--db-brand);
  }

  &-empty {
    margin: 0;
    padding: 32px 6px 24px;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-muted);
    text-align: center;
  }

  &-foot {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-top: 1px solid var(--db-line);
  }

  &-hint {
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);

    // Nothing to drop from on a touch screen.
    @media (hover: none) {
      display: none;
    }
  }
}
</style>
