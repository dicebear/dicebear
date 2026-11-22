<script setup lang="ts">
/**
 * Section two: the hosted API. The headline, across the block, is the number
 * of requests of the latest complete month. Under it the text, a card with
 * the bars of the months up to it, the newest one marked, and three colored
 * tiles with what else the numbers say. The numbers arrive after mount; until then the headline says what
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

const { months, first, last, monthlyWebsites, perSecond, growth } =
  useUsageStats();

const requests = computed(() =>
  last.value ? spellNumber(last.value.total) : null,
);

const bars = computed(() => {
  const top = Math.max(...months.value.map((month) => month.total), 1);

  return months.value.map((month, index) => ({
    key: month.key,
    height: `${((month.total / top) * 100).toFixed(1)}%`,
    latest: index === months.value.length - 1,
  }));
});

const figures = computed(() => {
  const list: { tone: string; value: string; label: string }[] = [];

  if (monthlyWebsites.value !== null) {
    list.push({
      tone: 'is-sky',
      value: `${Math.round(monthlyWebsites.value / 1000)}k`,
      label: 'websites a week',
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

    <div class="home-api-grid">
      <p class="site-lead home-api-lead">
        <template v-if="last">That was {{ last.long }}. </template>
        The hosted API answers every URL with an image and is free for
        non-commercial use. bunny.net sponsors the CDN behind it.
      </p>

      <div class="site-box is-card home-api-chart">
        <div class="home-api-bars" role="img" :aria-label="label">
          <span
            v-for="(bar, index) in bars"
            :key="bar.key"
            :class="{ 'is-latest': bar.latest }"
            :style="{ height: bar.height }"
          >
            <b v-if="index === 0 && first" aria-hidden="true">{{
              compactNumber(first.total)
            }}</b>
            <b v-else-if="bar.latest && last" aria-hidden="true">{{
              compactNumber(last.total)
            }}</b>
          </span>
        </div>
        <div class="home-api-axis">
          <template v-if="first && last">
            <span>{{ first.short }}</span>
            <span>{{ last.short }}</span>
          </template>
        </div>
      </div>

      <div v-if="figures.length" class="site-grid home-api-figures">
        <div
          v-for="figure in figures"
          :key="figure.label"
          class="site-box is-tile"
          :class="figure.tone"
        >
          <SiteStat :value="figure.value" :label="figure.label" />
        </div>
      </div>

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
  </section>
</template>

<style scoped lang="scss">
.home-api {
  &-title {
    margin-bottom: clamp(32px, 3.4vw, 48px);
  }

  /* One column: text, chart, figures, links. From 1120px the text and the
     links stand beside the chart and the figures run across under them. */
  &-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'lead' 'chart' 'figures' 'links';
    gap: 28px;

    @media (min-width: 1120px) {
      grid-template-columns: minmax(0, 3fr) minmax(0, 5fr);
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        'lead chart'
        'links chart'
        'figures figures';
      gap: 24px clamp(40px, 5vw, 88px);
    }
  }

  &-lead {
    grid-area: lead;
    max-width: 540px;
  }

  &-chart {
    grid-area: chart;
  }

  &-figures {
    --site-grid-min: 220px;

    grid-area: figures;
    gap: 16px;
  }

  &-links {
    grid-area: links;
    align-self: start;

    /* One under the other in the narrow column beside the chart. */
    @media (min-width: 1120px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }

  /* The room on top is for the figures over the first and last bar. */
  &-bars {
    display: flex;
    align-items: flex-end;
    gap: 2.4%;
    height: clamp(140px, 15vw, 210px);
    padding-top: 36px;

    > span {
      position: relative;
      flex: 1;
      border-radius: 10px;
      background: color-mix(in srgb, var(--db-ink) 55%, var(--db-panel));
    }

    > .is-latest {
      background: var(--db-ink);
    }

    b {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 0;
      font-family: var(--db-font-display);
      font-size: 15px;
      line-height: 22px;
      font-weight: 700;
      color: var(--db-ink-2);
      white-space: nowrap;
    }

    > .is-latest b {
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
    margin-top: 12px;
    font-family: var(--db-font-display);
    font-size: 15px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink-2);
  }
}
</style>
