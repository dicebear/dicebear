<script setup lang="ts">
/**
 * The styles overview: filters in a sidebar and one flat list next to it, so
 * the first avatars sit right under the page head. The list runs by name,
 * and the usage sorts number the rows.
 *
 * Phones keep the search above the list and move the rest of the filters
 * into a sheet.
 */
import { computed, onMounted, ref } from 'vue';
import { useData } from 'vitepress';
import { SlidersHorizontal } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import { useStyleFiltering } from '@theme/composables/useStyleFiltering';
import { useStyleRankings } from '@theme/composables/useStyleRankings';
import {
  formatGrowth,
  growthDirection,
  trendSortValue,
} from '@theme/utils/statsTrends';
import SiteStylesRow, { type SiteStylesBadge } from './SiteStylesRow.vue';
import SiteStylesFilters, {
  type SiteStylesFacet,
} from './SiteStylesFilters.vue';
import SiteDialog from './SiteDialog.vue';
import SiteSearch from './SiteSearch.vue';

const { theme } = useData<ThemeOptions>();

const {
  searchQuery,
  selectedLicenses,
  selectedCategories,
  animatedOnly,
  availableLicenses,
  availableCategories,
  styleList,
  allStyles,
  matches,
} = useStyleFiltering(theme.value.avatarStyles);

const { rankingByName } = useStyleRankings();

/** `/styles/?animated=true` opens the list with the animated filter on. */
onMounted(() => {
  if (new URLSearchParams(window.location.search).get('animated') === 'true') {
    animatedOnly.value = true;
  }
});

type SortMode = 'name' | 'popular' | 'trending';
const sortBy = ref<SortMode>('name');
const sortOptions: { label: string; value: SortMode }[] = [
  { label: 'Name', value: 'name' },
  { label: 'Most used', value: 'popular' },
  { label: 'Trending', value: 'trending' },
];
const sortHints: Record<SortMode, string | undefined> = {
  name: undefined,
  popular:
    'Ranked by the number of websites that requested the style in the last complete week.',
  trending:
    'The past four weeks against the four before. New styles come first.',
};

// One category at a time, so the sidebar lists them as radios. The composable
// keeps a list because the playground reuses it with a multi-select.
const ALL = 'all';
const category = computed<string>({
  get: () => selectedCategories.value[0] ?? ALL,
  set: (value) => {
    selectedCategories.value = value === ALL ? [] : [value];
  },
});

function count(test: (style: (typeof allStyles.value)[number]) => boolean) {
  return allStyles.value.filter(test).length;
}

const categoryFacets = computed<SiteStylesFacet[]>(() => [
  { value: ALL, label: 'All', count: count((s) => matches(s, 'category')) },
  ...availableCategories.value.map((value) => ({
    value,
    label: value,
    count: count((s) => s.category === value && matches(s, 'category')),
  })),
]);

const licenseOrder = ['CC0 1.0', 'CC BY 4.0', 'MIT', 'Other'];
const licenseLabels: Record<string, string> = {
  Other: "Artist's own terms",
};

const licenseFacets = computed<SiteStylesFacet[]>(() =>
  [...availableLicenses.value]
    .sort((a, b) => licenseOrder.indexOf(a) - licenseOrder.indexOf(b))
    .map((value) => ({
      value,
      label: licenseLabels[value] ?? value,
      count: count(
        (s) => s.licenseNormalized === value && matches(s, 'license'),
      ),
    })),
);

const animatedCount = computed(() =>
  count((s) => s.animated && matches(s, 'animated')),
);

/** How many filters are on, for the button that opens them on phones. */
const activeFilters = computed(
  () =>
    selectedCategories.value.length +
    selectedLicenses.value.length +
    (animatedOnly.value ? 1 : 0),
);

function clearFilters() {
  searchQuery.value = '';
  selectedCategories.value = [];
  selectedLicenses.value = [];
  animatedOnly.value = false;
}

const sheetOpen = ref(false);

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

const styles = computed(() => {
  if (sortBy.value === 'name') {
    return styleList.value;
  }
  const list = [...styleList.value];
  if (sortBy.value === 'popular') {
    return list.sort(
      (a, b) =>
        usageRank(a.slug) - usageRank(b.slug) ||
        a.displayName.localeCompare(b.displayName),
    );
  }
  return list.sort(
    (a, b) =>
      trendScore(b.slug) - trendScore(a.slug) ||
      a.displayName.localeCompare(b.displayName),
  );
});

const ranked = computed(() => sortBy.value !== 'name');

/** The four card seeds of a style, for the avatars in its row. */
function rowSeeds(avatars: { seed: string }[]): string[] {
  return avatars.slice(0, 4).map((avatar) => avatar.seed);
}
</script>

