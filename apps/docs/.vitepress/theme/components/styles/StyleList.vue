<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { useStyleFiltering } from '@theme/composables/useStyleFiltering';
import { useStyleRankings } from '@theme/composables/useStyleRankings';
import { formatGrowth, trendSortValue } from '@theme/utils/statsTrends';
import {
  Search,
  CircleUser,
  Scale,
  ArrowRight,
  ArrowUpDown,
  ChartNoAxesColumn,
  Filter,
  Play,
  TrendingUp,
} from '@lucide/vue';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import ToggleSwitch from 'primevue/toggleswitch';
import { UiAvatar, UiCard } from '../ui';

const { theme } = useData<ThemeOptions>();

const {
  searchQuery,
  selectedLicenses,
  selectedCategories,
  animatedOnly,
  availableLicenses,
  availableCategories,
  styleList,
  groupedStyles,
  totalStyles,
} = useStyleFiltering(theme.value.avatarStyles);

const { rankingByName } = useStyleRankings();

type SortMode = 'category' | 'popular' | 'trending';

const sortBy = ref<SortMode>('category');

const sortOptions: { label: string; value: SortMode }[] = [
  { label: 'Category', value: 'category' },
  { label: 'Most used', value: 'popular' },
  { label: 'Trending', value: 'trending' },
];

function usageRank(slug: string): number {
  return rankingByName.value?.[slug]?.rank ?? Number.MAX_SAFE_INTEGER;
}

function trendScore(slug: string): number {
  const row = rankingByName.value?.[slug];

  return row ? trendSortValue(row) : Number.NEGATIVE_INFINITY;
}

// Category view keeps the grouped sections; the usage-based sorts flatten
// the list into one ranked grid. Until the stats have loaded, both fall
// back to the alphabetical order the list already has.
const displayGroups = computed<
  { title: string | null; styles: typeof styleList.value }[]
>(() => {
  if (sortBy.value === 'category') {
    return Object.entries(groupedStyles.value).map(([title, styles]) => ({
      title,
      styles,
    }));
  }

  const list = [...styleList.value];

  if (sortBy.value === 'popular') {
    list.sort(
      (a, b) =>
        usageRank(a.slug) - usageRank(b.slug) ||
        a.displayName.localeCompare(b.displayName),
    );
  } else {
    list.sort((a, b) => {
      const diff = trendScore(b.slug) - trendScore(a.slug);

      if (Number.isNaN(diff) || diff === 0) {
        return usageRank(a.slug) - usageRank(b.slug);
      }

      return diff;
    });
  }

  return [{ title: null, styles: list }];
});
</script>

