<script setup lang="ts">
/**
 * The styles overview: filters in a sidebar and one flat list next to it, so
 * the first avatars sit right under the page head. The list runs by name,
 * and the usage sorts number the rows.
 *
 * Phones keep the search above the list and move the rest of the filters
 * into a sheet.
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useData, useRoute } from 'vitepress';
import { useTimeoutFn } from '@vueuse/core';
import { SlidersHorizontal, X } from '@lucide/vue';
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
const route = useRoute();

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
    'Ranked by the number of websites that requested the style in the last complete month.',
  trending:
    'The last complete month against the one before. New styles come first.',
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

/** The filters and the sort as a query string, the way the URL carries them. */
function filtersToSearch(): string {
  const params = new URLSearchParams();
  const query = searchQuery.value.trim();

  if (query) params.set('q', query);
  if (selectedCategories.value[0]) {
    params.set('category', selectedCategories.value[0].toLowerCase());
  }
  selectedLicenses.value.forEach((value) => params.append('license', value));
  if (animatedOnly.value) params.set('animated', 'true');
  if (sortBy.value !== 'name') params.set('sort', sortBy.value);

  const search = params.toString();

  return search ? `?${search}` : '';
}

let pagePath = '';
let lastSearch = '';

/**
 * Reads the filters from the URL, so a link, a reload and the way back from a
 * style find the list as it was. `/styles/#characters`, the link in a style's
 * crumbs, still opens that category.
 */
function applyUrl() {
  if (window.location.pathname !== pagePath) return;
  if (window.location.search === filtersToSearch() && !window.location.hash) {
    return;
  }

  writeUrl.stop();

  const params = new URLSearchParams(window.location.search);
  const wanted = (params.get('category') ?? route.hash.slice(1)).toLowerCase();
  const sort = params.get('sort');

  searchQuery.value = params.get('q') ?? '';
  category.value =
    availableCategories.value.find((name) => name.toLowerCase() === wanted) ??
    ALL;
  selectedLicenses.value = params
    .getAll('license')
    .filter((value) => availableLicenses.value.includes(value));
  animatedOnly.value = params.get('animated') === 'true';
  sortBy.value = sortOptions.some((option) => option.value === sort)
    ? (sort as SortMode)
    : 'name';
  lastSearch = filtersToSearch();
}

/**
 * Replaces the URL without a history entry, and tells the router, which keeps
 * its own copy of the query. Waits for a pause in typing, as Safari limits how
 * often a page may do this.
 */
function replaceUrl() {
  if (window.location.pathname !== pagePath) return;

  history.replaceState(history.state, '', pagePath + filtersToSearch());
  route.query = window.location.search;
  route.hash = '';
}

const writeUrl = useTimeoutFn(replaceUrl, 200, { immediate: false });

/** Writes a pending change at once, before a click can leave the page. */
function flushUrl() {
  if (!writeUrl.isPending.value) return;

  writeUrl.stop();
  replaceUrl();
}

onMounted(() => {
  pagePath = window.location.pathname;
  applyUrl();
  lastSearch = filtersToSearch();
});

watch(() => route.query + route.hash, applyUrl);

const statusLine = ref<HTMLElement | null>(null);
const sidebar = ref<HTMLElement | null>(null);
const list = ref<HTMLElement | null>(null);

/**
 * After a change the first result has to be in view, or a shorter list leaves
 * the reader looking at the footer. A sidebar that scrolls with the page
 * stays put as long as results stand next to it, so the control just used
 * does not jump away.
 */
function revealResults() {
  const line = statusLine.value;

  if (!line) return;

  const header = parseFloat(
    getComputedStyle(line).getPropertyValue('--db-header-h'),
  );

  if (line.getBoundingClientRect().top >= header) return;

  const side = sidebar.value;
  const sideScrolls =
    side?.offsetParent != null && getComputedStyle(side).position !== 'sticky';
  const resultsInView =
    (list.value?.getBoundingClientRect().bottom ?? 0) > header + 120;

  if (sideScrolls && resultsInView) return;

  line.scrollIntoView({ block: 'start', behavior: 'instant' });
}

watch(
  [searchQuery, selectedCategories, selectedLicenses, animatedOnly, sortBy],
  () => {
    const search = filtersToSearch();

    if (search === lastSearch) return;

    lastSearch = search;
    writeUrl.start();

    // The page does not scroll under an open sheet: closing it reveals.
    if (!sheetOpen.value) revealResults();
  },
  { flush: 'post' },
);

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

/** Whether anything narrows the list, the search included. */
const isFiltered = computed(
  () => activeFilters.value > 0 || searchQuery.value.trim() !== '',
);

const resultLabel = computed(() => {
  const total = allStyles.value.length;

  return isFiltered.value
    ? `${styleList.value.length} of ${total} styles`
    : `${total} styles`;
});

const sheetOpen = ref(false);

watch(sheetOpen, async (open) => {
  if (open) return;

  await nextTick();
  revealResults();
});

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
  <div class="site-styles-table" @focusout="flushUrl">
    <div class="site-container site-styles-layout">
      <aside
        ref="sidebar"
        class="site-box is-soft site-styles-side"
        aria-label="Filters"
      >
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

        <div ref="statusLine" class="site-styles-status">
          <p class="site-styles-status-text" role="status">{{ resultLabel }}</p>
          <button
            v-if="isFiltered"
            type="button"
            class="site-btn site-btn-ghost site-btn-sm"
            @click="clearFilters"
          >
            <X :size="16" aria-hidden="true" />
            Clear filters
          </button>
        </div>

        <div v-if="styles.length" ref="list" class="site-styles-list">
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
            :disabled="!isFiltered"
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
  grid-template-columns: 312px minmax(0, 1fr);
  gap: clamp(32px, 4vw, 64px);
  align-items: start;
  margin-top: clamp(40px, 5vw, 72px);

  @media (max-width: 1099px) {
    grid-template-columns: 260px minmax(0, 1fr);
  }

  @media (max-width: 767px) {
    display: block;
    margin-top: 24px;
  }
}

.site-styles-side {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  padding: 16px 16px 20px;
  border-radius: var(--db-radius-card);

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

    > :first-child {
      flex: 1;
      min-width: 0;
    }

    > .site-btn {
      flex-shrink: 0;
    }
  }

  &-count {
    min-width: 18px;
    padding: 0 5px;
    box-sizing: border-box;
    border-radius: 9px;
    background: var(--db-btn-bg);
    color: var(--db-btn-fg);
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
}

/* Always there and always as high as its button, so the list does not move
   when a filter turns the button on. */
.site-styles-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 36px;
  margin-bottom: 12px;
  scroll-margin-top: calc(var(--db-header-h) + 16px);

  &-text {
    margin: 0;
    font-size: 15px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink-2);
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
    background: var(--db-paper);
  }
}
</style>
