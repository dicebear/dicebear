<script setup lang="ts" generic="S extends string">
/**
 * The filters of the styles overview: one category, any number of licenses,
 * the animated switch and the sort. Every option shows how many styles it
 * would list with the other filters as they are. The sidebar and the phone
 * sheet each render their own copy on the same state.
 */
import { useId } from 'vue';
import SiteCheckbox from './SiteCheckbox.vue';
import SiteSelect from './SiteSelect.vue';

export interface SiteStylesFacet {
  value: string;
  label: string;
  count: number;
}

defineProps<{
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
        class="site-styles-filters-option is-radio"
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
      <SiteSelect v-model="sort" :options="sortOptions" label="Sort by" fluid />
      <p v-if="sortHint" class="site-styles-filters-hint">{{ sortHint }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-styles-filters {
  display: flex;
  flex-direction: column;
  gap: 28px;

  &-group {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  &-label {
    display: block;
    padding: 0 0 8px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--db-muted);
  }

  &-option {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 36px;
    padding: 0 10px;
    border-radius: var(--db-radius-2);
    font-size: 15px;
    color: var(--db-ink);
    cursor: pointer;

    & + & {
      margin-top: 2px;
    }

    &:not(.is-active):hover {
      background: var(--db-soft);
    }

    &.is-radio:has(:focus-visible) {
      outline: 2px solid var(--db-brand);
      outline-offset: -2px;
    }

    &.is-active {
      background: var(--db-tint);
      color: var(--db-tint-text);
      font-weight: 600;
    }

    &.is-empty {
      color: var(--db-muted);
    }
  }

  &-count {
    margin-left: auto;
    font-size: 14px;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
    color: var(--db-muted);

    .is-active & {
      color: inherit;
    }
  }

  &-sort {
    display: flex;
    flex-direction: column;

    .site-styles-filters-label {
      padding-bottom: 8px;
    }
  }

  &-hint {
    margin: 8px 0 0;
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);
  }
}
</style>