<template>
  <div class="site-styles-table">
    <div class="site-container site-styles-layout">
      <aside class="site-styles-side" aria-label="Filters">
        <SiteSearch
          v-model="searchQuery"
          placeholder="Name or artist"
          label="Search styles"
          fluid
        />
        <SiteStylesFilters
          v-model:category="category"
          v-model:licenses="selectedLicenses"
          v-model:animated="animatedOnly"
          v-model:sort="sortBy"
          :category-options="categoryFacets"
          :license-options="licenseFacets"
          :animated-count="animatedCount"
          :sort-options="sortOptions"
          :sort-hint="sortHints[sortBy]"
        />
      </aside>

      <div class="site-styles-main">
        <div class="site-styles-bar">
          <SiteSearch
            v-model="searchQuery"
            placeholder="Name or artist"
            label="Search styles"
            fluid
          />
          <button
            type="button"
            class="site-btn site-btn-secondary"
            aria-haspopup="dialog"
            @click="sheetOpen = true"
          >
            <SlidersHorizontal :size="16" aria-hidden="true" />
            Filters
            <span v-if="activeFilters" class="site-styles-bar-count">{{
              activeFilters
            }}</span>
          </button>
        </div>

        <div v-if="styles.length" class="site-styles-list">
          <SiteStylesRow
            v-for="(style, index) in styles"
            :key="style.slug"
            :slug="style.slug"
            :display-name="style.displayName"
            :creator="style.creator"
            :license="
              licenseLabels[style.licenseNormalized] ?? style.licenseNormalized
            "
            :animated="style.animated"
            :seeds="rowSeeds(style.avatars)"
            :rank="ranked ? index + 1 : undefined"
            :badge="sortBy === 'trending' ? trendBadge(style.slug) : undefined"
          />
        </div>
        <div v-else class="site-styles-empty">
          <p class="site-text">No styles match these filters.</p>
          <button
            type="button"
            class="site-btn site-btn-secondary"
            @click="clearFilters"
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>

    <SiteDialog v-model:open="sheetOpen" sheet header="Filters">
      <div class="site-styles-sheet">
        <SiteStylesFilters
          v-model:category="category"
          v-model:licenses="selectedLicenses"
          v-model:animated="animatedOnly"
          v-model:sort="sortBy"
          :category-options="categoryFacets"
          :license-options="licenseFacets"
          :animated-count="animatedCount"
          :sort-options="sortOptions"
          :sort-hint="sortHints[sortBy]"
        />
        <div class="site-styles-sheet-foot">
          <button
            type="button"
            class="site-btn site-btn-secondary"
            :disabled="!activeFilters"
            @click="clearFilters"
          >
            Clear
          </button>
          <button
            type="button"
            class="site-btn site-btn-primary site-btn-fluid"
            @click="sheetOpen = false"
          >
            Show {{ styleList.length }}
            {{ styleList.length === 1 ? 'style' : 'styles' }}
          </button>
        </div>
      </div>
    </SiteDialog>
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

.site-styles-layout {
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  gap: 64px;
  align-items: start;
  margin-top: 72px;

  @media (max-width: 1099px) {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 40px;
  }

  @media (max-width: 767px) {
    display: block;
    margin-top: 24px;
  }
}

.site-styles-side {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;

  // Sticks only where the whole sidebar fits under the header, so its foot
  // never ends up out of reach.
  @media (min-height: 800px) {
    position: sticky;
    top: calc(var(--db-header-h) + 32px);
  }

  @media (max-width: 767px) {
    display: none;
  }
}

.site-styles-main {
  min-width: 0;
}

.site-styles-bar {
  display: none;

  @media (max-width: 767px) {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  &-count {
    min-width: 18px;
    padding: 0 5px;
    box-sizing: border-box;
    border-radius: 9px;
    background: var(--db-brand);
    color: var(--db-paper);
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
}

// The rows stack their text by the width of the list, not of the window, and
// paint their hover surface inside the list's own stacking context.
.site-styles-list {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--db-line);
  container-type: inline-size;
  isolation: isolate;
}

.site-styles-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 24px 0;
  border-top: 1px solid var(--db-line);
}

.site-styles-sheet {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 4px 16px 0;

  // Stays at the bottom of the sheet while the filters scroll behind it, so
  // the way back to the list is always in reach.
  &-foot {
    position: sticky;
    bottom: 0;
    display: flex;
    gap: 8px;
    margin-top: -12px;
    padding: 12px 0 max(16px, env(safe-area-inset-bottom));
    background: var(--db-panel);
  }
}
</style>
