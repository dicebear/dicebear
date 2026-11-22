<script setup lang="ts">
/**
 * Every style ranked by the websites that requested it in the latest
 * complete week. The first three stand on a podium, the next ten in a list
 * with a bar for their share and a tag for their trend; the rest on
 * request, and a search across all of them.
 */
import { computed, ref } from 'vue';
import { capitalCase, kebabCase } from 'change-case';
import { ArrowDown, ArrowUp } from '@lucide/vue';
import type { StyleRankingRow } from '@theme/utils/statsTrends';
import { formatGrowth, growthDirection } from '@theme/utils/statsTrends';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import SiteAvatar from './SiteAvatar.vue';
import SiteSearch from './SiteSearch.vue';

const props = defineProps<{
  rows: StyleRankingRow[];
  weekLabel: string;
  websites: number | null;
}>();

const SHOWN = 10;

const query = ref('');
const expanded = ref(false);

/** Second, first, third: the order of a podium. */
const podium = computed(() => {
  const [first, second, third] = props.rows;

  return [
    { row: second, tone: 'lilac', place: 2 },
    { row: first, tone: 'sun', place: 1 },
    { row: third, tone: 'mint', place: 3 },
  ].filter((step) => step.row);
});

const searching = computed(() => query.value.trim() !== '');

const list = computed(() => {
  const q = query.value.trim().toLowerCase();

  if (q) {
    return props.rows.filter((row) =>
      capitalCase(row.name).toLowerCase().includes(q),
    );
  }

  const rest = props.rows.slice(3);

  return expanded.value ? rest : rest.slice(0, SHOWN);
});

/** The bars measure against the largest share in the list. */
const top = computed(() => Math.max(...list.value.map((row) => row.share), 1));

/** A new style counts as a gain, like the arrow beside it says. */
function direction(row: StyleRankingRow): 'up' | 'down' | 'flat' {
  return row.isNew ? 'up' : growthDirection(row.growth);
}

function trend(row: StyleRankingRow): string {
  return row.isNew ? 'New' : formatGrowth(row.growth);
}

function share(value: number): string {
  return `${value.toFixed(1)}%`;
}

function seed(name: string): string {
  return getStyleCardSeeds(kebabCase(name))[0] ?? 'Felix';
}
</script>

