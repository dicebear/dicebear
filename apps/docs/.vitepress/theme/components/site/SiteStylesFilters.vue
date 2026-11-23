<script setup lang="ts" generic="S extends string">
/**
 * The filters of the styles overview: one category, any number of licenses,
 * the animated switch and the sort. Every option shows how many styles it
 * would list with the other filters as they are. The sidebar and the phone
 * sheet each render their own copy on the same state.
 */
import { computed, useId } from 'vue';
import { ChevronDown } from '@lucide/vue';
import SiteCheckbox from './SiteCheckbox.vue';
import SiteMenu, { type SiteMenuItem } from './SiteMenu.vue';

export interface SiteStylesFacet {
  value: string;
  label: string;
  count: number;
}

const props = defineProps<{
  categoryOptions: SiteStylesFacet[];
  licenseOptions: SiteStylesFacet[];
  animatedCount: number;
  sortOptions: { label: string; value: S }[];
  /** A line under the sort on what the order is based on. */
  sortHint?: string;
}>();

const category = defineModel<string>('category', { required: true });
const selectedLicenses = defineModel<string[]>('licenses', { required: true });
const animated = defineModel<boolean>('animated', { required: true });
const sort = defineModel<S>('sort', { required: true });

// Both copies are in the page at once, and radios sharing a name would form
// one group across them.
const name = useId();

const sortLabel = computed(
  () => props.sortOptions.find((option) => option.value === sort.value)?.label,
);

const sortItems = computed<SiteMenuItem[]>(() =>
  props.sortOptions.map((option) => ({
    label: option.label,
    checked: option.value === sort.value,
    command: () => {
      sort.value = option.value;
    },
  })),
);

function toggleLicense(value: string, on: boolean) {
  selectedLicenses.value = on
    ? [...selectedLicenses.value, value]
    : selectedLicenses.value.filter((v) => v !== value);
}
</script>

<template>
  <div class="site-styles-filters">
    <fieldset class="site-styles-filters-group">
      <legend class="site-styles-filters-label">Category</legend>
      <label
        v-for="option in categoryOptions"
        :key="option.value"
        class="site-pill site-pill-row site-styles-filters-radio"
        :class="{
          'is-active': category === option.value,
          'is-empty': option.count === 0,
        }"
      >
        <input
          v-model="category"
          type="radio"
          class="sr-only"
          :name="name"
          :value="option.value"
        />
        {{ option.label }}
        <span class="site-styles-filters-count">{{ option.count }}</span>
      </label>
    </fieldset>

    <fieldset class="site-styles-filters-group">
      <legend class="site-styles-filters-label">License</legend>
      <label
        v-for="option in licenseOptions"
        :key="option.value"
        class="site-styles-filters-option"
        :class="{
          'is-empty':
            option.count === 0 && !selectedLicenses.includes(option.value),
        }"
      >
        <SiteCheckbox
          :model-value="selectedLicenses.includes(option.value)"
          @update:model-value="toggleLicense(option.value, $event)"
        />
        {{ option.label }}
        <span class="site-styles-filters-count">{{ option.count }}</span>
      </label>
    </fieldset>

    <fieldset class="site-styles-filters-group">
      <legend class="site-styles-filters-label">Motion</legend>
      <label
        class="site-styles-filters-option"
        :class="{ 'is-empty': animatedCount === 0 && !animated }"
      >
        <SiteCheckbox v-model="animated" />
        Animated only
        <span class="site-styles-filters-count">{{ animatedCount }}</span>
      </label>
    </fieldset>

    <div class="site-styles-filters-sort">
      <span class="site-styles-filters-label" aria-hidden="true">Sort by</span>
      <SiteMenu :items="sortItems" label="Sort by" fluid>
        <template #trigger="{ open, toggle }">
          <button
            type="button"
            class="site-styles-filters-sort-button"
            :aria-label="`Sort by ${sortLabel}`"
            :aria-expanded="open"
            aria-haspopup="menu"
            @click="toggle"
          >
            {{ sortLabel }}
            <ChevronDown :size="16" aria-hidden="true" />
          </button>
        </template>
      </SiteMenu>
      <p v-if="sortHint" class="site-styles-filters-hint">{{ sortHint }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/control' as c;

.site-styles-filters {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &-group {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  /* Group titles: the control label of the set. */
  &-label {
    display: block;
    padding: 0 0 8px;
    font-family: var(--db-font-display);
    font-size: 18px;
    line-height: 26px;
    font-weight: 700;
    color: var(--db-ink);
  }

  /* A category is a row pill: yellow while chosen. */
  &-radio {
    cursor: pointer;

    &:has(:focus-visible) {
      outline: 2px solid var(--db-focus);
      outline-offset: 2px;
    }

    & + & {
      margin-top: 2px;
    }
  }

  /* A license or the motion filter: a checkbox row. */
  &-option {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    padding: 0 16px;
    border-radius: 22px;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
    cursor: pointer;
    transition: background-color 0.12s;

    &:hover {
      background: color-mix(in srgb, var(--db-ink) 6%, transparent);
    }
  }

  .is-empty {
    color: var(--db-muted);
  }

  /* The second text color rather than the muted one: it keeps 4.5:1 on the
     ground a row takes on hover too. */
  &-count {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
    color: var(--db-ink-2);

    .is-active & {
      color: inherit;
    }
  }

  &-sort {
    display: flex;
    flex-direction: column;
  }

  &-sort-button {
    @include c.control-picker(md);

    justify-content: space-between;
    width: 100%;
    padding: 0 16px;

    svg {
      flex-shrink: 0;
      color: var(--db-muted);
    }
  }

  &-hint {
    margin: 8px 0 0;
    padding: 0 4px;
    font-size: 13px;
    line-height: 20px;
    color: var(--db-muted);
  }
}
</style>
