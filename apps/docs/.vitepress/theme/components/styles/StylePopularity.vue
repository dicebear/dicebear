<script setup lang="ts">
import { computed } from 'vue';
import { kebabCase } from 'change-case';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { UiCard } from '../ui';
import AppStatsSparkline from '../app/AppStatsSparkline.vue';
import AppStatsTrendBadge from '../app/AppStatsTrendBadge.vue';
import { useStyleRankings } from '../../composables/useStyleRankings';

const props = defineProps<{
  styleName: string;
}>();

const { rankings, rankingByName, currentWeekLabel } = useStyleRankings();

const row = computed(
  () => rankingByName.value?.[kebabCase(props.styleName)] ?? null,
);

const totalRanked = computed(() => rankings.value?.length ?? 0);

type RowKind = 'rank' | 'websites' | 'trend' | 'spark' | 'link';

const tableRows: { label: string; kind: RowKind }[] = [
  { label: 'Rank', kind: 'rank' },
  { label: 'Websites', kind: 'websites' },
  { label: 'Trend', kind: 'trend' },
  { label: 'Last 12 weeks', kind: 'spark' },
  { label: 'Statistics', kind: 'link' },
];
</script>

<template>
  <UiCard v-if="row" class="style-popularity-section" title="Popularity">
    <DataTable :value="tableRows">
      <Column field="label" style="width: 200px" />
      <Column>
        <template #body="{ data }">
          <template v-if="data.kind === 'rank'">
            #{{ row.rank }} of {{ totalRanked }} styles
          </template>
          <template v-else-if="data.kind === 'websites'">
            {{ row.websites.toLocaleString('en') }} in the week of
            {{ currentWeekLabel }}
          </template>
          <template v-else-if="data.kind === 'trend'">
            <AppStatsTrendBadge :growth="row.growth" :is-new="row.isNew" />
            <span class="style-popularity-trend-hint">
              vs. the four weeks before
            </span>
          </template>
          <span
            v-else-if="data.kind === 'spark'"
            class="style-popularity-spark"
          >
            <AppStatsSparkline :values="row.spark" :width="160" :height="32" />
          </span>
          <a v-else href="/stats/">Style rankings and trends</a>
        </template>
      </Column>
    </DataTable>
  </UiCard>
</template>

<style lang="scss" scoped>
.style-popularity-section {
  margin-bottom: 16px;

  :deep(.p-datatable-thead) {
    display: none;
  }
}

.style-popularity-trend-hint {
  margin-left: 8px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.style-popularity-spark {
  display: inline-block;
  color: var(--vp-c-text-3);
}
</style>
