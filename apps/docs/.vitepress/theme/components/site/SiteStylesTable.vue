<script setup lang="ts">
/**
 * The styles overview as a table: a filter row, then one hairline list per
 * category with the category's name and a line about it on the left. The
 * usage sorts flatten the list and show the rank instead.
 *
 * A column on the right shows more of one style: the one under the pointer,
 * the first of the section before anything is hovered, and the last one
 * touched after the pointer leaves the list. It sits on the right because
 * that is where the eye goes after reading a row. Below the desktop width
 * the column moves above the list.
 */
import { computed, onMounted, ref } from 'vue';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { useStyleFiltering } from '@theme/composables/useStyleFiltering';
import { useStyleRankings } from '@theme/composables/useStyleRankings';
import {
  formatGrowth,
  growthDirection,
  trendSortValue,
} from '@theme/utils/statsTrends';
import SiteStylesRow, { type SiteStylesBadge } from './SiteStylesRow.vue';
import SiteStylesPeek from './SiteStylesPeek.vue';
import SiteSearch from './SiteSearch.vue';
import SiteSelect from './SiteSelect.vue';
import SiteSwitch from './SiteSwitch.vue';

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
  allStyles,
} = useStyleFiltering(theme.value.avatarStyles);

const { rankingByName } = useStyleRankings();

/** `/styles/?animated=true` opens the list with the animated filter on. */
onMounted(() => {
  if (new URLSearchParams(window.location.search).get('animated') === 'true') {
    animatedOnly.value = true;
  }
});

type SortMode = 'category' | 'popular' | 'trending';
const sortBy = ref<SortMode>('category');
const sortOptions: { label: string; value: SortMode }[] = [
  { label: 'Category', value: 'category' },
  { label: 'Most used', value: 'popular' },
  { label: 'Trending', value: 'trending' },
];

// One license at a time is enough for a filter row. The composable keeps a
// list because the playground reuses it with a multi-select.
const ANY_LICENSE = 'any';
const license = computed<string>({
  get: () => selectedLicenses.value[0] ?? ANY_LICENSE,
  set: (value) => {
    selectedLicenses.value = value === ANY_LICENSE ? [] : [value];
  },
});
const licenseOptions = computed(() => [
  { label: 'Any license', value: ANY_LICENSE },
  ...availableLicenses.value.map((value) => ({ label: value, value })),
]);

function toggleCategory(category: string) {
  selectedCategories.value = selectedCategories.value.includes(category)
    ? selectedCategories.value.filter((c) => c !== category)
    : [...selectedCategories.value, category];
}

const countByCategory = computed(() => {
  const counts: Record<string, number> = {};
  for (const style of allStyles.value) {
    counts[style.category] = (counts[style.category] ?? 0) + 1;
  }
  return counts;
});

const blurbs: Record<string, string> = {
  Minimalist:
    'Marks, patterns and letters. Quiet enough for tables, sidebars and comment threads.',
  Characters:
    'Faces, animals and robots, drawn by different artists in their own hand.',
  Scenes: 'Small worlds instead of faces. Each one is a complete picture.',
};

function usageRank(slug: string): number {
  return rankingByName.value?.[slug]?.rank ?? Number.MAX_SAFE_INTEGER;
}

function trendScore(slug: string): number {
  const row = rankingByName.value?.[slug];
  return row ? trendSortValue(row) : Number.NEGATIVE_INFINITY;
}

/** The trend of a style as text and tone, for the badge in the trending sort. */
function trendBadge(slug: string): SiteStylesBadge | undefined {
  const row = rankingByName.value?.[slug];
  if (!row) {
    return undefined;
  }
  if (row.isNew) {
    return { text: 'New', tone: 'new' };
  }
  return { text: formatGrowth(row.growth), tone: growthDirection(row.growth) };
}

interface Group {
  title: string;
  hint?: string;
  count: number;
  styles: typeof styleList.value;
  ranked: boolean;
}

const groups = computed<Group[]>(() => {
  if (sortBy.value === 'category') {
    return Object.entries(groupedStyles.value).map(([title, styles]) => ({
      title,
      hint: blurbs[title],
      count: styles.length,
      styles,
      ranked: false,
    }));
  }
  const list = [...styleList.value];
  if (sortBy.value === 'popular') {
    list.sort(
      (a, b) =>
        usageRank(a.slug) - usageRank(b.slug) ||
        a.displayName.localeCompare(b.displayName),
    );
    return [
      {
        title: 'Most used',
        hint: 'Ranked by the number of websites that requested the style in the last complete week.',
        count: list.length,
        styles: list,
        ranked: true,
      },
    ];
  }
  list.sort(
    (a, b) =>
      trendScore(b.slug) - trendScore(a.slug) ||
      a.displayName.localeCompare(b.displayName),
  );
  return [
    {
      title: 'Trending',
      hint: 'The past four weeks against the four before. New styles come first.',
      count: list.length,
      styles: list,
      ranked: true,
    },
  ];
});

const noResults = computed(() => styleList.value.length === 0);

const peeked = ref<Record<string, string>>({});

