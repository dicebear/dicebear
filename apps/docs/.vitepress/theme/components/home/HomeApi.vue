<script setup lang="ts">
/**
 * Section two: the hosted API. The headline, across the block, is the number
 * of requests of the latest complete month. Under it the text and the links,
 * then a bento grid: a card with the bars of the months up to it, the newest
 * one marked, and four colored tiles with what else the numbers say. The numbers arrive after mount; until then the headline says what
 * the API does and the bars keep their room.
 */
import { computed } from 'vue';
import { withBase } from 'vitepress';
import {
  compactNumber,
  spellNumber,
  useUsageStats,
} from '@theme/composables/useUsageStats';
import { LINKS } from '@theme/config/home';
import SiteStat from '../site/SiteStat.vue';

const { months, first, last, downloads, monthlyWebsites, perSecond, growth } =
  useUsageStats();

/** 289k, 2.3M: a figure short enough for a tile. */
function tileNumber(value: number): string {
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }

  return value >= 1000
    ? `${Math.round(value / 1000)}k`
    : value.toLocaleString('en-US');
}

const requests = computed(() =>
  last.value ? spellNumber(last.value.total) : null,
);

const bars = computed(() => {
  const top = Math.max(...months.value.map((month) => month.total), 1);

  return months.value.map((month, index) => ({
    key: month.key,
    height: `${((month.total / top) * 100).toFixed(1)}%`,
    title: `${month.short}: ${compactNumber(month.total)}`,
    first: index === 0,
    latest: index === months.value.length - 1,
  }));
});

const figures = computed(() => {
  const list: { tone: string; value: string; label: string }[] = [];

  if (monthlyWebsites.value !== null) {
    list.push({
      tone: 'is-sky',
      value: tileNumber(monthlyWebsites.value),
      label: `websites in ${last.value?.name}`,
    });
  }

  if (perSecond.value !== null) {
    list.push({
      tone: 'is-lilac',
      value: perSecond.value.toLocaleString('en-US'),
      label: 'requests a second',
    });
  }

  if (growth.value !== null && first.value) {
    list.push({
      tone: 'is-mint',
      value: `${growth.value > 0 ? '+' : ''}${growth.value}%`,
      label: `since ${first.value.name}`,
    });
  }

  if (downloads.value > 0) {
    list.push({
      tone: 'is-sun',
      value: tileNumber(downloads.value),
      label: `package downloads in ${last.value?.name}`,
    });
  }

  return list;
});

const label = computed(() =>
  first.value && last.value
    ? `Monthly API requests from ${first.value.long} to ${last.value.long}, from ${compactNumber(first.value.total)} to ${compactNumber(last.value.total)}`
    : 'Monthly API requests',
);
</script>

