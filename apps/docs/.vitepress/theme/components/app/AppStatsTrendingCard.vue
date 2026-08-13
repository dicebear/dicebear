<script setup lang="ts">
import { computed } from 'vue';
import { UiCard, UiAvatar } from '../ui';
import AppStatsSparkline from './AppStatsSparkline.vue';
import AppStatsTrendBadge from './AppStatsTrendBadge.vue';
import { type StyleRankingRow } from '../../utils/statsTrends';
import {
  styleDisplayName,
  stylePageUrl,
  styleSeed,
} from '../../utils/styleMeta';

const props = defineProps<{
  row: StyleRankingRow;
}>();

const displayName = computed(() => styleDisplayName(props.row.name));
const href = computed(() => stylePageUrl(props.row.name));
const avatarOptions = computed(() => ({
  seed: styleSeed(props.row.name),
  size: 96,
}));
</script>

<template>
  <UiCard :href="href" padding="lg" class="app-stats-trending-card">
    <div class="app-stats-trending-card-top">
      <UiAvatar
        :size="48"
        :style-name="row.name"
        :style-options="avatarOptions"
        alt=""
      />
      <AppStatsTrendBadge
        :growth="row.growth"
        :is-new="row.isNew"
        variant="pill"
      />
    </div>
    <div class="app-stats-trending-card-name">{{ displayName }}</div>
    <div class="app-stats-trending-card-websites">
      {{ row.websites.toLocaleString('en') }} websites
    </div>
    <AppStatsSparkline
      :values="row.spark"
      :width="180"
      :height="36"
      class="app-stats-trending-card-spark"
    />
  </UiCard>
</template>

<style lang="scss" scoped>
.app-stats-trending-card {
  &-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  &-websites {
    font-size: 13px;
    color: var(--vp-c-text-2);
    font-variant-numeric: tabular-nums;
  }

  &-spark {
    margin-top: 12px;
    color: var(--vp-c-brand-1);
  }
}
</style>