function peekedStyle(group: Group) {
  const slug = peeked.value[group.title];
  return group.styles.find((s) => s.slug === slug) ?? group.styles[0];
}

/** The first three card seeds of a style, for the avatars in its row. */
function rowSeeds(avatars: { seed: string }[]): string[] {
  return avatars.slice(0, 3).map((avatar) => avatar.seed);
}

function peek(group: Group, slug: string) {
  peeked.value = { ...peeked.value, [group.title]: slug };
}
</script>

<template>
  <div class="site-styles-table">
    <div class="site-container">
      <div class="site-styles-filter">
        <SiteSearch
          v-model="searchQuery"
          :placeholder="`Search ${theme.styleCount} styles`"
          label="Search styles"
        />
        <div
          class="site-styles-filter-categories"
          role="group"
          aria-label="Category"
        >
          <button
            type="button"
            class="site-styles-filter-chip hv-outline"
            :aria-pressed="selectedCategories.length === 0"
            @click="selectedCategories = []"
          >
            All
          </button>
          <button
            v-for="category in availableCategories"
            :key="category"
            type="button"
            class="site-styles-filter-chip hv-outline"
            :aria-pressed="selectedCategories.includes(category)"
            @click="toggleCategory(category)"
          >
            {{ category }}
            <span class="site-styles-filter-count">{{
              countByCategory[category]
            }}</span>
          </button>
        </div>
        <div class="site-styles-filter-controls">
          <SiteSelect
            v-model="license"
            :options="licenseOptions"
            label="License"
          />
          <SiteSelect v-model="sortBy" :options="sortOptions" label="Sort" />
          <label class="site-styles-filter-toggle">
            <SiteSwitch v-model="animatedOnly" />
            <span>Animated</span>
          </label>
        </div>
      </div>
    </div>

    <p v-if="noResults" class="site-container site-text site-styles-empty">
      No styles match these filters.
    </p>

    <section
      v-for="group in groups"
      :key="group.title"
      class="site-container site-styles-group"
      :id="group.title.toLowerCase()"
    >
      <div class="site-styles-group-head">
        <h2 class="site-h2">{{ group.title }}</h2>
        <span class="site-styles-group-count">{{ group.count }} styles</span>
        <p v-if="group.hint" class="site-text">{{ group.hint }}</p>
      </div>
      <div class="site-styles-group-body">
        <div class="site-styles-group-rows">
          <SiteStylesRow
            v-for="(style, index) in group.styles"
            :key="style.slug"
            :slug="style.slug"
            :display-name="style.displayName"
            :creator="style.creator"
            :license="style.licenseNormalized"
            :animated="style.animated"
            :seeds="rowSeeds(style.avatars)"
            :rank="group.ranked ? index + 1 : undefined"
            :badge="sortBy === 'trending' ? trendBadge(style.slug) : undefined"
            @mouseenter="peek(group, style.slug)"
          />
        </div>
        <aside class="site-styles-group-aside">
          <SiteStylesPeek
            v-if="peekedStyle(group)"
            :slug="peekedStyle(group).slug"
            :display-name="peekedStyle(group).displayName"
          />
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
/* The last block of the overview page, so it also holds the space to the footer. */
.site-styles-table {
  padding-bottom: 96px;

  @media (max-width: 767px) {
    padding-bottom: 64px;
  }
}

.site-styles-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 56px;
  padding: 16px 0;
  border-top: 1px solid var(--db-line);
  border-bottom: 1px solid var(--db-line);

  &-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-left: 12px;
  }

  &-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid var(--db-line);
    background: var(--db-paper);
    font: inherit;
    font-size: 15px;
    font-weight: 500;
    color: var(--db-ink);
    cursor: pointer;

    &[aria-pressed='true'] {
      background: var(--db-ink);
      border-color: var(--db-ink);
      color: var(--db-paper);

      .site-styles-filter-count {
        color: inherit;
        opacity: 0.7;
      }
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
  }

  &-count {
    font-weight: 400;
    color: var(--db-muted);
  }

  &-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-left: auto;
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

  @media (max-width: 959px) {
    &-categories {
      margin-left: 0;
    }

    &-controls {
      margin-left: 0;
    }
  }

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
    margin-top: 40px;

    :deep(.site-search) {
      width: 100%;
    }
  }
}

.site-styles-empty {
  padding-top: 64px;
}

.site-styles-group {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-top: 96px;
  scroll-margin-top: calc(var(--db-header-h) + 24px);

  &-head {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 640px;
  }

  &-count {
    font-size: 16px;
    line-height: 26px;
    color: var(--db-muted);
  }

  &-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 336px;
    gap: 80px;
    align-items: start;
  }

  &-rows {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--db-line);
    min-width: 0;
  }

  &-aside {
    position: sticky;
    top: calc(var(--db-header-h) + 24px);
    min-width: 0;
  }

  @media (max-width: 959px) {
    gap: 24px;
    padding-top: 88px;

    &-head {
      gap: 8px;
    }

    &-count {
      font-size: 14px;
      line-height: 20px;
    }

    &-body {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }

    &-aside {
      position: static;
      order: -1;
      max-width: 480px;
    }
  }
}
</style>