<template>
  <section class="site-box is-block is-soft home-api">
    <h2 class="site-headline home-api-title">
      <template v-if="requests">
        {{ requests.value }} {{ requests.unit }} requests a month
      </template>
      <template v-else>An avatar behind every URL</template>
    </h2>

    <div class="home-api-intro">
      <p class="site-lead home-api-lead">
        <template v-if="last">That was {{ last.long }}. </template>
        The hosted API answers every URL with an image and is free for
        non-commercial use. bunny.net sponsors the CDN behind it.
      </p>
      <div class="site-links home-api-links">
        <a :href="withBase(LINKS.httpApi)" class="site-link-arrow"
          >HTTP API docs</a
        >
        <a :href="withBase(LINKS.stats)" class="site-link-arrow"
          >All statistics</a
        >
        <a :href="withBase(LINKS.selfHost)" class="site-link-arrow"
          >Host it yourself</a
        >
      </div>
    </div>

    <div class="home-api-bento" :class="{ 'has-figures': figures.length }">
      <div class="site-box is-card home-api-chart">
        <h3 class="home-api-chart-title">Requests per month</h3>
        <div class="home-api-bars" role="img" :aria-label="label">
          <span
            v-for="bar in bars"
            :key="bar.key"
            class="home-api-slot"
            :class="{ 'is-latest': bar.latest }"
            :style="{ '--bar': bar.height }"
            :title="bar.title"
          >
            <i></i>
            <b v-if="bar.first && first" aria-hidden="true">{{
              compactNumber(first.total)
            }}</b>
            <b v-else-if="bar.latest && last" aria-hidden="true">{{
              compactNumber(last.total)
            }}</b>
          </span>
        </div>
        <div class="home-api-axis">
          <template v-if="first && last">
            <span
              >{{ first.short
              }}<span class="home-api-axis-value">
                · {{ compactNumber(first.total) }}</span
              ></span
            >
            <span>{{ last.short }}</span>
          </template>
        </div>
      </div>

      <div
        v-for="figure in figures"
        :key="figure.label"
        class="site-box is-tile home-api-tile"
        :class="figure.tone"
      >
        <SiteStat :value="figure.value" :label="figure.label" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-api {
  &-title {
    margin-bottom: clamp(20px, 2.2vw, 28px);
  }

  /* The text and the links share a row where both fit. */
  &-intro {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px 40px;
    margin-bottom: clamp(24px, 2.6vw, 36px);
  }

  &-lead {
    flex: 1 1 420px;
    max-width: 640px;
  }

  /* The card across the width and the tiles two by two; from 1120px the
     card takes half the width, beside them. */
  &-bento {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(10px, 1.2vw, 16px);

    @media (min-width: 1120px) {
      &.has-figures {
        grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(2, minmax(0, 1fr));
      }
    }
  }

  &-chart {
    grid-column: 1 / -1;

    @media (min-width: 1120px) {
      .has-figures > & {
        grid-column: 1;
        grid-row: 1 / span 2;
      }
    }

    &-title {
      margin-bottom: 12px;
      font-family: var(--db-font-display);
      font-size: 20px;
      line-height: 26px;
      font-weight: 700;
      color: var(--db-ink);
    }
  }

  /* The room on top is for the figures over the first and last bar. */
  &-bars {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    height: clamp(150px, 17vw, 240px);
    padding-top: 34px;
    border-bottom: 1px solid var(--db-line);
  }

  /* A column of the chart: at most 24px wide, grown from the baseline. */
  &-slot {
    position: relative;
    display: flex;
    flex: 0 1 24px;
    align-items: flex-end;
    margin-inline: 1px;

    i {
      width: 100%;
      height: var(--bar);
      border-radius: 4px 4px 0 0;
      background: color-mix(in srgb, var(--db-ink) 55%, var(--db-panel));
    }

    &.is-latest i {
      background: var(--db-ink);
    }

    b {
      position: absolute;
      bottom: calc(var(--bar) + 6px);
      left: 0;
      font-family: var(--db-font-display);
      font-size: 15px;
      line-height: 22px;
      font-weight: 700;
      color: var(--db-ink-2);
      white-space: nowrap;
    }

    /* Where the bars stand close, the first figure moves to the axis. */
    @media (max-width: 639px) {
      &:not(.is-latest) b {
        display: none;
      }
    }

    &.is-latest b {
      right: 0;
      left: auto;
      padding: 2px 10px;
      border-radius: 13px;
      background: var(--db-sun);
      font-weight: 800;
      color: var(--db-on);
    }
  }

  &-axis {
    display: flex;
    justify-content: space-between;
    min-height: 24px;
    margin-top: 10px;
    font-family: var(--db-font-display);
    font-size: 15px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink-2);

    &-value {
      display: none;

      @media (max-width: 639px) {
        display: inline;
      }
    }
  }

  /* The figure stands at the foot of its tile. On a phone, where a label
     can take two lines, at its head, so the numbers of a row stay level. */
  &-tile {
    display: flex;
    align-items: flex-end;
    min-height: clamp(120px, 13vw, 190px);

    /* While one figure is missing, the last tile closes the row. */
    &:nth-child(4):last-child {
      grid-column: span 2;
    }

    @media (max-width: 639px) {
      align-items: flex-start;
    }

    &.is-tile {
      padding: clamp(16px, 2vw, 28px);
    }

    :deep(.site-stat-value) {
      font-size: clamp(34px, 4vw, 56px);
      white-space: nowrap;

      @media (max-width: 479px) {
        font-size: 8.6vw;
      }
    }

    :deep(.site-stat-label) {
      margin-top: 8px;
      font-size: clamp(14px, 1.2vw, 17px);
      line-height: 1.35;
    }
  }
}
</style>
