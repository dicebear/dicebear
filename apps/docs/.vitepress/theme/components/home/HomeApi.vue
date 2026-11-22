<script setup lang="ts">
/**
 * Section two: the hosted API. The headline is the number of requests of the
 * latest complete month, the bars are the months up to it, the newest one
 * marked. The numbers arrive after mount; until then the headline says what
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
import SiteEyebrow from '../site/SiteEyebrow.vue';

const { months, first, last } = useUsageStats();

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

const label = computed(() =>
  first.value && last.value
    ? `Monthly API requests from ${first.value.long} to ${last.value.long}, from ${compactNumber(first.value.total)} to ${compactNumber(last.value.total)}`
    : 'Monthly API requests',
);
</script>

<template>
  <section class="site-box is-block is-soft home-api">
    <SiteEyebrow :face="2">The HTTP API</SiteEyebrow>
    <div class="site-pair home-api-grid">
      <div>
        <h2 class="site-headline">
          <template v-if="requests">
            {{ requests.value }} {{ requests.unit }}<br />requests a month
          </template>
          <template v-else>An avatar<br />behind every URL</template>
        </h2>
        <p class="site-lead home-api-lead">
          <template v-if="last">That was {{ last.long }}. </template>
          The hosted API answers every URL with an image and is free for
          non-commercial use. bunny.net sponsors the CDN behind it.
        </p>
      </div>
      <div class="home-api-chart">
        <div class="home-api-bars" role="img" :aria-label="label">
          <span
            v-for="bar in bars"
            :key="bar.key"
            :class="{ 'is-latest': bar.latest }"
            :style="{ height: bar.height }"
          ></span>
        </div>
        <div class="home-api-axis">
          <template v-if="first && last">
            <span>{{ first.short }} · {{ compactNumber(first.total) }}</span>
            <span>{{ last.short }} · {{ compactNumber(last.total) }}</span>
          </template>
        </div>
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
  </section>
</template>

<style scoped lang="scss">
.home-api {
  &-grid {
    margin-top: 24px;
    row-gap: 48px;
  }

  &-lead {
    max-width: 540px;
    margin-top: 28px;
  }

  &-bars {
    display: flex;
    align-items: flex-end;
    gap: 2.4%;
    height: clamp(140px, 16vw, 220px);

    > span {
      flex: 1;
      border-radius: 10px;
      background: color-mix(in srgb, var(--db-accent) 50%, transparent);
    }

    > .is-latest {
      background: var(--db-code-key);
    }
  }

  &-axis {
    display: flex;
    justify-content: space-between;
    min-height: 24px;
    margin-top: 14px;
    font-family: var(--db-font-display);
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink-2);
  }

  &-links {
    margin-top: clamp(24px, 2.8vw, 40px);
  }
}
</style>