<template>
  <div class="style-list">
    <UiCard class="style-list-filters">
      <div class="style-list-filter-row">
        <div class="style-list-filter-group">
          <span class="style-list-filter-label">
            <Search />
            Search
          </span>
          <InputText
            v-model="searchQuery"
            :placeholder="`Search ${totalStyles} styles...`"
            fluid
          />
        </div>

        <div class="style-list-filter-group">
          <span class="style-list-filter-label">
            <Filter />
            Category
          </span>
          <MultiSelect
            v-model="selectedCategories"
            :options="availableCategories"
            placeholder="Filter by category"
            :showToggleAll="false"
            fluid
          />
        </div>

        <div class="style-list-filter-group">
          <span class="style-list-filter-label">
            <Scale />
            License
          </span>
          <MultiSelect
            v-model="selectedLicenses"
            :options="availableLicenses"
            placeholder="Filter by license"
            :showToggleAll="false"
            fluid
          />
        </div>

        <div class="style-list-filter-group">
          <span class="style-list-filter-label">
            <ArrowUpDown />
            Sort
          </span>
          <Select
            v-model="sortBy"
            :options="sortOptions"
            optionLabel="label"
            optionValue="value"
            fluid
          />
        </div>

        <div class="style-list-filter-group">
          <span class="style-list-filter-label">
            <Play />
            Animation
          </span>
          <label class="style-list-filter-toggle">
            <ToggleSwitch v-model="animatedOnly" />
            <span>Animated only</span>
          </label>
        </div>
      </div>
    </UiCard>

    <div
      v-for="group in displayGroups"
      :key="group.title ?? 'ranked'"
      class="style-list-category"
    >
      <h2 v-if="group.title" class="style-list-category-title">
        {{ group.title }}
      </h2>
      <div class="style-list-grid">
        <UiCard
          v-for="style in group.styles"
          :key="style.name"
          :href="`/styles/${style.slug}/`"
          class="style-list-card"
        >
          <div class="style-list-card-avatars">
            <div
              v-for="avatar in style.avatars"
              :key="avatar.seed"
              class="style-list-card-avatar"
            >
              <UiAvatar
                :style-name="style.slug"
                :style-options="{ seed: avatar.seed, size: 80 }"
                :alt="`${style.displayName} - ${avatar.seed}`"
              />
            </div>
          </div>

          <div class="style-list-card-content">
            <h3 class="style-list-card-name">{{ style.displayName }}</h3>

            <div class="style-list-card-meta">
              <span class="style-list-card-creator">
                <CircleUser />
                {{ style.creator }}
              </span>
              <span class="style-list-card-license">
                <Scale />
                {{ style.license }}
              </span>
              <span v-if="style.animated" class="style-list-card-tag">
                <Play />
                Animated
              </span>
              <span
                v-if="sortBy === 'popular' && rankingByName?.[style.slug]"
                class="style-list-card-tag"
              >
                <ChartNoAxesColumn />
                #{{ rankingByName[style.slug].rank }}
              </span>
              <span
                v-else-if="sortBy === 'trending' && rankingByName?.[style.slug]"
                class="style-list-card-tag"
              >
                <TrendingUp />
                {{
                  rankingByName[style.slug].isNew
                    ? 'New'
                    : formatGrowth(rankingByName[style.slug].growth)
                }}
              </span>
            </div>
          </div>

          <div class="style-list-card-arrow">
            <ArrowRight />
          </div>
        </UiCard>
      </div>
    </div>

    <div v-if="styleList.length === 0" class="style-list-empty">
      <p v-if="searchQuery">No styles found matching "{{ searchQuery }}"</p>
      <p v-else>No styles found with the selected filters</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.style-list {
  margin-top: 32px;

  &-filters {
    margin-bottom: 32px;
  }

  &-filter-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr auto;
    gap: 16px;
    align-items: flex-start;
  }

  &-filter-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 40px;
    font-size: 14px;
    color: var(--vp-c-text-1);
    cursor: pointer;
    white-space: nowrap;
  }

  &-filter-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }

  &-filter-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &-category {
    margin-bottom: 48px;

    &-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: var(--vp-c-text-1);
      margin: 0 0 20px;
      border-top: 0 !important;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--vp-c-border);
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }

  &-card {
    height: 100%;
    position: relative;

    &-avatars {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
    }

    &-avatar {
      width: 64px;
      height: 64px;
      border-radius: var(--vp-radius-sm);
      overflow: hidden;
      background: var(--vp-c-bg);
      box-shadow: var(--vp-shadow-1);
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-content {
      flex: 1;
    }

    &-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--vp-c-text-1);
      margin: 0 0 8px;
    }

    &-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    &-creator,
    &-license {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--vp-c-text-2);

      svg {
        width: 16px;
        height: 16px;
        color: var(--vp-c-text-3);
      }
    }

    &-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--vp-c-brand-1);
      background: var(--vp-c-brand-soft);
      border-radius: 999px;
      padding: 2px 10px;

      svg {
        width: 12px;
        height: 12px;
      }
    }

    &-arrow {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--vp-c-bg);
      border-radius: var(--vp-radius-xs);
      opacity: 0;
      transform: translateX(-8px);
      transition: all var(--duration-fast) ease;

      svg {
        width: 18px;
        height: 18px;
        color: var(--vp-c-brand-1);
      }
    }

    &:hover &-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &-empty {
    text-align: center;
    padding: 60px 24px;
    color: var(--vp-c-text-2);

    p {
      margin: 0;
      font-size: 16px;
    }
  }

  @media (max-width: 640px) {
    &-filter-row {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    &-category-title {
      font-size: 20px;
    }

    &-grid {
      grid-template-columns: 1fr;
    }

    &-card-arrow {
      display: none;
    }
  }
}
</style>