<template>
  <section class="site-container site-stats-rankings">
    <div class="site-pair">
      <h2 class="site-headline">Style rankings</h2>
      <p class="site-lead">
        Every style, ranked by the number of websites that requested it in the
        week of {{ weekLabel }}. The trend compares the past four weeks with the
        four before.
      </p>
    </div>

    <ol v-if="!searching" class="site-stats-rankings-podium">
      <li
        v-for="step in podium"
        :key="step.row.name"
        :class="`is-${step.place}`"
      >
        <SiteAvatar
          sticker
          :style-name="kebabCase(step.row.name)"
          :options="{ seed: seed(step.row.name) }"
          :alt="`${capitalCase(step.row.name)} avatar`"
        />
        <a
          :href="`/styles/${kebabCase(step.row.name)}/`"
          class="site-box site-stats-rankings-step"
          :class="`is-${step.tone}`"
        >
          <span class="site-stats-rankings-step-share">{{
            share(step.row.share)
          }}</span>
          <span class="site-stats-rankings-step-name"
            >{{ step.place }}. {{ capitalCase(step.row.name) }}</span
          >
          <span class="site-stats-rankings-step-sites"
            >{{ step.row.websites.toLocaleString('en-US') }} websites</span
          >
        </a>
      </li>
    </ol>

    <div class="site-table-card site-stats-rankings-list">
      <a
        v-for="row in list"
        :key="row.name"
        :href="`/styles/${kebabCase(row.name)}/`"
        class="site-stats-rankings-row"
      >
        <span class="site-stats-rankings-rank">{{ row.rank }}</span>
        <SiteAvatar
          :style-name="kebabCase(row.name)"
          :options="{ seed: seed(row.name) }"
          :size="52"
          :alt="`${capitalCase(row.name)} avatar`"
        />
        <span class="site-stats-rankings-name">{{
          capitalCase(row.name)
        }}</span>
        <span class="site-stats-rankings-track" aria-hidden="true">
          <span :style="{ width: `${(row.share / top) * 100}%` }"></span>
        </span>
        <span class="site-stats-rankings-share">{{ share(row.share) }}</span>
        <span
          class="site-tag site-stats-rankings-trend"
          :class="`is-${direction(row)}`"
        >
          <ArrowUp
            v-if="direction(row) === 'up'"
            :size="14"
            aria-hidden="true"
          />
          <ArrowDown
            v-else-if="direction(row) === 'down'"
            :size="14"
            aria-hidden="true"
          />
          {{ trend(row) }}
        </span>
      </a>
      <p v-if="list.length === 0" class="site-text site-stats-rankings-empty">
        No style matches “{{ query.trim() }}”.
      </p>
    </div>

    <div class="site-stats-rankings-foot">
      <button
        v-if="!searching && rows.length > SHOWN + 3"
        type="button"
        class="site-btn site-btn-primary site-btn-lg"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'Show fewer' : `Show all ${rows.length} styles` }}
      </button>
      <SiteSearch
        v-model="query"
        placeholder="Search styles"
        label="Search styles"
        size="lg"
        class="site-stats-rankings-search"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.site-stats-rankings {
  padding-top: clamp(56px, 6.4vw, 96px);
  padding-bottom: clamp(56px, 6.4vw, 96px);

  /* Three steps of a podium, the first in the middle and highest. */
  &-podium {
    display: flex;
    align-items: flex-end;
    gap: clamp(8px, 1.6vw, 24px);
    max-width: 980px;
    margin: clamp(40px, 5vw, 72px) auto 0;

    > li {
      display: flex;
      flex: 1 1 0;
      flex-direction: column;
      align-items: center;
      min-width: 0;

      > :first-child {
        position: relative;
        z-index: 1;
        margin-bottom: -6%;
      }
    }

    .is-1 > :first-child {
      width: 58%;
      transform: rotate(-3deg);
    }

    .is-2 > :first-child {
      width: 46%;
      transform: rotate(4deg);
    }

    .is-3 > :first-child {
      width: 40%;
      transform: rotate(-5deg);
    }
  }

  &-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: clamp(28px, 3.4vw, 48px) 12px 20px;
    border-radius: clamp(20px, 2.6vw, 36px) clamp(20px, 2.6vw, 36px) 0 0;
    color: var(--db-accent);
    text-align: center;

    .is-1 & {
      height: clamp(220px, 27vw, 360px);
    }

    .is-2 & {
      height: clamp(170px, 20vw, 260px);
    }

    .is-3 & {
      height: clamp(150px, 16vw, 210px);
    }

    &-share {
      font-family: var(--db-font-display);
      font-size: clamp(34px, 4.6vw, 68px);
      line-height: 1;
      font-weight: 800;
      letter-spacing: -0.03em;
    }

    &-name {
      margin-top: 8px;
      font-family: var(--db-font-display);
      font-size: clamp(17px, 1.9vw, 26px);
      line-height: 1.2;
      font-weight: 700;
    }

    &-sites {
      margin-top: 4px;
      font-size: clamp(13px, 1.1vw, 15px);
      line-height: 1.4;
      color: var(--db-ink-2);
    }
  }

  &-list {
    display: flex;
    flex-direction: column;
  }

  /* Rank, avatar, name, bar, share and trend in one row. */
  &-row {
    display: grid;
    grid-template-columns:
      28px 52px minmax(96px, 1.1fr) minmax(0, 3fr)
      auto auto;
    gap: 8px clamp(10px, 1.6vw, 24px);
    align-items: center;
    min-height: 68px;
    color: var(--db-ink);

    @media (max-width: 767px) {
      grid-template-columns: 28px 44px minmax(0, 1fr) auto;

      --site-avatar-size: 44px;

      > :nth-child(4),
      > :nth-child(6) {
        display: none;
      }
    }
  }

  &-rank {
    font-family: var(--db-font-display);
    font-size: 20px;
    line-height: 1;
    font-weight: 800;
    color: var(--db-muted);
  }

  &-name {
    font-family: var(--db-font-display);
    font-size: clamp(18px, 1.8vw, 24px);
    line-height: 1.2;
    font-weight: 700;
  }

  &-step:hover &-step-name,
  &-row:hover &-name {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
  }

  &-track {
    display: block;
    height: 20px;
    border-radius: 10px;
    background: var(--db-soft);

    > span {
      display: block;
      height: 100%;
      border-radius: 10px;
      background: var(--db-ink);
    }
  }

  &-share {
    min-width: 56px;
    font-family: var(--db-font-display);
    font-size: 18px;
    line-height: 1;
    font-weight: 700;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  /* Up in mint, down in coral, both in their light shade in every theme. */
  &-trend {
    justify-content: center;
    min-width: 68px;
    font-variant-numeric: tabular-nums;

    &.is-up {
      background: var(--db-mint-light);
      color: var(--db-on);
    }

    &.is-down {
      background: var(--db-coral);
      color: var(--db-on);
    }

    &.is-flat {
      background: var(--db-soft);
    }
  }

  &-empty {
    padding: 20px 0;
  }

  &-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 24px;
    margin-top: 24px;
  }

  &-search {
    width: min(320px, 100%);
  }
}
</style>
